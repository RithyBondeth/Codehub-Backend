import { Module } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { TechnologyController } from './technology.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from 'src/entities/technology.entity';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Technology, User ])],
  controllers: [TechnologyController],
  providers: [TechnologyService, UploadfileService, JwtService],
})
export class TechnologyModule {}
