import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({ allow_display_name: true }, { message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
