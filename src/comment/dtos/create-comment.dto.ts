import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string   

    @IsNumber()
    @IsPositive()
    articleId: number
}