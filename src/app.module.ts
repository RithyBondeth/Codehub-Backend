import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { UploadfileService } from './uploadfile/uploadfile.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommentModule } from './comment/comment.module';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { WorkModule } from './work/work.module';
import { VisionModule } from './vision/vision.module';
import { ServiceModule } from './service/service.module';
import { TechnologyModule } from './technology/technology.module';
import { MessageModule } from './message/message.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dbConfig,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    AuthModule,
    CommentModule,
    ArticleModule,
    UserModule,
    WorkModule,
    VisionModule,
    ServiceModule,
    TechnologyModule,
    MessageModule,
    CourseModule,
  ],
  controllers: [],
  providers: [
    UploadfileService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    }
  ],
})
export class AppModule {}
