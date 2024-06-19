import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { cryptoConstants } from './crypto.consts';

@Injectable()
export class CryptoService {
  async hashPassword(password: string) {
    return bcrypt.hash(password, cryptoConstants.salt);
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
