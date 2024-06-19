/* eslint-disable @typescript-eslint/no-namespace */
import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/Public.decorator';
import { JwtUserDto } from './dto/jwt-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest() as Request;

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      if (isPublic) return true;

      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtUserDto>(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = await this.userService.findOne(payload.sub);
    } catch (e) {
      if (isPublic) return true;

      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
