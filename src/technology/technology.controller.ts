import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { CreateTechnologyDto } from './dtos/create-technology.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { GetTechnologyDto } from './dtos/get-technology.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('technology')
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Get('all')
  async findAllTechnology(): Promise<GetTechnologyDto[]> {
      return this.technologyService.findAllTechnology();
  }

  @Get('id/:id')
  findOneTechnolog(@Param('id', ParseIntPipe) technologyId: number): Promise<GetTechnologyDto> {
    return this.technologyService.findOneTechnology(technologyId)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('icon', { storage: UploadfileService.storageOptions }))
  @Post()
  async createTechnology(@Body() body: CreateTechnologyDto, @UploadedFile() icon: Express.Multer.File): Promise<GetTechnologyDto> {
    return this.technologyService.createTechnology(body, icon);  
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('icon', { storage: UploadfileService.storageOptions }))
  @Put('id/:id')
  async updateTechnology(
    @Body() body: any, 
    @Param('id', ParseIntPipe) technologyId: number, 
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<GetTechnologyDto> {
      return this.technologyService.updateTechnology(body, technologyId, icon)
  }  

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Delete('id/:id')
  async deleteTechnology(@Param('id', ParseIntPipe) technologyId: number): Promise<string> {
    return this.technologyService.deleteTechnology(technologyId)
  }
}
