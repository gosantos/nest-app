import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { isConstValueNode } from 'graphql';

export enum MerchantRole {
  Merchant = 'merchant',
  Owner = 'owner',
}

export const MERCHANT_ROLES_KEY = 'merchantRoles';
export const MerchantRoles = (...roles: MerchantRole[]) =>
  SetMetadata(MERCHANT_ROLES_KEY, roles);

@Injectable()
export class MerchantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    console.log('Entering MerchantGuard');

    const requiredMerchant = this.reflector.getAllAndOverride<MerchantRole[]>(
      MERCHANT_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log('Required Merchant:', requiredMerchant);

    if (!requiredMerchant) {
      return false;
    }

    const ctx = GqlExecutionContext.create(context);
    const token = this.extractTokenFromHeader(ctx) || '1,merchant';

    console.log('Token extracted from context', token);

    if (!token) {
      return false;
    }

    const [user, role] = token.split(',');

    const request = context.switchToHttp().getNext();

    request.headers = {
      ...request.headers,
      user,
      role,
    };

    console.log({ next: context.switchToHttp().getNext().headers.user });

    return requiredMerchant.some((requiredRole) => role == requiredRole);
  }

  private extractTokenFromHeader(ctx: GqlExecutionContext) {
    const token = ctx
      .getContext()
      .req.headers.authorization?.replace('Bearer ', '');

    return token;
  }
}
