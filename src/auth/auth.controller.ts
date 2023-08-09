import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseType } from './types/login-response.type';
import { User } from 'src/users/entities/user.entity';
import { RequestWithUser } from './decorators/user-request.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  cookieOptions = {
    httpOnly: true,
    domain: 'localhost', // only for production
    path: '/api', // only for production
    // maxAge: 3600, // only for production
  };
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() createUserDto: RegisterDto): Promise<void> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Omit<LoginResponseType, 'token'>> {
    const { token, ...rest } = await this.authService.login(loginDto);
    this.setAuthCookies(response, token);
    return rest;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(
    @RequestWithUser() user: Pick<User, 'id'>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const isProd = this.configService.get('NODE_ENV') === 'production';

    response.clearCookie('Authentication', {
      ...this.cookieOptions,
      secure: isProd,
    });

    response.clearCookie('Refresh', {
      ...this.cookieOptions,
      secure: isProd,
    });

    return await this.authService.logout({
      id: user.id, // the user id
    });
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async refreshTokens(
    @Query() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Omit<LoginResponseType, 'token'>> {
    const { token, ...rest } = await this.authService.refreshTokens(
      refreshTokenDto.refresh_token,
    );
    this.setAuthCookies(response, token);
    return rest;
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async me(@RequestWithUser() user: Pick<User, 'id'>): Promise<User> {
    return this.authService.me(user.id);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @RequestWithUser() user: Pick<User, 'id'>,
  ): Promise<void> {
    return await this.authService.delete(user.id);
  }

  setAuthCookies(response: Response, token: string) {
    const isProd = this.configService.get('NODE_ENV') === 'production';
    response.cookie('Authentication', token, {
      ...this.cookieOptions,
      secure: isProd,
    });
  }
}
