import { Module } from '@nestjs/common';
import { VisionService } from './vision.service';
import { VisionController } from './vision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vision } from 'src/entities/vision.entity';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vision, User])],
  exports: [VisionService],
  controllers: [VisionController],
  providers: [VisionService, UploadfileService, JwtService],
})
export class VisionModule {}
