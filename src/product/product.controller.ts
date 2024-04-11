import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetAllProductsDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}   

  @Get()   
  getAll(@Query() queryDto: GetAllProductsDto) {
    return this.productService.getAll(queryDto)
  }   

  @Get('similar/:id')   
  getSimilar(@Param('id') productId: string) {
    return this.productService.getSimilar(+productId)
  }   

  @Get('by-slug/:slug')   
  bySlug(@Param('slug') slug: string) {
    return this.productService.bySlug(slug)
  }   

  @Get('by-category/:categorySlug')   
  byCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.byCategory(categorySlug)
  }   

  @Post()   
  @Auth('admin')
  create() {
    return this.productService.create()
  } 

  @Put(':id')   
  @Auth('admin')
  update(@Body() dto: UpdateProductDto, @Param('id') productId: string) {
    return this.productService.update(+productId, dto)
  }   

  @Delete(':id')   
  @Auth('admin')
  deleteProduct(@Param('id') productId: string) {
    return this.productService.deleteProduct(+productId)
  }   

  @Get(':id')   
  @Auth('admin')
  byId(@Param('id') productId: string) {
    return this.productService.byId(+productId)
  }  

  @Get('by-name/:name')   
  @Auth()
  byName(@Param('name') name: string) {
    return this.productService.byName(name)
  }
}
