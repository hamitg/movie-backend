import { SetMetadata } from '@nestjs/common';
import { ROLE_NAMES } from '../constants/roles.constants';

export const Roles = (...roles: (keyof typeof ROLE_NAMES)[]) =>
  SetMetadata(
    'roles',
    roles.map((role) => ROLE_NAMES[role]),
  );
