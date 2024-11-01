import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UserType } from 'src/user/types/user.type';
import { Article } from 'src/entities/article.entity';
import { GetCommentDto } from './dtos/get-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        @InjectRepository(Article) private articleRepo: Repository<Article>
    ) {}
    
    async findAllCommentByArticle(articleId: number): Promise<GetCommentDto[]> {
        const comments = await this.commentRepo.find({ 
            relations: ["user", "article"],
            where: { article: { id: articleId } }
        })
        if(!comments) throw new NotFoundException("There's no comment in database")
        
        return comments.map((comment) => new GetCommentDto(comment))
    }   

    async findOneCommentByArticle(commentId: number, articleId: number): Promise<GetCommentDto> {
        const comment = await this.commentRepo.findOne({ 
            relations: ["user", "article"], 
            where: { id: commentId, article: { id: articleId } } 
        })
        if(!comment) throw new NotFoundException(`There's no comment with id ${commentId}`)

        return new GetCommentDto(comment)
    }

    async countCommentByArticle(articleId: number): Promise<{count: number}> {
        const count = await this.commentRepo.count({ 
            where: { article: { id: articleId } } 
        })
        return { count: count }
    }

    async createComment(body: CreateCommentDto, user: UserType) {
        const article = await this.articleRepo.findOne({ where: { id: body.articleId } })
        if(!article) throw new NotFoundException(`There's no article with id ${body.articleId}`)

        const commment = this.commentRepo.create({ 
            content: body.content,
            user: { id: user.sub },
            article: { id: body.articleId } 
        })
        await this.commentRepo.save(commment)

        return commment
    }

    async udpateComment(commentId: number, body: UpdateCommentDto, user: UserType): Promise<GetCommentDto> {
        const comment = await this.commentRepo.findOne({ 
            relations: ["user", "article"],
            where: { id: commentId, user: { id: user.sub } }
        })
        if(!comment) throw new NotFoundException(`There's no comment with id ${commentId} that belong to ${user.username}`)

        comment.content = body.content
        await this.commentRepo.save(comment)

        return new GetCommentDto(comment)
    }

    async deleteComment(commentId: number, user: UserType): Promise<string> {
        const comment = await this.commentRepo.findOne({ 
            where: { id: commentId, user: { id: user.sub } }
        })
        if(!comment) 
            throw new NotFoundException(`There's no comment with id ${commentId} that belongs to ${user.username}`)
        
        await this.commentRepo.delete(commentId)

        return "Comment deleted successfully"
    }
}
