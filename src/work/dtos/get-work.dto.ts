import { Exclude } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class GetWorkDto {
    @IsNumber()
    @IsPositive()
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
    content: string

    @IsString()
    @IsNotEmpty()
    thumbnail: string

    @IsString()
    @IsNotEmpty()
    poster: string

    @IsString()
    @IsNotEmpty()
    githubLink: string

    @IsDate()
    @IsNotEmpty()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    constructor(partial: Partial<GetWorkDto>) {
        Object.assign(this, partial)
    }
}