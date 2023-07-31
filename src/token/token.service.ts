import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import ms from 'ms';
import { User } from 'src/users/entities/user.entity';
import { Token } from './entities/token.entity';
import { TokenType } from './token-type.enum';
import { JwtPayloadType } from 'src/auth/types/jwt-payload.type';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async generateAuthTokens(user: User) {
    const tokenExpiresIn = this.configService.get(
      'AUTH_JWT_TOKEN_EXPIRES_IN',
    ) as string;

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: user.id,
          role: user.role.name,
          type: TokenType.ACCESS,
        },
        {
          secret: this.configService.get('AUTH_JWT_SECRET'),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          id: user.id,
          type: TokenType.REFRESH,
        },
        {
          secret: this.configService.get('AUTH_REFRESH_SECRET'),
          expiresIn: this.configService.get('AUTH_REFRESH_TOKEN_EXPIRES_IN'),
        },
      ),
    ]);

    await this.tokenRepository.save(
      this.tokenRepository.create({
        token: refreshToken,
        type: TokenType.REFRESH,
        user,
      }),
    );

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  public async refreshTokens(refreshToken: string) {
    const { user, ...token } = await this.verifyToken(
      refreshToken,
      TokenType.REFRESH,
      this.configService.get('AUTH_REFRESH_SECRET'),
    );
    if (!token) throw new UnauthorizedException('Refresh token not in DB');
    // Removing old refresh_token from DB
    this.tokenRepository.delete({ id: token.id });
    // const { user } = token;
    return { ...(await this.generateAuthTokens(user)), user: user };
  }

  public async verifyToken(
    token: string,
    type: TokenType,
    secret: string,
  ): Promise<Token> {
    const payload = this.jwtService.verify(token, { secret }) as JwtPayloadType;
    if (!payload) throw new UnauthorizedException('Token not valid');
    const tokenDoc = await this.tokenRepository.findOne({
      where: { token, type, user: { id: payload.id } },
      relations: ['user'],
    });
    return tokenDoc;
  }

  public async delete(options: FindOptionsWhere<Token>): Promise<void> {
    await this.tokenRepository.delete(options);
  }
}
