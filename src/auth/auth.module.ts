import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],   
    inject: [ConfigService],   
    useFactory: getJwtConfig
  }), ConfigModule, UserModule],   
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, UserService],
})
export class AuthModule {}
