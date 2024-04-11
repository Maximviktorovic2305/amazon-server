import { IsOptional } from "class-validator";

export class CreatePaginationDto {
    @IsOptional()   
    page?: string   

    @IsOptional()   
    perPage?: string  
}   



