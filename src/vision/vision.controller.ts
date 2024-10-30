import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { VisionService } from './vision.service';
import { CreateVisionDto } from './dtos/create-vision.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { GetVisionDto } from './dtos/get-vision.dto';
import { UpdateVisionDto } from './dtos/update-vision.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('vision')
export class VisionController {
  constructor(private readonly visionService: VisionService) {}

  @Get('all')
  async findAllVision(): Promise<GetVisionDto[]> {
    return this.visionService.findAllVision();
  }

  @Get('id/:id')
  async findOneVision(@Param('id', ParseIntPipe) visionId: number): Promise<GetVisionDto> {
    return this.visionService.findOneVision(visionId)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: UploadfileService.storageOptions }))
  async createVision(@Body() body: CreateVisionDto, @UploadedFile() image: Express.Multer.File): Promise<GetVisionDto> {
    return this.visionService.createVision(body, image)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Put('id/:id')
  @UseInterceptors(FileInterceptor('image', { storage: UploadfileService.storageOptions }))
  async updateVivsion(
    @Param('id', ParseIntPipe) visionId: number,
    @Body() body: UpdateVisionDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<GetVisionDto> {
    return this.visionService.updateVision(visionId, body, image)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Delete('id/:id')
  async deleteVision(@Param('id', ParseIntPipe) visionId: number): Promise<string> {
    return this.visionService.deleteVision(visionId)
  }
}
