import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    message: string
}
