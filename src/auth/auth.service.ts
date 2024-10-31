import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dtos/auth-signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User, UserRoles } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { SignInDto } from './dtos/auth-signin.dto';
import { ForgotPasswordDto } from './dtos/auth-forgotpassword.dto';
import { ResetPasswordDto } from './dtos/auth-resetpassword.dto';
import { ConfigService } from '@nestjs/config';
import { GetUserDto } from 'src/user/dtos/get-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private uploadfileService: UploadfileService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(body: SignUpDto, avatar: Express.Multer.File): Promise<{accessToken: string}> {
    //Find if user already exists
    const existingUser = await this.userRepo.findOne({ where: { email: body.email } });
    if (existingUser) {
      const avatarPath = path.join(process.cwd(), 'uploads', avatar.filename.replace(/.*uploads\//, ''));
      if(avatar) this.uploadfileService.deleteFile(avatarPath, "avatar");

      throw new ConflictException(`${body.email} email already exists`);
    }

    //Insert user into database
    const user = this.userRepo.create({
      ...body,
      avatar: avatar ? this.uploadfileService.getUploadFileUrl(avatar)
         : body.gender === "female"  
         ? this.configService.get<string>("BASE_URL") + "uploads/avatar/female.webp" 
         : this.configService.get<string>("BASE_URL") + "uploads/avatar/male.webp",
    });
   
    await this.userRepo.save(user);
    
    //Generate token
    const payload = {
      username: body.username,
      sub: user.id,
      role: user.role,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async signin(body: SignInDto): Promise<{accessToken: string}> {
    //Find if user with that email existing
    const existingUser = await this.userRepo.findOne({ where: { email: body.email } });
    if (!existingUser) throw new NotFoundException('Invalid Email');

    //Compare password
    const isMatchedPassword = await bcrypt.compare(
      body.password,
      existingUser.password,
    );
    if (!isMatchedPassword) throw new NotFoundException('Invalid Credential');

    //Generate token
    const payload = {
      username: existingUser.username,
      sub: existingUser.id,
      role: existingUser.role,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async forgotPassword(body: ForgotPasswordDto): Promise<string> {
    //Find user with that email
    const existingUser = await this.userRepo.findOne({ where: { email: body.email }});
    if (!existingUser) throw new NotFoundException('Invalid Email');

    //Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Insert reset token and expiration
    existingUser.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    existingUser.resetPassowrdExpire = new Date(Date.now() + 10 * 60 * 1000);
    await this.userRepo.save(existingUser);

    //Send the email with the reset token
    const mailSent = await this.sendResetPasswordEmail(existingUser.email, resetToken);
    if (!mailSent) throw new BadRequestException('Failed to send reset email');

    return 'Password Reset Token Sent to Email';
  }

  async resetPassword(resetToken: string, body: ResetPasswordDto): Promise<string> {
    //Hash resetToken to finf it in the database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //Find user by token and check if token is still valid
    const existingUser = await this.userRepo.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPassowrdExpire: MoreThan(new Date()), //Token not expired
      },
    });
    if (!existingUser) throw new BadRequestException('Invalid or Expire password reset token');

    //Update password
    existingUser.password = await bcrypt.hash(body.newPassword, 10);
    existingUser.resetPasswordToken = null;
    existingUser.resetPassowrdExpire = null;
    await this.userRepo.save(existingUser);

    return 'Password Reset Successfully';
  }

  //NodeMailer function to Send Email
  private async sendResetPasswordEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASSWORD'),
        },
      });

      //const resetURL = this.configService.get<string>("BASE_URL") + `api/auth/reset-password/${resetToken}`;
      const user = await this.userRepo.findOne({ where: { email: email } });

      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject: 'Password Reset Token',
        text: `Hello, ${user.username}. I'm from Codehub you please copy the reset token code here to reset your password: ${resetToken}`,
      };

      await transport.sendMail(mailOptions);

      return true;
    } catch (error) {
      console.error('Failed to send email', error);
      return false;
    }
  }

  async updateRole(userId: number, role: UserRoles): Promise<GetUserDto> {
    const user = await this.userRepo.findOne({ where: { id: userId }})
    if(!user) throw new NotFoundException(`There is no user with id ${userId}`)
    if(user.role === role) throw new ConflictException(`User with id ${userId} already has role ${role}`)
      
    user.role = role
    await this.userRepo.save(user)

    return new GetUserDto(user);
  }

  async validateGoogleUser(profile: any) {
    const { id, emails, name, photos } = profile;
    //Check if a user with the same googleId exists
    let user = await this.userRepo.findOne({ where: { googleId: id } });

    //If not found, check if a user with the same email exists
    if (!user) {
      user = await this.userRepo.findOne({ where: { email: emails[0].value }});

      if (!user) {
        //If no user exists with the same googleId or email, create a new user
        user = this.userRepo.create({
          googleId: id,
          email: emails[0].value,
          username: `${name.givenName} ${name.familyName}`,
          avatar: photos[0].value,
          password: 'google-auth-password',
        })
      } else {
        user.googleId = id;
        user.avatar = photos[0].value;
      }

      await this.userRepo.save(user);
    }

    //Generate token
    const payload = { 
      username: user.username,
      sub: user.id,
      role: user.role
    }
    const token = this.jwtService.sign(payload);

    return { user, token };
  }

  async validateFacebookUser(profile: any) {
    const { id, emails, name, photos } = profile
    let user = await this.userRepo.findOne({ where: { facebookId: id } });

    if(!user) {
      user = await this.userRepo.findOne({ where: { email: emails[0].value } })

      if(!user) {
        user = this.userRepo.create({
          facebookId: id,
          email: emails[0].value,
          username: name.givenName + ' ' + name.familyName,
          avatar: photos[0].value,
          password: "facebook-auth-password"
        });
        await this.userRepo.save(user);
      } else {
        user.facebookId = id;
        user.avatar = photos[0].value;
        await this.userRepo.save(user);  //Update user info if it's a new user
      }
    } else {
       //Update avatar if it has changed
      user.avatar = photos[0].value;
      await this.userRepo.save(user);
    }

    //Generate token
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role
    }
    const token = this.jwtService.sign(payload);

    return { user, token };
  }

  async validateGithubUser(profile: any) {
    const { id, emails, username, photos } = profile;
    let user = await this.userRepo.findOne({ where: { githubId: id } });

    if(!user) {
      user = await this.userRepo.findOne({ where: { email: emails[0].value } })

      if(!user) {
        user = this.userRepo.create({
          githubId: id,
          email: emails[0].value,
          username: username,
          avatar: photos[0].value,
          password: "github-auth-password"
        });
        await this.userRepo.save(user); 
      } else {
        user.githubId = id;
        user.avatar = photos[0].value;
        await this.userRepo.save(user);
      }
    } else {
       //Update avatar if it has changed
      user.avatar = photos[0].value;
      await this.userRepo.save(user);
    }

    //Generate token
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role
    }
    const token = this.jwtService.sign(payload);

    return { user: user, token: token };
  }
}
