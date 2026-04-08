// abilities.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory, Action, Subjects } from '../ability.factory';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>('abilities', context.getHandler()) || [];
    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new ForbiddenException('User not authenticated');

    const ability = this.abilityFactory.defineAbility(user);

    try {
      rules.forEach((rule) => {
        // This checks if the user has the general permission
        const isAllowed = ability.can(rule.action, rule.subject);
        if (!isAllowed) {
            throw new ForbiddenException(`You do not have permission to ${rule.action} ${rule.subject}`);
        }
      });
      return true;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}