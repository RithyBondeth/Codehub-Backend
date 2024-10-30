import { IsString, IsOptional } from "class-validator"

export class UpdateVisionDto {
    @IsString()
    @IsOptional()
    title?: string
    
    @IsString()
    @IsOptional()
    khmerTitle?: string

    @IsString()
    @IsOptional()
    description?: string
    
    @IsString()
    @IsOptional()
    khmerDescription?: string 
}