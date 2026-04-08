import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ElandMailService {
  private transporter: any;

  constructor(private configService: ConfigService) {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendActivationEmail(email: string, token: string): Promise<void> {
    const activationUrl = `${this.configService.get<string>('FRONTEND_URL')}/v1/auth/activate?token=${token}`;

    try{
      const res = await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: email,
        subject: 'Activate Your Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Our Platform!</h2>
            <p>Thank you for registering. Please click the button below to activate your account:</p>
            <a href="${activationUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Activate Account
            </a>
            <p>If the button doesn't work, please copy and paste the following link into your browser:</p>
            <p>${activationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't register for an account, please ignore this email.</p>
          </div>
        `,
      });
    }catch(error){
      console.error(error);
    }

  }

  async inviteCoOwner(email: string, token: string): Promise<void> {
    const activationUrl = `${this.configService.get<string>('FRONTEND_URL')}/auth/affiliate?token=${token}`;

    try{
      const res = await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: email,
        subject: 'Your owner invited you to register as a co-owner',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Our Platform!</h2>
            <p>Thank you for registering. Please click the button below to register your account:</p>
            <a href="${activationUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Activate Account
            </a>
            <p>If the button doesn't work, please copy and paste the following link into your browser:</p>
            <p>${activationUrl}</p>
            <p>This link may expire soon.</p>
            <p>If you didn't ask your owner for an account, please ignore this email.</p>
          </div>
        `,
      });
    }catch(error){
      console.error(error);
    }

  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/auth/reset-password?token=${token}`;
    
    try{
    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Reset Password
          </a>
          <p>If the button doesn't work, please copy and paste the following link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
        </div>
      `,
    });
    }catch(error){
      console.error(error)
    }
  }
}