import { Exclude, Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator"

class CommentDto {
    @IsNumber()
    @IsPositive()
    id: number

    @IsString()
    @IsNotEmpty()
    content: string

    @IsDate()
    @IsNotEmpty()
    updatedAt: Date

    @IsDate()
    @IsNotEmpty()
    createdAt: Date
}

export class GetArticleDto {   
    @IsString()
    @IsNotEmpty()
    id: number

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
    thumbnail: string

    @IsString()
    @IsNotEmpty()
    poster: string

    @IsString()
    @IsNotEmpty()
    content: string

    @Type(() => CommentDto)
    @ValidateNested({ each: true })
    comments: CommentDto[]

    @IsDate( )
    @IsNotEmpty()
    createdAt: Date 

    @Exclude()
    updatedAt: Date

    constructor(partial: Partial<GetArticleDto>) {
        Object.assign(this, partial)
    }
}