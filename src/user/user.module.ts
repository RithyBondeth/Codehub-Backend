import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserInterceptor } from './interceptors/user.interceptor';
import { JwtService } from '@nestjs/jwt';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { Comment } from 'src/entities/comment.entity';
import { Message } from 'src/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Message])],
  controllers: [UserController],
  providers: [UserService, UserInterceptor, JwtService, UploadfileService],
})
export class UserModule {}
