// ability.factory.ts
import { 
  AbilityBuilder, 
  ExtractSubjectType, 
  InferSubjects, 
  MongoAbility, 
  createMongoAbility 
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Property } from './entities/property.entity';
import { Lodge } from './entities/lodge.entity';
import { Parking } from './entities/parking.entity';
import { Tenant } from './apps/eland-auth/entities/tenant.entity';
import { Bedroom } from './entities/bedroom.entity';
import { Possession } from './entities/possession.entity';
import { Room } from './entities/room.entity';
import { Amenity } from './entities/amenity.entity';

export enum Action {
  Manage = 'manage', // special CASL keyword for "any action"
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppSubjects = 
  | typeof Property 
  | typeof Lodge 
  | typeof Parking 
  | typeof Bedroom 
  | typeof Room 
  | typeof Possession 
  | typeof Amenity 
  | typeof Tenant;

// Map your classes here for type safety
export type Subjects = InferSubjects<AppSubjects> | 'all';

// Using MongoAbility instead of PureAbility to support { ownerId } conditions
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: any) {
    // createMongoAbility provides the required conditionsMatcher
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user.role?.name === 'admin') {
      can(Action.Manage, 'all');
    } else {
      // 2. Resource Access restricted by ownerId for all other roles
      const rolePermissions = user.role?.permissions || [];
      
      // We define 'all' with a condition: you can only act if the resource ownerId matches your own
      const ownerConstraint = { ownerId: user.ownerId };

      if (rolePermissions.includes('read')) {
        can(Action.Read, 'all', ownerConstraint);
      }
      
      if (rolePermissions.includes('update')) {
        can(Action.Update, 'all', ownerConstraint);
      }

      if (rolePermissions.includes('delete')) {
        can(Action.Delete, 'all', ownerConstraint);
      }

      // 3. Role-specific logic
      if (user.role?.name === 'owner' || user.role?.name === 'manager') {
        // Owners/Managers can create new resources for their specific ownerId
        can(Action.Create, 'all'); 
      }
    }

    // Process User-specific blocks (Blacklisting)
    // These are processed LAST so they override earlier 'can' rules
    if (user.blockedPermissions && Array.isArray(user.blockedPermissions)) {
      user.blockedPermissions.forEach((p: any) => {
        if (typeof p === 'string') {
          // If database gives a string like "create", block it globally
          cannot(p as Action, 'all');
        } else if (p.action && p.subject) {
          // If database gives an object, block the specific action/subject pair
          cannot(p.action, p.subject);
        }
      });
    }

    return build({
      // Using 'item: any' prevents the 'constructor does not exist on never' error
      detectSubjectType: (item: any) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}