import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { convertRoleNameToNumber } from '../constants/roles.constants';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    if (!userId) {
      return false;
    }
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      return requiredRoles.some(
        (role) => convertRoleNameToNumber(role) === user.role,
      );
    } catch (error) {
      console.error('Error in RolesGuard:', error);
      return false;
    }
  }
}
