import { Exclude, Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator"
import { UserRoles } from "src/entities/user.entity"

class GetUser {
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
    
    @IsString()
    @IsOptional()
    avatar?: string

    @Exclude()
    role: UserRoles 

    @Exclude()
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

class GetArticle {
    @IsString()
    @IsNotEmpty()
    id: number

    @IsString()
    @IsNotEmpty()
    title: string 

    @Exclude()
    khmerTitle: string 

    @Exclude()
    description: string 

    @Exclude()
    author: string
    
    @Exclude()
    thumbnail: string

    @Exclude()
    poster: string

    @Exclude()
    content: string

    @Exclude()
    createdAt: Date 

    @Exclude()
    updatedAt: Date
}

export class GetCommentDto {
    @IsNumber()
    @IsPositive()
    id: number
    
    @IsString()
    @IsNotEmpty()
    content: string

    @Type(() => GetUser)
    @ValidateNested({ each: true })
    user: GetUser

    @Type(() => GetArticle)
    @ValidateNested({ each: true })
    article: GetArticle 

    @Exclude()
    updatedAt: Date

    @IsString()
    @IsNotEmpty()
    createdAt: Date

    constructor(partial: Partial<GetCommentDto>) {
        Object.assign(this, partial)
    }
}
   