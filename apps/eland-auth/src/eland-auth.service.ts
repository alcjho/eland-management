import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/Login.dto';
import { JwtService } from '@nestjs/jwt';
import { ElandMailService } from '@eland/eland-library/eland-mail.service';
import { RpcException } from '@nestjs/microservices';
import { Owner } from './entities/owner.entity';
import { Manager } from './entities/manager.entity';
import { Tenant } from './entities/tenant.entity';
import { OwnerDto } from './dto/owner.dto';
import { TenantDto } from './dto/tenant.dto';
import { UserDto } from './dto/User.dto';
import { ManagerDto } from './dto/manager.dto';

const HASH_ALGORITHM = 'sha256';

@Injectable()
export class ElandAuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Owner) private readonly ownerRepository: Repository<Owner>,
    @InjectRepository(Manager) private readonly managerRepository: Repository<Manager>,
    @InjectRepository(Tenant) private readonly tenantRepository: Repository<Tenant>,
    @Inject(ElandMailService) private readonly mailService: ElandMailService,
    private readonly jwtService: JwtService
  ) {}

  async registerOwner(dto: UserDto & OwnerDto) { // Un DTO qui combine User et Owner
    // 1. Création de l'identité (User)
    const user = await this.createBaseUser(dto, 'owner');
    
    if(!user){
      throw new RpcException('Failed to create user');
    }

    // 2. Création du profil Business (Owner)
    // On utilise la propriété 'user' pour établir le lien OneToOne
    const owner = this.ownerRepository.create({
      user: user,             // Lien direct vers l'entité User (pour le cascade delete)
      ownerUserId: user.id,   // On remplit aussi la colonne explicite si nécessaire
      mainOwnerId: user.id,   // L'Owner est son propre racine (Top-level)
      fullname: `${user.firstname} ${user.lastname}`,
      isMainOwner: true,
      ownerIdToken: uuidv4(),
      gender: dto.gender,
      startDate: new Date(),
      sharePct: 100,          // Par défaut 100% pour le créateur
    });
    
    await this.ownerRepository.save(owner);

    // update user with ownerId for easier access in JWT and other services
    user.ownerId = owner.ownerUserId;
    await this.userRepository.save(user);
    
    return { 
        message: 'Owner registered successfully', 
        userId: user.id,
        ownerId: user.id, // Très important pour le JWT et le Storage Service
    };
  }

  // 2. MANAGER REGISTRATION (Linked)
  async registerManager(dto: UserDto & ManagerDto, ownerId: string) {
    const user = await this.createBaseUser(dto, 'manager');

    const manager = this.managerRepository.create({
      user: user,
      fullname: `${user.firstname} ${user.lastname}`,
      gender: dto.gender,
      title: dto.title,
      workingStatus: 'active',
      startDate: new Date(),
      refPhone: dto.refPhone
    });

    await this.managerRepository.save(manager);

    // update user with ownerId for easier access in JWT and other services
    user.ownerId = ownerId;
    await this.userRepository.save(user);

    return { message: 'Manager created and linked to owner', userId: user.id, token: user.activationToken };
  }

  // 3. TENANT REGISTRATION (Linked)
  async registerTenant(dto: UserDto & TenantDto) {
    const user = await this.createBaseUser(dto, 'tenant');

    const optionals = { 
      partnerName: dto.partnerName, 
      haveKids: dto.haveKids, 
      numberOfKids: dto.numberOfKids, 
      dateOfBirth: dto.dateOfBirth, 
      phoneNumber: dto.phoneNumber, 
      emergencyContact: dto.emergencyContact 
    }; 
    const tenant = this.tenantRepository.create({
      user: user,
      fullname: `${user.firstname} ${user.lastname}`,
      gender: dto.gender,
      occupation: dto.occupation,
      maritalStatus: dto.maritalStatus,
      ...(dto.partnerName && { partnerName: dto.partnerName }),
      ...(dto.haveKids !== undefined && { haveKids: dto.haveKids }),
      ...(dto.numberOfKids && { numberOfKids: dto.numberOfKids }),
      ...(dto.dateOfBirth && { dateOfBirth: dto.dateOfBirth }),
      ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber }),
      ...(dto.emergencyContact && { emergencyContact: dto.emergencyContact }),
    });

    await this.tenantRepository.save(tenant);
    return { message: 'Tenant created and linked to owner', userId: user.id, token: user.activationToken };
  }

  // SHARED HELPER (Identity Creation)
  private async createBaseUser(dto: any, roleName: string): Promise<User> {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    const hashedPassword = await crypto.createHash(HASH_ALGORITHM).update(dto.password).digest('hex');

    // Create activation token
    const activationToken = uuidv4();

    if (!role) {
      throw new BadRequestException(`Role ${roleName} not found`);
    }

    const userExists = await this.userRepository.findOne({ where: { email: dto.email } });
    
    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const user = this.userRepository.create({
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      password: hashedPassword,
      activationToken,
      role: role,
      isActive: false, // Or false if you use email activation
    });

    const result = await this.userRepository.save(user);

    if(result){
      // Send activation email
      await this.mailService.sendActivationEmail(dto.email, activationToken);
      return result;
    }else{
      throw new RpcException('Failed to create user');
    }
  }
  

  /**
   * User login with email and password
   * @param loginDto
   * @returns
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role']
    });

    console.log('Login attempt for email:', email, 'User found:', !!user);
    if (!user) {
      throw new RpcException('Invalid credentials');
    }

    // Check if account is activated
    if (!user.isActive) {
      throw new RpcException('Please activate your account first');
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Validate password
    const isPasswordValid = hashedPassword === user.password;
    if (!isPasswordValid) {
      throw new RpcException('Invalid credentials');
    }  

    // Generate tokens
    const payload = this.createSecurePayload(user);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '45m' // Short-lived access token
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d' // Long-lived refresh token
    });

    return {
      accessToken,
      refreshToken,
      user: payload.user
    };
  }

  /**
   * Refresh the access token using a valid refresh token
   * @param refreshToken
   * @returns
   */
  async refreshToken(refreshToken: string) {
    // Verify the refresh token
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Ensure the user exists
      const user = await this.userRepository.findOne({
        where: { id: payload.user.id },
        relations: ['role']
      });

      if (!user) {
        throw new RpcException('User not found');
      }

      // Generate new tokens
      const newPayload = this.createSecurePayload(user);
      const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '60m' });

      return {
        status: 200,
        accessToken: newAccessToken,
        refreshToken // Optionally generate a new refresh token if needed
      };
    } catch (error) {
      throw new RpcException('Invalid or expired refresh token');
    }
  }

  /**
   * Create a secure JWT payload from user data
   * @param user
   * @param ownerId
   * @returns
   */
  createSecurePayload(user: User): any {
    const userPayload = {
      id: user.id,
      ownerId: user.ownerId,
      locationId: user.locationId,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isActive: user.isActive,
      blockedPermissions: user.blockedPermissions,
      role: user.role
        ? {
            id: user.role.id,
            name: user.role.name,
            permissions: user.role.permissions
          }
        : null
    };

    return {
      sub: user.id,
      user: userPayload
    };
  }

  /**
   * Assign a user to a location using an activation token
   * @param token
   * @returns
   */
  async setUserLocation(token: string, locationId: string) {
    if (!token) {
      return {
        success: false,
        message: 'A Token is required for location assignment'
      };
    }

    const user = await this.userRepository.findOne({ where: { activationToken: token } });
    if (!user) {
      throw new RpcException('Invalid location update token');
    }

    user.locationId = locationId;

    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Location assigned successfully'
    };
  }

  /**
   * Activate a user account using activation token
   * @param token
   * @returns
   */
  async activateAccount(token: string) {
    if (!token) {
      return {
        success: false,
        message: 'Token is required'
      };
    }

    const user = await this.userRepository.findOne({ where: { activationToken: token } });
    if (!user) {
      throw new RpcException('Invalid activation token');
    }

    user.isActive = true;
    user.activationToken = null;

    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Account activated successfully'
    };
  }

  /**
   * Resend activation email to user
   * @param email
   * @returns
   */
  async resendActivationEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new RpcException('User not found');
    }

    if (user.isActive) {
      throw new RpcException('Account is already active');
    }

    // Generate new activation token
    const activationToken = uuidv4();
    user.activationToken = activationToken;

    await this.userRepository.save(user);

    // Send activation email
    await this.mailService.sendActivationEmail(email, activationToken);

    return {
      success: true,
      message: 'Activation email sent successfully'
    };
  }

  /**
   * Find a user by email address
   * @param email
   * @returns
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Remove a user by email address
   * @param email
   * @returns
   */
  async removeUser(email: string) {
    return this.userRepository.delete({ email });
  }

  /**
   * Update user profile information
   * @param userId
   * @param data
   * @returns
   */
  async updateProfile(userId: string, data: any) {
    // Remove password from update data to prevent accidental changes
    const { password, ...updateData } = data;

    // Validate UUID format if provided
    if (updateData.role && typeof updateData.role === 'string') {
      // Validate that the role exists
      const roleExists = await this.roleRepository.findOne({ where: { id: updateData.role } });
      if (!roleExists) {
        return { status: 400, message: 'Invalid role ID' };
      }
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    Object.assign(user, updateData);
    const updated = await this.userRepository.save(user);

    return { status: 200, message: updated };
  }

  /**
   * Change user password with security checks
   * @param userId
   * @param changePasswordDto
   * @returns
   */
  async changePassword(
    userId: string,
    changePasswordDto: { currentPassword: string; newPassword: string }
  ) {
    const { currentPassword, newPassword } = changePasswordDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    // Verify current password
    const currentHashedPassword = crypto.createHash(HASH_ALGORITHM).update(currentPassword).digest('hex');
    if (currentHashedPassword !== user.password) {
      return { status: 400, message: 'Current password is incorrect' };
    }

    // Hash new password
    const newHashedPassword = crypto.createHash(HASH_ALGORITHM).update(newPassword).digest('hex');

    // Update password
    user.password = newHashedPassword;
    const updated = await this.userRepository.save(user);

    if (!updated) {
      throw new RpcException('Failed to update password');
    }

    return { status: 200, message: 'Password changed successfully' };
  }
}
