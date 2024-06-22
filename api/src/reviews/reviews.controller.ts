import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/auth.constants';

@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles([Role.ADMIN])
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }

  @Get('/')
  @Roles([Role.ADMIN])
  findAll() {
    return this.reviewsService.findAll();
  }
}
