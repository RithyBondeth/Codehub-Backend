import { IsOptional, IsString } from "class-validator"

export class FilterArticleDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    khmerTitle?: string   
}