import { Reflector } from '@nestjs/core';
import { Role } from '../auth.constants';

export const Roles = Reflector.createDecorator<Role[]>();
