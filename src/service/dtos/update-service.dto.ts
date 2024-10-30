import { IsOptional, IsString } from "class-validator"

export class UpdateServiceDto {
    @IsString()
    @IsOptional()
    content?: string

    @IsString()
    @IsOptional()
    khmerContent?: string

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