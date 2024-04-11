import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';
import { PaginationModule } from 'src/pagination/pagination.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [ProductModule, PaginationModule, CategoryModule],   
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, ProductService],
})
export class ReviewModule {}
