import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // User object has a 'roles' property (e.g., [{id: 1, name: 'Admin'}, {id: 2, name: 'Viewer'}])
    return this.userService.hasRoles(user, requiredRoles);
  }
}
