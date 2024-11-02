import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { GetCourseDto } from './dtos/get-course.dto';
import * as path from 'path';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course) private courseRepo: Repository<Course>,
        private uploadFileService: UploadfileService
    ) {}

    async findAllCourse(): Promise<GetCourseDto[]> {
        const course = await this.courseRepo.find()
        if(!course) throw new NotFoundException("There's no course available in database")
        
        return course.map((course) => new GetCourseDto(course))
    } 

    async findOneCourse({ courseId }: { courseId: number; }): Promise<GetCourseDto> {
        const course = await this.courseRepo.findOne({ where: { id: courseId } })
        if(!course) throw new NotFoundException(`There's no course with id ${courseId}`)

        return new GetCourseDto(course)
    }

    async createCourse(body: CreateCourseDto, thumbnail: Express.Multer.File, poster: Express.Multer.File): Promise<GetCourseDto> {
        const course = this.courseRepo.create({
            ...body,
            thumbnail: thumbnail ? this.uploadFileService.getUploadFileUrl(thumbnail) : "",
            poster: poster ? this.uploadFileService.getUploadFileUrl(poster) : ""
        })

        await this.courseRepo.save(course)
        return new GetCourseDto(course)
    }

    async updateCourse(body: UpdateCourseDto, courseId: number, thumbnail: Express.Multer.File, poster: Express.Multer.File): Promise<GetCourseDto> {
        const course = await this.findOneCourse({ courseId })
       
        if(thumbnail) {
            const thumbnailPath = path.join(process.cwd(), 'uploads', course.thumbnail.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(thumbnailPath, "thumbnail")
        }

        if(poster) {
            const posterPath =  path.join(process.cwd(), 'uploads', course.poster.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(posterPath, "poster")
        }
        
        const updateCourse = {
            ...course,
            title: body.title,
            khmerTitle: body.khmerTitle,
            description: body.description,
            khmerDescription: body.khmerDescription,
            duration: body.duration,
            price: body.price,
            thumbnail: thumbnail? this.uploadFileService.getUploadFileUrl(thumbnail) : course.thumbnail,
            poster: poster? this.uploadFileService.getUploadFileUrl(poster) : course.poster
        }

        await this.courseRepo.save(updateCourse)

        const courseAfterUpdate = await this.findOneCourse({ courseId })
        return new GetCourseDto(courseAfterUpdate)
    }
}
