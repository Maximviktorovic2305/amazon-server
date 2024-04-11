import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')   
  @Auth()
  getProfile(@CurrentUser('id') userId: number) {
    return this.userService.byId(userId)
  }   

  @Put('profile')   
  @Auth()
  updateProfile(@Body() dto: UpdateUserDto, @CurrentUser('id') userId: number) {
    return this.userService.updateProfile(dto, userId)
  }   

  @Patch('profile/favorites/:productId')   
  @Auth()
  toggleFavorite(@Param('productId') productId: string, @CurrentUser('id') userId: number) {
    return this.userService.toggleFavorite(+productId, userId)
  } 
}
