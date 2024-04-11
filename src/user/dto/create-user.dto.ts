import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  password: string;

  @IsString()
  name: string;

  @IsString()
  avatarPath: string;

  phone: string;
}
