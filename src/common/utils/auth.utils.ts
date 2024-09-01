import { RoleType, ROLE_NAMES } from '../constants/roles.constants';

export function extractTokenFromHeader(request: any): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

export function getRoleName(roleId: RoleType): string {
  return ROLE_NAMES[roleId] || 'Unknown';
}

export function getRoleId(roleName: string): RoleType | undefined {
  const entry = Object.entries(ROLE_NAMES).find(
    ([_, name]) => name.toLowerCase() === roleName.toLowerCase(),
  );
  return entry ? (parseInt(entry[0]) as RoleType) : undefined;
}
