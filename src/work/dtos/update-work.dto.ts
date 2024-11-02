import { IsOptional, IsString } from "class-validator"

export class UpdateWorkDto {
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

    @IsString()
    @IsOptional()
    author?: string

    @IsString()
    @IsOptional()
    content?: string

    @IsString()
    @IsOptional()
    githubLink?: string
}