import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

export enum BackofficeRole {
  User = 'user',
  Admin = 'admin',
  None = 'none',
}

const ROLES_KEY = 'roles';
export const BackofficeRoles = (...roles: BackofficeRole[]) =>
  SetMetadata(ROLES_KEY, roles);

@Injectable()
export class BackofficeRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    console.log('Entering BackofficeRolesGuard');

    const requiredBackofficeRoles = this.reflector.getAllAndOverride<
      BackofficeRole[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    console.log('Required BackofficeRoles:', requiredBackofficeRoles);

    if (!requiredBackofficeRoles) {
      return false;
    }

    if (requiredBackofficeRoles.some((role) => role == BackofficeRole.None)) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const userRole = ctx.getContext().req.headers.user;
    console.log('User:', userRole);

    return requiredBackofficeRoles.some(
      (requiredRole) => userRole == requiredRole,
    );
  }
}
