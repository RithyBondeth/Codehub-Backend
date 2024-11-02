import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';

@Module({
  imports: [TypeOrmModule.forFeature([ Course ])],
  controllers: [CourseController],
  providers: [CourseService, UploadfileService],
})
export class CourseModule {}
