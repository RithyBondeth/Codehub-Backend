import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { GetArticleDto } from './dtos/get-article.dto';
import { updateArticleDto } from './dtos/update-article.dto';
import * as path from 'path';
import { FilterArticleDto } from './dtos/filter-article.dto';

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(Article) private articleRepo: Repository<Article>,   
    private readonly uploadFileService: UploadfileService
) {}
    async findAllArticle(filter: FilterArticleDto): Promise<GetArticleDto[]> {
        const query = this.articleRepo.createQueryBuilder('article').leftJoinAndSelect('article.comments', 'comment')

        if(filter.title) {
            query.andWhere('article.title ILIKE :title', { title: `%${filter.title}%`})
        }
        if(filter.khmerTitle) {
            query.andWhere('article.khmerTitle ILIKE :khmerTitle', { khmerTitle: `%${filter.khmerTitle}%`})
        }

        const articles = await query.getMany()

        if(!articles || articles.length === 0) throw new NotFoundException('There is no article')
        
        return articles.map((article) => new GetArticleDto(article)) 
    }

    async findOneArticle(articleId: number): Promise<GetArticleDto> {
        const article = await this.articleRepo.findOne({ 
            relations: ["comments"], 
            where: { id: articleId } 
        })
        if(!article) throw new NotFoundException(`There is no article with id ${articleId}`)

        return new GetArticleDto(article) 
    }

    async createArticle(body: CreateArticleDto, thumbnail: Express.Multer.File, poster: Express.Multer.File): Promise<GetArticleDto> {
        const article = await this.articleRepo.findOne({ where: { title: body.title } })
        
        if(article) {
            //Delete thumbnail and poster if article did not create
            if(thumbnail) {
                const thumbnailPath = path.join(process.cwd(), 'uploads', article.thumbnail.replace(/.*uploads\//, ''))
                this.uploadFileService.deleteFile(thumbnailPath, "Thumbnail")
            }
            if(poster) {
                const posterPath =  path.join(process.cwd(), 'uploads', article.poster.replace(/.*uploads\//, ''))
                this.uploadFileService.deleteFile(posterPath, "poster")
            }
           
            throw new ConflictException(`${body.title} title already exists`)
        }
 
        const newArticle = this.articleRepo.create({
            ...body, 
            thumbnail: thumbnail ? this.uploadFileService.getUploadFileUrl(thumbnail) : "",
            poster: poster ? this.uploadFileService.getUploadFileUrl(poster) : ""
        })

        await this.articleRepo.save(newArticle)
        return new GetArticleDto(newArticle)
    }   

    async updateArticle(body: updateArticleDto, thumbnail: Express.Multer.File, poster: Express.Multer.File, articleId: number): Promise<GetArticleDto> {
        const article = await this.findOneArticle(articleId)   
        
        //Delete old associated poster and thumbnail images
        if(thumbnail) {
            const thumbnailPath = path.join(process.cwd(), 'uploads', article.thumbnail.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(thumbnailPath, "Thumbnail")
        }
        if(poster) {
            const posterPath =  path.join(process.cwd(), 'uploads', article.poster.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(posterPath, "poster")
        }

        const updatedArticle = {
            ...article,
            title: body.title,
            khmerTitle: body.khmerTitle,
            description: body.description,
            author: body.author,
            content: body.content,
            thumbnail: thumbnail? this.uploadFileService.getUploadFileUrl(thumbnail) : article.thumbnail,
            poster: poster? this.uploadFileService.getUploadFileUrl(poster) : article.poster
        }

        await this.articleRepo.save(updatedArticle)    
        
        const articleAfterUpdate = await this.findOneArticle(articleId)
        return new GetArticleDto(articleAfterUpdate)
    }

    async deleteArticle(articleId: number): Promise<string> {
        const article = await this.findOneArticle(articleId)
        
        //Delete all associated files (poster and image)
        if(article.poster) {
            const posterPath =  path.join(process.cwd(), 'uploads', article.poster.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(posterPath, "poster")
        }
        if(article.thumbnail) {
            const thumbnailPath = path.join(process.cwd(), 'uploads', article.thumbnail.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(thumbnailPath, "thumbnail")
        }

        await this.articleRepo.delete(articleId)

        return `Delete article with ID ${articleId} successfully, along with its associated files.`;
    }

    async countArticle(): Promise<{count: number}> {
        const count =  await this.articleRepo.count()
        return { count: count }
    }
}
