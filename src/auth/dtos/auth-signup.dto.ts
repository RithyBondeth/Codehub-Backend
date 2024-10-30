import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { GenderType } from 'src/entities/user.entity';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  dob: string;

  @IsEnum(GenderType)
  @IsNotEmpty()
  gender: GenderType;

  @IsPositive()
  @IsOptional()
  phone?: number;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[A-Za-z])(?=.*\d).+$/)
  @IsNotEmpty()
  password: string;
}
