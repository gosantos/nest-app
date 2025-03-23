import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

export enum Role {
  User = 'user',
  Admin = 'admin',
  None = 'none',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

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
    const token = this.extractTokenFromHeader(ctx);

    if (!token) {
      return false;
    }

    const userRole = ctx.getContext().req.headers.user;
    console.log('User:', userRole);

    return requiredRoles.some((requiredRole) => userRole == requiredRole);
  }

  private extractTokenFromHeader(ctx: GqlExecutionContext) {
    const token = ctx
      .getContext()
      .req.headers.authorization?.replace('Bearer ', '');

    return token;
  }
}
