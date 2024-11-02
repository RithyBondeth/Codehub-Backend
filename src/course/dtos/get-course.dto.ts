import { Exclude } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class GetCourseDto {
    @IsNumber()
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
    khmerDescription: string

    @IsString()
    @IsNotEmpty()
    duration: string

    @IsString()
    @IsNotEmpty()
    thumbnail: string

    @IsString()
    @IsNotEmpty()
    poster: string

    @IsString()
    @IsNotEmpty()
    price: string

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    constructor(partial: Partial<GetCourseDto>) {
        Object.assign(this, partial)
    }
}