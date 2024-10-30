import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { GetMessageDto } from './dtos/get-message.dto';
import { UserInterceptor } from 'src/user/interceptors/user.interceptor';
import { User } from 'src/user/decorators/user.decorator';
import { UserType } from 'src/user/types/user.type';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('all')
  async findAllMessage(): Promise<GetMessageDto[]> {
    return this.messageService.findAllMessage();
  }

  @Get('id/:id') 
  async findOneMessage(@Param('id', ParseIntPipe) messageId: number): Promise<GetMessageDto> {
    return this.messageService.findOneMessage(messageId);
  }

  @UseInterceptors(UserInterceptor)
  @Post() 
  async createMessage(@Body() body: CreateMessageDto, @User() user: UserType): Promise<GetMessageDto> {
    return this.messageService.createMessage(body, user)
  }

  @Delete('id/:id')
  async deleteMessage(@Param('id', ParseIntPipe) messageId: number): Promise<string> {
    return this.messageService.deleteMessage(messageId)
  }
}
