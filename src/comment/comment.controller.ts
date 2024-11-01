import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UserInterceptor } from 'src/user/interceptors/user.interceptor';
import { User } from 'src/user/decorators/user.decorator';
import { UserType } from 'src/user/types/user.type';
import { GetCommentDto } from './dtos/get-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('all/article/:id')
  async findAllCommnet(@Param('id', ParseIntPipe) articleId: number): Promise<GetCommentDto[]> {
    return this.commentService.findAllComment(articleId)
  }
  
  @Get('count')
  async countCommnet(): Promise<{count: number}> {
    return this.commentService.countComment()
  }

  @Get('id/:id')
  async findOneComment(@Param('id', ParseIntPipe) commentId: number): Promise<GetCommentDto> {
    return this.commentService.findOneComment(commentId)
  }

  @UseInterceptors(UserInterceptor)
  @Post()
  async createComment(@Body() body: CreateCommentDto, @User() user: UserType) {
    return this.commentService.createComment(body, user)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Put('id/:id') 
  async updateCommen(
    @Param('id', ParseIntPipe) commentId: number, 
    @Body() body: UpdateCommentDto,
    @User() user: UserType
  ): Promise<GetCommentDto> {
    return this.commentService.udpateComment(commentId, body, user)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Delete('id/:id') 
  async deleteComment(
    @Param('id', ParseIntPipe) commentId: number, 
    @User() user: UserType
  ): Promise<string> {
    return this.commentService.deleteComment(commentId, user)
  }
}
