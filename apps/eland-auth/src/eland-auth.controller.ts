import { Body, Controller, Inject } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { delay, from, map, Observable, of } from 'rxjs';
import { LoginDto } from './dto/Login.dto';
import { ElandAuthService } from './eland-auth.service';
import { RegisterDto } from './dto/Register.dto';

@Controller()
export class ElandAuthController {
  constructor(private readonly elandAuthService: ElandAuthService){}

  @MessagePattern({ cmd: 'login' })
  login(@Payload() data: any): Observable<any> {
    return from(this.elandAuthService.login(data.body));
  }

  // Separate login method to handle validation
  loginUser(@Body(new ValidationPipe()) data: LoginDto): Observable<any> {
    return from(this.elandAuthService.login(data));
  }

  @MessagePattern({ cmd: 'register' })
    register(@Payload() payload: any): Observable<any> {
    return this.registerUser(payload.body);
  }

  // Separate register method to handle validation
  registerUser(@Body(new ValidationPipe()) data: RegisterDto): Observable<any> {
    return from(this.elandAuthService.register(data));
  }


  @MessagePattern({ cmd: 'activate-account' })
  activateAccount(@Payload() data: any): Observable<any> {
    const { query } = data.body;
    
    // Extract token correctly from the nested structure
    const token = query?.token;
    return from(this.elandAuthService.activateAccount(token));
  }

  @MessagePattern({ cmd: 'resend-activation' })
  resendActivation(@Payload() data: { email: string }): Observable<any> {
    return from(this.elandAuthService.resendActivationEmail(data.email));
  }

  @MessagePattern({ cmd: 'delete-account' })
  deleteAccount(@Payload() data: any): Observable<any> {
   const { body, url, method } = data;
    return from(this.elandAuthService.removeUser(body.email));
  }
}