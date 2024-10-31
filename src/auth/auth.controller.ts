import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { SignUpDto } from './dtos/auth-signup.dto';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignInDto } from './dtos/auth-signin.dto';
import { ForgotPasswordDto } from './dtos/auth-forgotpassword.dto';
import { ResetPasswordDto } from './dtos/auth-resetpassword.dto';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { FacebookAuthGaurd } from './guards/facebook-auth/facebook-auth.guard';
import { GithubAuthGuard } from './guards/github-auth/githu-auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { UserType } from 'src/user/types/user.type';
import { UserInterceptor } from 'src/user/interceptors/user.interceptor';
import { UserRoles } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('avatar', { storage: UploadfileService.storageOptions }))
  async signup(@Body() body: SignUpDto, @UploadedFile() avatar: Express.Multer.File): Promise<{accessToken: string}> {
    return this.authService.signup(body, avatar); 
  }

  @Post('signin')
   async signin(@Body() body: SignInDto): Promise<{accessToken: string}> {
    return this.authService.signin(body);
  }


  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Put('role/:id')
  async updateRole(@Param('id', ParseIntPipe) userId: number, @Body('role') role: UserRoles) {
    return this.authService.updateRole(userId, role)
  }
  
  @Post('forgot-password') 
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<string> {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password/:resetToken')
  resetPassword(
    @Param('resetToken') resetToken: string,
    @Body() body: ResetPasswordDto,
  ): Promise<string> {
    return this.authService.resetPassword(resetToken, body);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user
    res.redirect(`${process.env.FRONTEND_URL}?token=${user.token}`)
  }


  @Get('facebook/login')
  @UseGuards(FacebookAuthGaurd)
  async facebookAuth(){}

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGaurd)
  async facebookCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user
    res.redirect(`${process.env.FRONTEND_URL}?token=${user.token}`)
  }

  @Get('github/login')
  @UseGuards(GithubAuthGuard)
  async githubAuth(){}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard) 
  async githubCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user
    res.redirect(`${process.env.FRONTEND_URL}?token=${user.token}`)
  }

  @UseInterceptors(UserInterceptor)
  @Get('me')
  async getMe(@User() user: UserType): Promise<UserType> {
    return user;
  }
}
