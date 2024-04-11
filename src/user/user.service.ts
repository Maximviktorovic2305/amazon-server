import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { returnUserObject } from './return-user.object';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async byId(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...returnUserObject,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,   
            category: {
              select: {
                name: true
              }
            },   
            reviews: true
          },
        },
        ...selectObject,
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  async updateProfile(dto: UpdateUserDto, userId: number) {
    // const isSameUser = await this.prisma.user.findUnique({
    //   where: {
    //     email: dto.email
    //   }
    //  })

    // if (isSameUser && userId !== isSameUser.id) throw new BadRequestException('Данная почта уже занята')

    const user = await this.byId(userId);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: dto.email,
        name: dto.name,
        avatarPath: dto.avatarPath,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : user.password,
      },
    });

    return updatedUser;
  }

  async toggleFavorite(productId: number, userId: number) {
    const user = await this.byId(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');

    const isExists = user.favorites.some((product) => product.id === productId);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        favorites: {
          [isExists ? 'disconnect' : 'connect']: {
            id: productId,
          },
        },
      },
    });
    return 'success';
  }
}
