import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreatePaginationDto } from 'src/pagination/dto/create-pagination.dto';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsString({ each: true })
  images: string[];

  @IsNumber()
  categoryId: number;
}

export enum EnumProductSort {
  HIGH_PRICE = 'high-price',
  LOW_PRICE = 'low-price',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class GetAllProductsDto extends CreatePaginationDto {
  @IsOptional()
  sort?: EnumProductSort;

  @IsOptional()
  searchTerm?: string;   

  @IsOptional()
  ratings?: string  

  @IsOptional()
  minPrice?: string  

  @IsOptional()
  maxPrice?: string   

  @IsOptional()
  categoryId?: string  
}
