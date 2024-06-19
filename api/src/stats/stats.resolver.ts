import { Resolver } from '@nestjs/graphql';
import { CurrentStats } from './models/current-stats.model';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { Query } from '@nestjs/graphql';

@Resolver((of) => CurrentStats)
export class StatsResolver {
  constructor(
    private usersService: UsersService,
    private booksService: BooksService,
    private reviewService: ReviewsService,
  ) {}

  @Query((returns) => CurrentStats)
  async currentStats() {
    return {
      usersCount: this.usersService.count(),
      booksCount: this.booksService.count(),
      reviewCount: this.reviewService.count(),
    };
  }
}
