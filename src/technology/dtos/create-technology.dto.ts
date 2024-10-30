import { IsNotEmpty, IsString } from "class-validator";

export class CreateTechnologyDto {
    @IsString()
    @IsNotEmpty()
    title: string
}