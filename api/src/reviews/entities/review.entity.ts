import { Max, Min } from 'class-validator';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Min(1)
  @Max(5)
  rating: number;

  @ManyToOne(() => User, (u) => u.reviews)
  user: User;

  @ManyToOne(() => Book, (b) => b.reviews)
  book: Book;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
