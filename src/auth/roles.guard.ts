import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    console.log('Entering RolesGuard');

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('Required Roles:', requiredRoles);

    if (!requiredRoles) {
      return false;
    }

    if (requiredRoles.some((role) => role == Role.None)) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const userRole = ctx.getContext().req.headers.user;
    console.log('User:', userRole);

    return requiredRoles.some((requiredRole) => userRole == requiredRole);
  }
}
