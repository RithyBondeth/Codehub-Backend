import { Exclude, Type } from "class-transformer"
import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator"
import { UserRoles } from "src/entities/user.entity"

class UserDto {
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsString()
    @IsNotEmpty()
    username: string

    @Exclude()
    dob: string

    @Exclude()
    gender: string
    
    @Exclude()
    phone: number

    @Exclude()
    avatar: string

    @Exclude()
    role: UserRoles 

    @IsEmail()
    @IsNotEmpty()
    email: string  

    @Exclude()
    password: string

    @Exclude()
    resetPasswordToken: string

    @Exclude()
    resetPassowrdExpire: Date 

    @Exclude()
    googleId: string

    @Exclude()
    facebookId: string

    @Exclude()
    githubId: string 

    @Exclude()
    updatedAt: Date

    @Exclude()
    createdAt: Date
}

export class GetMessageDto {
    @IsNumber()
    @IsPositive()
    id: number

    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    message: string

    @Type(() => UserDto)
    @ValidateNested({ each: true })
    user: UserDto

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    constructor(partial: Partial<GetMessageDto>) {
        Object.assign(this, partial)
    }
}