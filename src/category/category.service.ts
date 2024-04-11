import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { returnCategoryObject } from './return-category.object';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async byId(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) throw new NotFoundException('Категория не существует');

    return category;
  }   

  async byName(name: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        name,
      },
    });
    if (!category) throw new NotFoundException('Категория не существует');

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
      },
    });
  }

  async delete(id: number) {
    await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
      },
    });

    return category;
  }

  async getAll() {
    const categories = await this.prisma.category.findMany({
      select: returnCategoryObject,
    });
    return categories;
  }
}
