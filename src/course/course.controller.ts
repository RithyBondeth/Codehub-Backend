import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { GetCourseDto } from './dtos/get-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('all')
  async findAllCourse(): Promise<GetCourseDto[]> {
    return this.courseService.findAllCourse()
  }

  @Get(':id')
  async findOneCourse(@Param('id', ParseIntPipe) courseId: number): Promise<GetCourseDto> {
    return this.courseService.findOneCourse({ courseId })
  }
 
  @UseInterceptors(AnyFilesInterceptor({ storage: UploadfileService.storageOptions }))
  @Post()
  async createCourse(@Body() body: CreateCourseDto, @UploadedFiles() files: Array<Express.Multer.File>): Promise<GetCourseDto> {
    const thumbnail = files.find((file) => file.fieldname === 'thumbnail')
    const poster = files.find((file) => file.fieldname === 'poster')

    return this.courseService.createCourse(body, thumbnail, poster)    
  }
 
  @UseInterceptors(AnyFilesInterceptor({ storage: UploadfileService.storageOptions }))
  @Put(':id')
  async updateCourse(
    @Body() body: UpdateCourseDto, 
    @Param('id', ParseIntPipe) courseId: number,
    @UploadedFiles() files: Array<Express.Multer.File> 
  ) {
    const thumbnail = files ? files.find((file) => file.fieldname === 'thumbnail') : null
    const poster = files ? files.find((file) => file.fieldname === 'poster') : null
  
    return this.courseService.updateCourse(body, courseId, poster, thumbnail)
  }
}
