import { Controller, Delete, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserDto } from './dtos/get-user.dto';
import { FilterUserDto } from './dtos/filter-user.dto';
import { CountUserDto } from './dtos/count-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Roles(UserRoles.ADMIN)
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAllUser(@Query() filter: FilterUserDto): Promise<GetUserDto[]> {
    return this.userService.findAllUser(filter);
  }

  @Get('id/:id') 
  async findOneUser(@Param('id', ParseIntPipe) userId: number): Promise<GetUserDto> {
    return this.userService.findOneUserById(userId) 
  }

  @Get('username/:username')
  async findOneUserByUsername(@Param('username') username: string): Promise<GetUserDto> {
    return this.userService.findOneUserByUsername(username)
  }

  @Get('email/:email')
  async findOneUserByEmail(@Param('email') email: string): Promise<GetUserDto> {
    return this.userService.findOneUserByEmail(email)
  }

  @Delete('id/:id')
  async deleteUser(@Param('id', ParseIntPipe) userId: number): Promise<string> {
    return this.userService.deleteUser(userId)
  }

  @Get('count')
  async countUser(): Promise<CountUserDto> {
    return this.userService.countUser() 
  }
}
