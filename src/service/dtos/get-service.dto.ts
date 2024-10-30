import { Exclude } from "class-transformer"
import { IsNotEmpty, IsString } from "class-validator"

export class GetServiceDto {
    @IsString()
    @IsNotEmpty()
    id: number

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

    @IsString()
    @IsNotEmpty()
    image: string

    @Exclude()
    updatedAt: Date

    @Exclude()
    createdAt: Date

    constructor(partial: Partial<GetServiceDto>) {
        Object.assign(this, partial)
    }
}