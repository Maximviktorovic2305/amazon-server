import { IsEmail, IsString, MinLength } from "class-validator"

export class CreateAuthDto {
    @MinLength(3, { message: 'Пароль должен быть не менее 3 символов'})
    password: string   

    @IsEmail()
    email: string
}  

export class RefreshTokenDto {
    @IsString()
    refreshToken: string   

}
