import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dto/Register.dto';
import * as crypto from 'crypto';
import { Hash } from './schemas/auth.schema';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './schemas/role.schema';
import { LoginDto } from './dto/Login.dto';
import { JwtService } from '@nestjs/jwt'
import { ElandMailService } from '@eland/eland-library/eland-mail.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ElandAuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Role') private readonly roleModel: Model<Role>,
    @Inject(ElandMailService) private readonly mailService: ElandMailService,

    private readonly jwtService: JwtService
  ){}

  async register(registerDto: RegisterDto){
    const { email, password, firstname, lastname } = registerDto;

    try {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            return { success: false, message: 'User already exists' }; // Returning instead of throwing
        }
    } catch (error) {
        console.error('Error checking existing user:', error);
    }

    // Hash password
    const hashedPassword = crypto.createHash(Hash.sha256).update(password).digest('hex');
    
    // Create activation token
    const activationToken = uuidv4();
    
    // Create new user if role exists
    const role = await this.roleModel.findOne({ name: "admin" });
    if (!role) {
      throw new Error("Admin role not found. Ensure roles are seeded in the database.");
    }
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      isActive: false,
      activationToken,
      role: role._id
    });
    
    await newUser.save();

    // Send activation email
    await this.mailService.sendActivationEmail(email, activationToken);
    
    return {
      success: true,
      message: 'Registration successful. Please check your email to activate your account.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new RpcException('Invalid credentials');
    }
    
    // Check if account is activated
    if (!user.isActive) {
      throw new RpcException('Please activate your account first');
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    // Validate password
    const isPasswordValid = (hashedPassword === user.password);
    if (!isPasswordValid) {
      throw new RpcException('Invalid credentials');
    }
    
    // Generate tokens
    const payload = { sub: user._id, email: user.email, roleId: user.role };
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m' // Short-lived access token
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d' // Long-lived refresh token
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        roleId: user.role,
      },
    };
  }

  
  async activateAccount(token: string) {
    if(!token){
      return {
        success: false,
        message: 'Token is required',
      };
    }

    const user = await this.userModel.findOne({ activationToken: token });
    if (!user) {
      throw new RpcException('Invalid activation token');
    }
    
    user.isActive = true;
    user.activationToken = null;
    
    await user.save();
    
    return {
      success: true,
      message: 'Account activated successfully',
    };
  }

  async resendActivationEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    
    if (!user) {
      throw new RpcException('User not found');
    }
    
    if (user.isActive) {
      throw new RpcException('Account is already active');
    }
    
    // Generate new activation token
    const activationToken = uuidv4();
    user.activationToken = activationToken;
    
    await user.save();
    
    // Send activation email
    await this.mailService.sendActivationEmail(email, activationToken);
    
    return {
      success: true,
      message: 'Activation email sent successfully',
    };
  }


  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async removeUser(email: string) {
    return this.userModel.deleteOne({ email });
  }


}

