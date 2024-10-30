import { IsNotEmpty, IsString } from "class-validator"

export class CreateWorkDto {
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
    author: string

    @IsString()
    @IsNotEmpty()
    content: string

    @IsString()
    @IsNotEmpty()
    githubLink: string
}