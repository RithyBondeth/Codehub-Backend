import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dtos/create-work.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { GetWorkDto } from './dtos/get-work.dto';
import { UpdateWorkDto } from './dtos/update-work.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Get('all')
  async findAllWork(): Promise<GetWorkDto[]> {
    return this.workService.findAllWork()
  }

  @Get('count') 
  async countWork(): Promise<{count: number}> {
    return this.workService.countWork()
  }

  @Get(':id')
  findOneWork(@Param('id', ParseIntPipe) workId: number): Promise<GetWorkDto> {
    return this.workService.findOneWork(workId) 
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor({ storage: UploadfileService.storageOptions }))
  @Post()
  async createWork(
    @Body() body: CreateWorkDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<GetWorkDto> {
    const thumbnail = files.find((file) => file.fieldname === 'thumbnail')
    const poster = files.find((file) => file.fieldname === 'poster')

    return this.workService.createWork(body, thumbnail, poster)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor({ storage: UploadfileService.storageOptions }))
  @Put(':id')
  async updateWork(
    @Param('id', ParseIntPipe) workId: number,
    @Body() body: UpdateWorkDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<GetWorkDto> {
    const thumbnail = files.find((file) => file.fieldname === 'thumbnail')
    const poster = files.find((file) => file.fieldname === 'poster')
   
    return this.workService.updateWork(body, workId, thumbnail, poster)
  } 

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteWork(@Param('id', ParseIntPipe) workId: number): Promise<string> {
    return this.workService.deleteWork(workId) 
  }
}
