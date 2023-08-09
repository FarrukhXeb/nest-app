import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { TokenService } from 'src/token/token.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginResponseType } from './types/login-response.type';
import { JwtPayloadType } from './types/jwt-payload.type';
import { TokenType } from 'src/token/token-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const user = await this.userService.findOne({ email: registerDto.email });
    if (user)
      throw new BadRequestException('User already exists with the given email');
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

    const { token, refreshToken, tokenExpires } =
      await this.tokenService.generateAuthTokens(user);

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  async logout(data: Pick<JwtPayloadType, 'id'>) {
    await this.tokenService.delete({
      type: TokenType.REFRESH,
      user: { id: data.id },
    });
  }

  async refreshTokens(_refreshToken: string) {
    const { token, refreshToken, tokenExpires, user } =
      await this.tokenService.refreshTokens(_refreshToken);

    return {
      token,
      user,
      refreshToken,
      tokenExpires,
    };
  }

  async me(id: number): Promise<User> {
    return this.userService.findOne({
      id,
    });
  }

  async delete(id: number) {
    await this.userService.remove(id);
  }
}
