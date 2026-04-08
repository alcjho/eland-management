import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CaslAbilityFactory, Action, Subjects } from '../ability.factory';
import { AuthGuard } from '@nestjs/passport';
import { extractSubject } from '../utilities';

@Injectable()
export class CaslGuard extends AuthGuard("jwt") {
  constructor(private caslAbilityFactory: CaslAbilityFactory) {
      super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, let the parent AuthGuard validate the JWT token
    const canActivate = await super.canActivate(context);
    if (!canActivate) { 
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User context missing. Ensure JWT authentication runs first.');
    }

    const ability = this.caslAbilityFactory.createForUser(user)

    // 1. Determine the Action from the HTTP method
    const action = request.method as Action; // Cast to your Action enum
    let subject: Subjects = extractSubject(request.url); // Implement this helper function
    subject = (subject.charAt(0).toUpperCase() + subject.substring(1)) as Subjects;
    
    if (!subject) {
      throw new ForbiddenException(`Access denied: Could not determine resource type for "${request.url}".`);
    }

    // 3. Perform the CASL check
    if (ability.can(action, subject)) {
      return true;
    }

    throw new ForbiddenException(`Forbidden: You don't have permission to ${action} on ${subject}.`);
  }
}