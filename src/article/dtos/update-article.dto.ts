import { IsOptional, IsString } from "class-validator"

export class updateArticleDto {
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
    author?: string

    @IsString()
    @IsOptional()
    content?: string
}