import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ROLES } from '../constants/roles.constants';

@Injectable()
export class UserAccessGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = parseInt(request.params.userId);

    if (user.userId !== userId && user.role !== ROLES.MANAGER) {
      throw new ForbiddenException('You cannot access other users data');
    }

    return true;
  }
}
