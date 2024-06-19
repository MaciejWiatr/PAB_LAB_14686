import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User as UserEntity } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user as UserEntity | null;

    return user;
  },
);
