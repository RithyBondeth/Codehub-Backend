import { Exclude } from "class-transformer"
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { UserRoles, GenderType } from "src/entities/user.entity"

export class GetUserDto {
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsOptional()
    dob?: string

    @IsEnum(GenderType)
    @IsNotEmpty()
    gender: string
    
    @IsNumber()
    @IsOptional()
    phone?: number

    @IsString()
    @IsOptional()
    avatar?: string

    @IsEnum(GenderType)
    @IsNotEmpty()
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

    @IsString()
    @IsOptional()
    googleId?: string

    @IsString()
    @IsOptional()
    facebookId?: string

    @IsString()
    @IsOptional()
    githubId?: string 

    @Exclude()
    updatedAt: Date

    @Exclude()
    createdAt: Date

   constructor(partial: Partial<GetUserDto>) {
        Object.assign(this, partial)
   }
}