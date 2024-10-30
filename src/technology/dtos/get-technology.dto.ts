import { Exclude } from "class-transformer"
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class GetTechnologyDto {
    @IsNumber()
    @IsPositive()
    id: number

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    icon: string

    @Exclude()
    updatedAt: Date

    @Exclude()
    createdAt: Date

    constructor(partial: Partial<GetTechnologyDto>) {
        Object.assign(this, partial)
    }
}