import { Injectable } from '@nestjs/common';
import { CreatePaginationDto } from './dto/create-pagination.dto';
import { UpdatePaginationDto } from './dto/update-pagination.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaginationService {
constructor(private readonly prisma: PrismaService) {}


  async getPagination(dto: CreatePaginationDto, defaultPerPage = 30) {
    const page = dto.page ? +dto.page : 1   
    const perPage = dto.perPage ? +dto.perPage : defaultPerPage   

    const skip = (page - 1) * perPage   

    return { perPage, skip }
  }
}
