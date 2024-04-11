import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()   
  @Auth('admin')
  getAll() {
    return this.reviewService.getAll();
  }

  @Post('leave/:productId')
  @Auth()
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.reviewService.create(userId, dto, +productId);
  }

  @Post('average-by-product/:productId')
  @Auth()
  getAverageValueByProductId(@Param('productId') productId: string) {
    return this.reviewService.getAverageValueByProductId(+productId);
  }
}
