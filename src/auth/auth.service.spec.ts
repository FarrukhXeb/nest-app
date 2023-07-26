import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { TokenService } from 'src/token/token.service';
import { FindOptionsWhere } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let user;

  const loginResponse = {
    token: 'some-access-token',
    refreshToken: 'some-refresh-token',
    expiresIn: 123123829108,
    user,
  };

  const mockUserService = {
    create: jest.fn(),
    findOne: jest.fn((options: FindOptionsWhere<User>) => user),
  };

  const mockTokenService = {
    generateAuthTokens: jest.fn(() => loginResponse),
    delete: jest.fn(),
    refreshTokens: jest.fn((refreshToken: string) => loginResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();
    const password = await bcrypt.hash('testing1234', 10);
    user = {
      id: 1,
      email: 'test@example.com',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password,
    };
    service = module.get<AuthService>(AuthService);
  });

  it('should give an error with invalid password', () => {
    const dto: LoginDto = {
      email: 'test@example.com',
      password: 'asdasd',
    };

    expect(async () => {
      await service.login(dto);
    }).rejects.toThrow(BadRequestException);

    expect(async () => {
      await service.login(dto);
    }).rejects.toThrow('Invalid password');
  });

  it('should generate token when logging in', async () => {
    const dto: LoginDto = {
      email: 'test@example.com',
      password: 'testing1234',
    };
    const response = await service.login(dto);
    expect(response.token).toBeDefined();
  });

  it('should not register an already created user', async () => {
    const spyOnRegister = jest.spyOn(service, 'register');
    const dto: RegisterDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
    expect(async () => {
      await service.register(dto);
    }).rejects.toThrow(BadRequestException);
    expect(spyOnRegister).toHaveBeenCalled();
  });

  it('should logout a user', async () => {
    const spyOnLogout = jest.spyOn(service, 'logout');
    await service.logout(user);
    expect(spyOnLogout).toHaveBeenCalled();
    expect(spyOnLogout).toBeCalledWith(user);
  });
});
