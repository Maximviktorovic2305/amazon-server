import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { EnumProductSort, GetAllProductsDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  returnProductObject,
  returnProductObjectFullest,
} from './return-product.object';
import { convertToNumber } from 'src/utils/convert-to-number';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
    private categoryService: CategoryService,
  ) {}

  async byId(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: returnProductObjectFullest,
    });

    if (!product) throw new NotFoundException('Продукт не найден');

    return product;
  }

  async bySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: returnProductObjectFullest,
    });

    if (!product) throw new NotFoundException('Продукт не найден');

    return product;
  }

  async byCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: categorySlug,
        },
      },
      select: returnProductObjectFullest,
    });
    if (!products) throw new NotFoundException('Продукты не найдены');

    return products;
  }

  async getSimilar(productId: number) {
    const currentProduct = await this.byId(productId);

    if (!currentProduct)
      throw new NotFoundException('Текущий продукт не найден');

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: returnProductObject,
    });

    return products;
  }

  async create() {
    const product = await this.prisma.product.create({
      data: {
        description: '',
        name: '',
        price: 0,
        slug: faker.lorem.word(),
      },
    });
    return product.id;
  }

  async update(id: number, dto: UpdateProductDto) {
    const { description, price, images, name, categoryId } = dto;   

    await this.categoryService.byId(categoryId)

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        description,
        images,
        price,
        name,
        slug: faker.lorem.word(),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async getAll(dto: GetAllProductsDto = {}) {
    const { perPage, skip } = await this.paginationService.getPagination(dto)

    const filters = this.createFilter(dto)

    const products = await this.prisma.product.findMany({
      where: filters,
      orderBy: this.getSortOption(dto.sort),
      skip,
      take: perPage,
      select: returnProductObject,
    });

    return {
      products,
      length: await this.prisma.product.count({
        where: filters,
      }),
    };
  }

  async deleteProduct(productId: number) {
    await this.prisma.product.delete({ where: { id: productId } });
  }

  async byName(name: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        name,
      },
      select: returnProductObjectFullest,
    });

    if (!product) throw new NotFoundException('Продукт не найден');

    return product;
  }

  private getCategoryFilter(categoryId: number): Prisma.ProductWhereInput {
    return {
      categoryId,
    };
  }

  private getPriceFilter(
    minPrice?: number,
    maxPrice?: number,
  ): Prisma.ProductWhereInput {
    let priceFilter: Prisma.IntFilter | undefined = undefined;

    if (minPrice) {
      priceFilter = {
        ...priceFilter,
        gte: minPrice,
      };
    }

    if (maxPrice) {
      priceFilter = {
        ...priceFilter,
        lte: maxPrice,
      };
    }

    return {
      price: priceFilter,
    };
  }

  private getRatingFilter(ratings: number[]): Prisma.ProductWhereInput {
    return {
      reviews: {
        some: {
          rating: {
            in: ratings,
          },
        },
      },
    };
  }

  private getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput {
    return {
      OR: [
        {
          category: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  private getSortOption(sort: EnumProductSort): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case EnumProductSort.LOW_PRICE:   
        return [{  price: 'asc'}]
      case EnumProductSort.HIGH_PRICE:   
        return [{  price: 'desc'}]   
      case EnumProductSort.OLDEST:   
        return [{  createdAt: 'asc'}]
      default:    
        return [{  createdAt: 'desc'}]
    }
  }   

  private createFilter (dto: GetAllProductsDto): Prisma.ProductWhereInput {   
    const filters: Prisma.ProductScalarWhereInput[] = []   

    if (dto.searchTerm) {
      filters.push(this.getSearchTermFilter(dto.searchTerm))
    }   

    if (dto.ratings) {
      filters.push(this.getRatingFilter(dto.ratings.split('|').map(rating => +rating)))
    }   

    if (dto.minPrice || dto.maxPrice) {
      filters.push(this.getPriceFilter(convertToNumber(dto.minPrice), convertToNumber(dto.maxPrice)))
    }   

    if (dto.categoryId) {
      filters.push(this.getCategoryFilter(+dto.categoryId))
    }   

    return filters.length ? {AND: filters} : {}   

  }






  }










