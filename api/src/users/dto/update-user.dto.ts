import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Role } from 'src/auth/auth.constants';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  role?: Role;
  username?: string;
  password?: string;
}
