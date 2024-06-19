import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { Roles } from './decorators/roles.decorator';
import { Role } from './auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) return true;

    const req = context.switchToHttp().getRequest() as Request;
    const userId = req['user'].sub as string;

    const user = await this.userService.findOne(Number(userId));

    console.log(user);

    if (!roles.includes(user.role as Role)) {
      throw new ForbiddenException('Your role is forbidded on this action');
    }

    return true;
  }
}
