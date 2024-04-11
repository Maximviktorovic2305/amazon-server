import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateAuthDto, RefreshTokenDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')  
  @HttpCode(201) 
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto)
  }   

  @Post('login')  
  @HttpCode(200) 
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto)
  }

  @Post('login/access-token')  
  @HttpCode(200) 
  getNewTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.getNewTokens(refreshTokenDto.refreshToken)
  }
}
