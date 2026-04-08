import { Body, Controller, Post, Get, Put, Param, Query, UseGuards, BadRequestException, HttpCode, Req } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { LoginDto } from './dto/Login.dto';
import { ElandAuthService } from './eland-auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { OwnerDto } from './dto/owner.dto';
import { ManagerDto } from './dto/manager.dto';
import { TenantDto } from './dto/tenant.dto';
import { UserDto } from './dto/User.dto';

@Controller('auth')
export class ElandAuthController {
  constructor(private readonly elandAuthService: ElandAuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body(new ValidationPipe()) data: LoginDto) {
    return this.elandAuthService.login(data);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    return this.elandAuthService.refreshToken(body.refreshToken);
  }

  @Get('activate')
  async activateAccount(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Activation token is required');
    }
    return this.elandAuthService.activateAccount(token);
  }

  @Post('assign-location')
  async assignLocation(
    @Query('token') token: string, 
    @Body() body: { locationId: string }) {
    if (!token) {
      throw new BadRequestException('Activation token is required');
    }
    if (!body.locationId) {
      throw new BadRequestException('Location ID is required');
    }
    
    const locationId = body.locationId;
    return this.elandAuthService.setUserLocation(token, locationId);
  }

  @Post('resend-activation')
  async resendActivation(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    return this.elandAuthService.resendActivationEmail(body.email);
  }

  @Put('profile/:userId')
  async updateProfile(@Param('userId') userId: string, @Body() data: any) {
    return this.elandAuthService.updateProfile(userId, data);
  }

  @Post('change-password/:userId')
  async changePassword(
    @Param('userId') userId: string,
    @Body() data: { currentPassword: string; newPassword: string }
  ) {
    return this.elandAuthService.changePassword(userId, data);
  }

  @Post('delete-account')
  async deleteAccount(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    return this.elandAuthService.removeUser(body.email);
  }

  @Post('register/owner')
  async registerOwner(@Body() dto: UserDto & OwnerDto) {
    return this.elandAuthService.registerOwner(dto);
  }

  @Post('register/manager')
  @UseGuards(JwtAuthGuard) // Only Admins/Owners can create Managers
  async registerManager(
    @Body() dto: UserDto & ManagerDto, 
    @Req() req: any
  ) {
    const ownerId = req.user.ownerId; // Extract ownerId from JWT
    if (!ownerId) {
      throw new BadRequestException('Owner ID is required to create a manager');
    }

    return this.elandAuthService.registerManager(dto, ownerId);
  }

  @Post('register/tenant')
  async registerTenant(@Body() dto: UserDto & TenantDto) {
    return this.elandAuthService.registerTenant(dto);
  }
}