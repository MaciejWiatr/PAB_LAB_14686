import { Role } from 'src/auth/auth.constants';

export class CreateUserDto {
  username: string;
  password: string;
  role: Role;
}
