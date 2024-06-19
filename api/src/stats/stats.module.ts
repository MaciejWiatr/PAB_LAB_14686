import { Module } from '@nestjs/common';
import { StatsResolver } from './stats.resolver';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  imports: [UsersModule, BooksModule, ReviewsModule],
  providers: [StatsResolver],
})
export class StatsModule {}
