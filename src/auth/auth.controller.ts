import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseType } from './types/login-response.type';
import { User } from 'src/users/entities/user.entity';
import { JwtRequest } from './decorators/jwt-request.decorator';
import { JwtPayloadType } from './types/jwt-payload.type';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() createUserDto: RegisterDto): Promise<void> {
    this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: LoginDto): Promise<LoginResponseType> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@JwtRequest() jwt: JwtPayloadType): Promise<void> {
    await this.authService.logout({
      id: jwt.id, // the user id
    });
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refreshTokens(
    @Query() refreshTokenDto: RefreshTokenDto,
  ): Promise<Omit<LoginResponseType, 'user'>> {
    return this.authService.refreshTokens(refreshTokenDto.refresh_token);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async me(@JwtRequest() jwt: JwtPayloadType): Promise<User> {
    return this.authService.me(jwt);
  }
}
