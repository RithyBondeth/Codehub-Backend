import { IsNumber, IsPositive } from "class-validator"

export class CountUserDto {
    @IsNumber()
    @IsPositive()
    total: number

    @IsNumber()
    @IsPositive()
    roleUser: number

    @IsNumber()
    @IsPositive()
    roleAdmin: number

    constructor(partial: Partial<CountUserDto>) {
        Object.assign(this, partial)
    } 
}