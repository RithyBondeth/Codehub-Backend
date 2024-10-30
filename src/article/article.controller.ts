import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { GetArticleDto } from './dtos/get-article.dto';
import { updateArticleDto } from './dtos/update-article.dto';
import { FilterArticleDto } from './dtos/filter-article.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  
  @Get('all')
  async findAllArticle(
    @Query() filter: FilterArticleDto
  ): Promise<GetArticleDto[]> {
    return this.articleService.findAllArticle(filter)
  } 

  @Get('count')
  async countArticle(): Promise<{count: number}> {
    return this.articleService.countArticle()
  }

  @Get(':id')
  async findOneArticleById(@Param('id', ParseIntPipe) articleId: number): Promise<GetArticleDto> {
    return this.articleService.findOneArticle(articleId)
  }

  @Roles(UserRoles.ADMIN)
  @UseInterceptors(AuthGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor({ storage: UploadfileService.storageOptions }))
  async createArticle(
    @Body() body: CreateArticleDto, 
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<GetArticleDto> {
    const thumbnail = files.find((file) => file.fieldname === 'thumbnail')
    const poster = files.find((file) => file.fieldname === 'poster')

    return this.articleService.createArticle(body, thumbnail, poster)
  }

  @Roles(UserRoles.ADMIN)
  @UseInterceptors(AuthGuard)
  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor({ storage: UploadfileService.storageOptions }))
  async updateArticle(
    @Body() body: updateArticleDto,  
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id', ParseIntPipe) articleId: number
  ): Promise<GetArticleDto> {
    const thumbnail = files.find((file) => file.fieldname === 'thumbnail')
    const poster = files.find((file) => file.fieldname === 'poster')

    return this.articleService.updateArticle(body, thumbnail, poster, articleId)
  }

  @Roles(UserRoles.ADMIN)
  @UseInterceptors(AuthGuard)
  @Delete(':id')
  async deleteArticle(@Param('id', ParseIntPipe) articleId: number): Promise<string> {
    return this.articleService.deleteArticle(articleId)   
  }
}
