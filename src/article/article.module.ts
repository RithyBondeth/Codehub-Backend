import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Article, User ])],
  controllers: [ArticleController],
  providers: [ArticleService, UploadfileService, JwtService],
})
export class ArticleModule {}
