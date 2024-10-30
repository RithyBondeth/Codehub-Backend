import { IsNotEmpty, IsString } from "class-validator"

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    content: string

    @IsString()
    @IsNotEmpty()
    khmerContent: string

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
