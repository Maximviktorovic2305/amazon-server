import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductService } from 'src/product/product.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { returnReviewObject } from './return-review.object';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private productService: ProductService,
  ) {}

  async create(userId: number, dto: CreateReviewDto, productId: number) {
    await this.productService.byId(productId);

    const review = await this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return review;
  }

  async getAll() {
    const reviews = await this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      select: returnReviewObject,
    });
    return reviews;
  }

  async getAverageValueByProductId(productId: number) {
    return this.prisma.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then((data) => data._avg);
  }
}
