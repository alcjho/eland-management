import { SetMetadata } from '@nestjs/common';
import { RequiredRule } from '../guards/abilities.guard';

export const CHECK_ABILITY = 'abilities';
export const CheckAbilities = (...requirements: RequiredRule[]) => 
  SetMetadata(CHECK_ABILITY, requirements);