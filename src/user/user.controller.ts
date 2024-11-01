import { Controller, Delete, Get, Param, ParseIntPipe, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserDto } from './dtos/get-user.dto';
import { FilterUserDto } from './dtos/filter-user.dto';
import { CountUserDto } from './dtos/count-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserInterceptor } from './interceptors/user.interceptor';
import { UserType } from './types/user.type';
import { User } from './decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get('all')
  async findAllUser(@Query() filter: FilterUserDto): Promise<GetUserDto[]> {
    return this.userService.findAllUser(filter);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get('id/:id') 
  async findOneUser(@Param('id', ParseIntPipe) userId: number): Promise<GetUserDto> {
    return this.userService.findOneUserById(userId) 
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get('username/:username')
  async findOneUserByUsername(@Param('username') username: string): Promise<GetUserDto> {
    return this.userService.findOneUserByUsername(username)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get('email/:email')
  async findOneUserByEmail(@Param('email') email: string): Promise<GetUserDto> {
    return this.userService.findOneUserByEmail(email)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Delete('id/:id')
  async deleteUser(@Param('id', ParseIntPipe) userId: number): Promise<string> {
    return this.userService.deleteUser(userId)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get('count')
  async countUser(): Promise<CountUserDto> {
    return this.userService.countUser() 
  }

  @UseInterceptors(UserInterceptor)
  @Get('current-user')
  async getCurrentUser(@User() user: UserType): Promise<GetUserDto> {
    return this.userService.findOneUserById(user.sub)
  }
}
