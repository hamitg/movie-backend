export const ROLES = {
  MANAGER: 0,
  CUSTOMER: 1,
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_NAMES: { [key in RoleType]: string } = {
  0: 'Manager',
  1: 'Customer',
};

export function convertRoleNameToNumber(roleName: string): number {
  switch (roleName.toLowerCase()) {
    case 'manager':
      return ROLES.MANAGER;
    case 'customer':
      return ROLES.CUSTOMER;
    default:
      throw new Error('Invalid role name');
  }
}
