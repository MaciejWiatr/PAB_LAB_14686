import { Role } from 'src/auth/auth.constants';
import { Book } from 'src/books/entities/book.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string;

  @Column()
  password: string;

  @Column({ default: Role.USER })
  role: string;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

  @OneToMany(() => Review, (r) => r.user)
  reviews: Review[];
}
