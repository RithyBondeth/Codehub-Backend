import { IsOptional, IsString } from "class-validator"

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    title: string

    @IsString()
    @IsOptional()
    khmerTitle: string
    
    @IsString()
    @IsOptional()
    description: string
    
    @IsString()
    @IsOptional()
    khmerDescription: string

    @IsString()
    @IsOptional()
    duration: string

    @IsString()
    @IsOptional()
    price: string
}