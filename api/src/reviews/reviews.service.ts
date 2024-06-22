import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  create(createReviewDto: CreateReviewDto) {
    const newReview = this.reviewRepository.create(createReviewDto);
    newReview.user = <any>{ id: createReviewDto['userId'] };
    newReview.book = <any>{ id: createReviewDto['bookId'] };

    return this.reviewRepository.save(newReview);
  }

  findAll() {
    return this.reviewRepository.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.reviewRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.reviewRepository.delete(id);
  }

  count() {
    return this.reviewRepository.count();
  }
}
