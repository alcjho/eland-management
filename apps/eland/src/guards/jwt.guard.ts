import { ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessControl } from 'apps/eland/config/access.rbac';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  handleRequest(err, user, info, context: ExecutionContext) {
    
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    // Get the request object
    const request = context.switchToHttp().getRequest();

    
    // Attach X-User-Id to headers
    request.headers['user'] = user;

    return user;
  }
}