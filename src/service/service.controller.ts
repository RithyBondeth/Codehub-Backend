import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dtos/create-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { GetServiceDto } from './dtos/get-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('all') 
  async findAllService(): Promise<GetServiceDto[]> {
     return this.serviceService.findAllService()
  }

  @Get('id/:id')
  async findOneService(@Param('id', ParseIntPipe) serviceId: number): Promise<GetServiceDto> {
    return this.serviceService.findOneService(serviceId) 
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: UploadfileService.storageOptions }))
  @Post()
  async createService(@Body() body: CreateServiceDto, @UploadedFile() image: Express.Multer.File): Promise<GetServiceDto> {
    return this.serviceService.createService(body, image)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: UploadfileService.storageOptions }))
  @Put('id/:id')
  updateService(
    @Body() body: UpdateServiceDto, 
    @Param('id', ParseIntPipe) serviceId: number, 
    @UploadedFile() image: Express.Multer.File
  ): Promise<UpdateServiceDto> {
    return this.serviceService.updateService(serviceId, body, image)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Delete('id/:id')
  async deleteService(@Param('id', ParseIntPipe) serviceId: number): Promise<string> {
      return this.serviceService.deleteService(serviceId)
  }
}
