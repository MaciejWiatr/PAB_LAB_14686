import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { Public } from './decorators/Public.decorator';
import { Role } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // FOR SAKE OF DEMO ALL NEW USERS ARE CREATED AS ADMINS
    return this.usersService.create({ ...registerDto, role: Role.ADMIN });
  }
}
