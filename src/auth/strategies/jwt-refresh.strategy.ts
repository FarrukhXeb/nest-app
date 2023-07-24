import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadType } from '../types/jwt-payload.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('refresh_token'),
      secretOrKey: configService.get('AUTH_REFRESH_SECRET'),
    });
  }
  public validate(payload: JwtPayloadType): JwtPayloadType {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
