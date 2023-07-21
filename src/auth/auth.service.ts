import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { Session } from 'src/session/entities/session.entity';
import { SessionService } from 'src/session/session.service';
import { LoginResponseType } from './types/login-response.type';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';
import { JwtPayloadType } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    await this.userService.create(registerDto);
  }

  async login(loginDto: LoginDto): Promise<LoginResponseType> {
    const user = await this.userService.findOne({ email: loginDto.email });

    if (!user) throw new NotFoundException('User not found');

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isValidPassword) throw new BadRequestException('Invalid password');

    const session = await this.sessionService.create({
      user,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      sessionId: session.id,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.softDelete(data.sessionId);
  }

  async me(userJwtPayload: JwtPayloadType): Promise<User> {
    return this.userService.findOne({
      id: userJwtPayload.id,
    });
  }

  private async getTokensData(data: {
    id: User['id'];
    sessionId: Session['id'];
  }) {
    const tokenExpiresIn = this.configService.get(
      'AUTH_JWT_TOKEN_EXPIRES_IN',
    ) as string;

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.get('AUTH_JWT_SECRET'),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.get('AUTH_REFRESH_SECRET'),
          expiresIn: this.configService.get('AUTH_REFRESH_TOKEN_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
