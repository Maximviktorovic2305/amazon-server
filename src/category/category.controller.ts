import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAll() {
    return this.categoryService.getAll();
  }

  @Get(':id')
  @Auth()
  byId(@Param('id') categoryId: string) {
    return this.categoryService.byId(+categoryId);
  }   

  @Get('name/:name')
  byName(@Param('name') name: string) {
    return this.categoryService.byName(name);
  }

  @Post()
  @Auth('admin')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Put(':id')
  @Auth('admin')
  update(@Param('id') categoryId: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(+categoryId, dto);
  }

  @Delete(':id')
  @Auth('admin')
  delete(@Param('id') categoryId: string) {
    return this.categoryService.delete(+categoryId);
  }
}
