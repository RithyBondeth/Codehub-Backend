import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/entities/service.entity';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Service, User ])],
  controllers: [ServiceController],
  providers: [ServiceService, UploadfileService, JwtService],
})
export class ServiceModule {}
