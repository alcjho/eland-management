import { Body, Controller, Post, Get, Put, Param, Query, UseGuards, Request, BadRequestException, HttpCode } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { LoginDto } from './dto/Login.dto';
import { ElandAuthService } from './eland-auth.service';
import { RegisterDto } from './dto/Register.dto';

@Controller('auth')
export class ElandAuthController {
  constructor(private readonly elandAuthService: ElandAuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) data: RegisterDto) {
    return this.elandAuthService.register(data);
  }

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

  @Post('register-co-owner/:token')
  async registerAsCoOwner(
    @Param('token') token: string,
    @Body(new ValidationPipe()) data: RegisterDto
  ) {
    return this.elandAuthService.registerAsCoOwner(token, data);
  }

  @Get('activate')
  async activateAccount(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Activation token is required');
    }
    return this.elandAuthService.activateAccount(token);
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

  // Tenant endpoints
  @Post('tenant')
  async addTenant(@Body() data: any) {
    return this.elandAuthService.addTenantProfile(data);
  }

  @Put('tenant/:userId')
  async updateTenant(@Param('userId') userId: string, @Body() data: any) {
    return this.elandAuthService.updateTenantProfile(userId, data);
  }

  // Manager endpoints
  @Post('manager')
  async addManager(@Body() data: any) {
    return this.elandAuthService.addManagerProfile(data);
  }

  @Put('manager/:userId')
  async updateManager(@Param('userId') userId: string, @Body() data: any) {
    return this.elandAuthService.updateManagerProfile(userId, data);
  }

  // Owner endpoints
  @Post('owner')
  async addOwner(@Body() data: any) {
    return this.elandAuthService.addOwnerProfile(data);
  }

  @Post('owner-token/:mainOwnerId')
  async generateOwnerToken(@Param('mainOwnerId') mainOwnerId: string) {
    return this.elandAuthService.generateOwnerToken(mainOwnerId);
  }

  @Put('owner/:ownerUserId')
  async updateOwner(@Param('ownerUserId') ownerUserId: string, @Body() data: any) {
    return this.elandAuthService.updateOwnerProfile(ownerUserId, data);
  }

  @Post('owner/co-owner/:token')
  async addCoOwner(@Param('token') token: string, @Body() data: any) {
    return this.elandAuthService.addCoOwnerProfile(token, data);
  }

  @Post('invite-co-owner/:token')
  async inviteCoOwner(@Param('token') token: string, @Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    return this.elandAuthService.inviteCoOwner(token, body.email);
  }

  @Get('associates/:mainOwnerId')
  async listAssociates(@Param('mainOwnerId') mainOwnerId: string) {
    return this.elandAuthService.listAssociates(mainOwnerId);
  }
}