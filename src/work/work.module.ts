import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkController } from './work.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from 'src/entities/work.entity';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Work, User])],
  controllers: [WorkController],
  providers: [WorkService, UploadfileService, JwtService],
})
export class WorkModule {}
