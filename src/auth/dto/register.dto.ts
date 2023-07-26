import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({ allow_display_name: true }, { message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @IsOptional()
  lastName?: string;
}
