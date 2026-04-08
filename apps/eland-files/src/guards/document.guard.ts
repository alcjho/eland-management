import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express'; // Import Request type

@Injectable()
export class GatewayAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const rawUserHeader = request.headers['user'] as string;

    let userData: any;
    try {
      userData = JSON.parse(rawUserHeader);
    } catch (error) {
      throw new UnauthorizedException('This is a restricted action for non-authorized users');
    }
  
    if (!userData || !userData.id || !userData.role?.name) {
      // Failed: User data or essential fields are missing
      throw new UnauthorizedException('Missing or invalid trusted user data from gateway.');
    }
    
    // 🔑 Inject the user info into req.user for controller access
    (request as any).user = { 
        id: userData.id, 
        role: userData.role.name 
    };
    return true; // Authentication via Gateway is successful
  }
}