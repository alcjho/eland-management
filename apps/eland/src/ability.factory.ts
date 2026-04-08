// src/auth/ability.factory.ts
import { AbilityBuilder, PureAbility, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from './types/roles.enum'; // Assuming you have an enum for roles
import { extractCommand } from './utilities';

export enum Action {
  Manage = 'manage', // Equivalent to * in traditional RBAC, for any action
  Create = 'POST',
  Read = 'GET',
  Update = 'PUT',
  Delete = 'DELETE',
  Patch = 'PATCH'
}

// Use string literals for subjects no classes for them in the gateway
export type Subjects = 'Users' | 'Properties' | 'Billing' | 'Auth' | 'Location' | 'Tenant' | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  userHasPermissions(user: any, permissions: string[]): boolean {
    let totalUserPermissions = user.role.permissions;
    if(user.permissions?.length > user.role.permissions.length){
       totalUserPermissions = user.permissions.concat(user.role.permissions);
    }

    if(permissions.length != user.role.permissions.length){
      return false;
    }
    return permissions.every(permission => totalUserPermissions.includes(permission));
  }

  createForUser(user: any): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility as AbilityClass<AppAbility>);
    if (!user || !user.role || !user.role.name) {
      // Default ability for users without complete role info
      can(Action.Read, 'all');
      return build();
    }
    // Everyone should be able to update their own users
    can(Action.Update, 'Users');


    // This is where you map roles/permissions from your JWT to CASL rules
    switch (user.role?.name) {
      case Role.ADMIN:
        if(this.userHasPermissions(user, ['read', 'write', 'delete'])) {
          can(Action.Manage, 'all')
        }

        break;
      case Role.OWNER:
        can(Action.Manage, 'all');
        break;
      case Role.TENANT:
        can(Action.Read, 'Properties');
        
        can(Action.Update, 'Users'); // Tenants can update their own user profile (will need more logic)
        
        if (user.role.permissions.includes('write')) {
          can(Action.Create, 'Billing'); // Example: write permission allows creating billing entities
        }
        break;
    }

    return build();
  }
}