import { Exclude } from "class-transformer"
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class GetVisionDto {
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
    khmerDescription: string

    @IsString()
    @IsNotEmpty()
    image: string

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    constructor(partial: Partial<GetVisionDto>) {
        Object.assign(this, partial)
    }
}