import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  private async issueTokens(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  private returnUserFields(user: Partial<User>) {
    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }

  private async validateUser(createAuthDto: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: createAuthDto.email },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    const isValid = await argon2.verify(user.password, createAuthDto.password);

    if (!isValid) throw new NotFoundException('Не верный пароль');

    return user;
  }

  async register(createAuthDto: CreateAuthDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { email: createAuthDto.email },
    });

    if (existUser) {
      throw new BadRequestException('Пользователь уже существует');
    }

    const hashedPassword = await argon2.hash(createAuthDto.password);

    const user = await this.prisma.user.create({
      data: {
        email: createAuthDto.email,
        password: hashedPassword,
        name: faker.person.firstName(),
        avatarPath: faker.image.avatar(),
        phone: faker.string.numeric(9),
      },
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),

      ...tokens,
    };
  }

  async login(createAuthDto: CreateAuthDto) {
    const user = await this.validateUser(createAuthDto);

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!refreshToken) throw new UnauthorizedException('Ошибка токена');

    const user = await this.userService.byId(result.id, {
      isAdmin: true,
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }
}
