import { createParamDecorator } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data, ctx) => +ctx.switchToHttp().getNext().headers.user,
);
