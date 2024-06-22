import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    const newBook = this.bookRepository.create(createBookDto);
    newBook.user = <any>{ id: createBookDto.userId };

    return this.bookRepository.save(newBook);
  }

  findAll() {
    return this.bookRepository.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.bookRepository.findOneBy({ id });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const { userId, ...bookUpdates } = updateBookDto;

    // If there's a userId, add it as a nested relation update.
    const updateData = userId
      ? { ...bookUpdates, user: { id: userId } }
      : bookUpdates;

    return await this.bookRepository.update(id, updateData);
  }

  remove(id: number) {
    return this.bookRepository.delete(id);
  }

  count() {
    return this.bookRepository.count();
  }
}
