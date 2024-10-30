import { IsNotEmpty, IsString } from "class-validator"

export class CreateVisionDto {
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
}