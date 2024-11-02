import { IsNotEmpty, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    khmerTitle: string
    
    @IsString()
    @IsNotEmpty()
    description: string
    
    @IsString()
    @IsNotEmpty()
    khmerDescription: string

    @IsString()
    @IsNotEmpty()
    duration: string

    @IsString()
    @IsNotEmpty()
    price: string
}