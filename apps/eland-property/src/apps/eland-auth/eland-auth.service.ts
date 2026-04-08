import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Tenant } from './entities/tenant.entity';
import { Manager } from './entities/manager.entity';
import { Owner } from './entities/owner.entity';
import { RegisterDto } from './dto/Register.dto';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/Login.dto';
import { JwtService } from '@nestjs/jwt';
import { ElandMailService } from '@eland/eland-library/eland-mail.service';
import { RpcException } from '@nestjs/microservices';
import { TenantDto } from './dto/tenant.dto';

const HASH_ALGORITHM = 'sha256';

@Injectable()
export class ElandAuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Tenant) private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Manager) private readonly managerRepository: Repository<Manager>,
    @InjectRepository(Owner) private readonly ownerRepository: Repository<Owner>,
    @Inject(ElandMailService) private readonly mailService: ElandMailService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstname, lastname } = registerDto;

    try {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        return { success: false, message: 'User already exists' };
      }
    } catch (error) {
      console.error('Error checking existing user:', error);
    }

    // Hash password
    const hashedPassword = crypto.createHash(HASH_ALGORITHM).update(password).digest('hex');

    // Create activation token
    const activationToken = uuidv4();

    // Create new user if role exists
    const role = await this.roleRepository.findOne({ where: { name: 'admin' } });
    if (!role) {
      throw new Error('Admin role not found. Ensure roles are seeded in the database.');
    }

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      isActive: false,
      activationToken,
      role
    });

    await this.userRepository.save(newUser);

    // Send activation email
    await this.mailService.sendActivationEmail(email, activationToken);

    return {
      success: true,
      message: 'Registration successful. Please check your email to activate your account.'
    };
  }

  /**
   * Register a new co-owner using an owner invitation token
   * @param ownerIdToken
   * @param registerDto
   * @returns
   */
  async registerAsCoOwner(ownerIdToken: string, registerDto: RegisterDto) {
    const owner = await this.ownerRepository.findOne({ where: { ownerIdToken } });
    if (!owner) {
      return {
        status: 422,
        message: 'Owner not found. Please contact the owner for a new token and try again'
      };
    }

    try {
      const { email } = registerDto;

      // Role has to exists before continuing
      const role = await this.roleRepository.findOne({ where: { name: 'admin' } });
      if (!role) {
        throw new Error('Admin role not found. Ensure roles are seeded in the database.');
      }
      const coOwner = await this.createCoOwner(role, owner.mainOwnerId, registerDto);
      if (!coOwner) {
        throw new Error('Failed to add new co-owner.');
      }
      return {
        status: 200,
        message: 'A new co-owner has been added',
        data: coOwner
      };
    } catch (error) {
      console.error('Error checking existing user:', error);
    }
  }

  /**
   * Transfer ownership from one owner to another
   * @param mainOwner
   * @param newOwner
   * @returns
   */
  async transferOwnership(mainOwner: Owner, newOwner: Owner) {
    const updatedMainOwner = await this.ownerRepository.findOne({
      where: { ownerUserId: mainOwner.ownerUserId }
    });

    if (!updatedMainOwner) {
      throw new RpcException('Owner not found');
    }

    updatedMainOwner.mainOwnerId = newOwner.ownerUserId;
    updatedMainOwner.isMainOwner = false;

    await this.ownerRepository.save(updatedMainOwner);

    const updatedCoOwner = await this.ownerRepository.findOne({
      where: { ownerUserId: newOwner.ownerUserId }
    });

    if (!updatedCoOwner) {
      throw new RpcException('Failed to update new Ownership profile to principal owner');
    }

    updatedCoOwner.mainOwnerId = newOwner.ownerUserId;
    updatedCoOwner.isMainOwner = true;

    await this.ownerRepository.save(updatedCoOwner);

    return {
      status: 200,
      message: `Ownership transferred successfully to ${updatedCoOwner.fullname}. You are now a co-owner.`
    };
  }

  /**
   * Create a new co-owner with associated user account
   * @param role
   * @param mainOwnerId
   * @param user
   * @returns
   */
  async createCoOwner(role: Role, mainOwnerId: string, user: any) {
    const { email, password, firstname, lastname } = user;
    const hashedPassword = crypto.createHash(HASH_ALGORITHM).update(password).digest('hex');
    const activationToken = uuidv4();

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      isActive: false,
      activationToken,
      role
    });

    await this.userRepository.save(newUser);

    if (!newUser) {
      throw new RpcException('failed to register user information for co-owner');
    }

    const newOwner = this.ownerRepository.create({
      mainOwnerId,
      ownerUserId: newUser.id,
      fullname: `${newUser.firstname} ${newUser.lastname}`,
      isMainOwner: false
    });

    const result = await this.ownerRepository.save(newOwner);

    if (!result) {
      throw new RpcException('failed to register co-owner additional information');
    }

    // Send activation email
    await this.mailService.sendActivationEmail(email, activationToken);
    return result;
  }

  /**
   * Invite a co-owner using an invitation token
   * @param ownerIdToken
   * @param email
   * @returns
   */
  async inviteCoOwner(ownerIdToken: string, email: string): Promise<{ status: number; message: string }> {
    const owner = await this.ownerRepository.findOne({ where: { ownerIdToken } });
    if (!owner || !owner.isMainOwner) {
      return {
        status: 422,
        message: 'Cannot verify your identity as a main owner. Only the main owner can invite others'
      };
    }

    const coOwnerUser = await this.userRepository.findOne({ where: { email } });
    const coOwner = await this.ownerRepository.findOne({
      where: { ownerUserId: coOwnerUser?.id }
    });

    // if the coOwner already exist and already have the owner as main owner don't send the email.
    const mainOwnerId = coOwner?.mainOwnerId;
    const refMainOwnerId = owner?.ownerUserId;
    if (mainOwnerId === refMainOwnerId) {
      return {
        status: 422,
        message: `Seems you already have ${coOwnerUser.firstname} ${coOwnerUser.lastname} as co-owner.`
      };
    }

    await this.mailService.inviteCoOwner(email, ownerIdToken);
    return {
      status: 200,
      message: `Invitation has been sent to ${email}`
    };
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

    const ownerId = await this.getOwnerForUser(user);

    // Generate tokens
    const payload = this.createSecurePayload(user, ownerId);

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

      const ownerId = await this.getOwnerForUser(user);

      // Generate new tokens
      const newPayload = this.createSecurePayload(user, ownerId);
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
   * Determine the definitive ownerId for an authorized user
   * @param user
   * @returns
   */
  async getOwnerForUser(user: User): Promise<string> {
    let ownerId: string = null;

    if (user.role?.name === 'owner') {
      ownerId = user.id;
    } else if (user.role?.name === 'manager') {
      // Manager requires a DB lookup to find the associated Owner
      const managerEntry = await this.managerRepository.findOne({
        where: { managerUserId: user.id }
      });

      if (!managerEntry) {
        // Manager is not assigned to an Owner - treat as unauthorized for protected actions
        throw new RpcException('Manager account is not linked to an owner.');
      }
      ownerId = managerEntry.ownerId;
    }
    return ownerId;
  }

  /**
   * Create a secure JWT payload from user data
   * @param user
   * @param ownerId
   * @returns
   */
  createSecurePayload(user: User, ownerId: string = null): any {
    const userPayload = {
      id: user.id,
      ownerId,
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

  /**
   * Add a new tenant profile
   * @param tenant
   * @returns
   */
  async addTenantProfile(tenant: TenantDto) {
    const newTenant = this.tenantRepository.create({
      ...tenant
    });
    await this.tenantRepository.save(newTenant);
    return {
      status: 201,
      message: 'A new tenant profile was added!'
    };
  }

  /**
   * Update an existing tenant profile
   * @param userId
   * @param tenant
   * @returns
   */
  async updateTenantProfile(userId: string, tenant: Tenant) {
    const existingTenant = await this.tenantRepository.findOne({ where: { id: userId } });

    if (!existingTenant) {
      throw new RpcException('Tenant not found');
    }

    Object.assign(existingTenant, tenant);
    const updated = await this.tenantRepository.save(existingTenant);

    if (!updated) {
      throw new RpcException('Failed to update tenant information');
    }

    return {
      status: 201,
      message: 'Tenant profile has been updated!'
    };
  }

  /**
   * Add a new manager profile
   * @param manager
   * @returns
   */
  async addManagerProfile(manager: Manager) {
    const newManager = this.managerRepository.create({
      ...manager
    });
    await this.managerRepository.save(newManager);
    return {
      status: 201,
      message: 'A new manager profile was added!'
    };
  }

  /**
   * Update an existing manager profile
   * @param userId
   * @param manager
   * @returns
   */
  async updateManagerProfile(userId: string, manager: Manager) {
    const existingManager = await this.managerRepository.findOne({ where: { id: userId } });

    if (!existingManager) {
      throw new RpcException('Manager not found');
    }

    Object.assign(existingManager, manager);
    const updated = await this.managerRepository.save(existingManager);

    if (!updated) {
      throw new RpcException('Failed to update manager information');
    }

    return {
      status: 201,
      message: 'Manager profile has been updated!'
    };
  }

  /**
   * Add a new owner profile
   * @param owner
   * @returns
   */
  async addOwnerProfile(owner: Owner) {
    if (owner.isMainOwner) {
      const token = uuidv4();
      owner.ownerIdToken = token;
    }

    const newOwner = this.ownerRepository.create({
      ...owner
    });
    await this.ownerRepository.save(newOwner);
    return {
      status: 201,
      message: 'A new owner profile was added!'
    };
  }

  /**
   * Add a co-owner profile using an owner invitation token
   * @param ownerIdToken
   * @param owner
   * @returns
   */
  async addCoOwnerProfile(ownerIdToken: string, owner: Owner) {
    const mainOwner = await this.ownerRepository.findOne({ where: { ownerIdToken } });
    if (!mainOwner) {
      return {
        status: 422,
        message: 'Eland authorization failed. Please contact the owner.'
      };
    }

    owner.isMainOwner = false;
    const newOwner = this.ownerRepository.create({
      ...owner
    });
    await this.ownerRepository.save(newOwner);
    return {
      status: 201,
      message: 'A new owner profile was added!'
    };
  }

  /**
   * Update an existing owner profile
   * @param ownerUserId
   * @param owner
   * @returns
   */
  async updateOwnerProfile(ownerUserId: string, owner: Owner) {
    const existingOwner = await this.ownerRepository.findOne({ where: { ownerUserId } });
    if (!existingOwner) {
      throw new RpcException('Owner not found!');
    }

    Object.assign(existingOwner, owner);
    const updated = await this.ownerRepository.save(existingOwner);

    if (!updated) {
      throw new RpcException('Failed to update owner information');
    }

    return {
      status: 201,
      message: 'Owner profile has been updated!'
    };
  }

  /**
   * Generate a new owner invitation token
   * @param mainOwnerId
   * @returns
   */
  async generateOwnerToken(
    mainOwnerId: string
  ): Promise<{
    status: number;
    message: string;
    data: Owner;
  }> {
    // Find the owner
    const owner = await this.ownerRepository.findOne({ where: { mainOwnerId } });
    if (!owner) {
      throw new RpcException('Cannot find owner to update');
    }

    // Generate a new token
    const newToken = uuidv4();

    // Update the owner document with the new token
    owner.ownerIdToken = newToken;
    const updated = await this.ownerRepository.save(owner);

    if (!updated) {
      throw new RpcException('Failed to update owner with new token');
    }

    return {
      status: 200,
      message: 'A new token has been generated!',
      data: updated
    };
  }

  /**
   * List all associates (co-owners) for a main owner
   * @param mainOwnerId
   * @returns
   */
  async listAssociates(mainOwnerId: string) {
    const owners = await this.ownerRepository.find({ where: { mainOwnerId } });
    if (!owners || owners.length === 0) {
      return {
        status: 422,
        message: 'No eland owners or co-owners found!'
      };
    }
    return {
      status: 200,
      message: `Found ${owners.length} Associates including yourself`,
      data: owners
    };
  }
}
