import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from 'src/crypto/crypto.service';
import { JwtUserDto } from './dto/jwt-user.dto';
import { AccessTokenDto } from './dto/access-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}

  async signIn(username: string, pass: string): Promise<AccessTokenDto> {
    const user = await this.usersService.findByUserName(username);

    if (!user) {
      throw new NotFoundException();
    }

    if (!this.cryptoService.comparePassword(pass, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
    } satisfies JwtUserDto;

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
