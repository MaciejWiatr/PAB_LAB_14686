import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cryptoService: CryptoService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      username: createUserDto.username,
      password: await this.cryptoService.hashPassword(createUserDto.password),
      role: createUserDto.role,
    });

    return this.userRepository.save(newUser);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async findByUserName(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const password = updateUserDto['password'];

    const updatePassword = password
      ? {
          password: await this.cryptoService.hashPassword(password),
        }
      : {};

    const user = this.userRepository.save({
      id,
      username: updateUserDto.username,
      role: updateUserDto.role,
      ...updatePassword,
    });

    return user;
  }

  async remove(id: number) {
    const deleted = await this.userRepository.delete(id);

    return deleted.affected > 0;
  }

  async count() {
    return this.userRepository.count();
  }
}
