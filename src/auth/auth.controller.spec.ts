import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const user = {
    id: 1,
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };

  const loginResponse = {
    token: 'some-access-token',
    refreshToken: 'some-refresh-token',
    expiresIn: 123123829108,
    user,
  };

  const mockAuthService = {
    login: jest.fn((dto) => loginResponse),
    register: jest.fn(),
    logout: jest.fn(),
    refreshTokens: jest.fn((refreshToken: string) => ({
      ...loginResponse,
      token: 'some-new-access-token',
      refreshToken: 'some-new-refresh-token',
    })),
    me: jest.fn((userId) => user),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register a user', async () => {
    const dto: CreateUserDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
    const spyOnRegister = jest.spyOn(controller, 'register');
    await controller.register(dto);
    expect(spyOnRegister).toHaveBeenCalled();
    expect(spyOnRegister).toHaveBeenLastCalledWith(dto);
  });

  it('should login a user and generate an accessToken and refreshToken in response', async () => {
    const dto: LoginDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const spyOnLogin = jest.spyOn(controller, 'login');
    const response = await controller.login(dto); // TODO fix type error
    expect(response.token).toBeDefined();
    expect(response.refreshToken).toBeDefined();
    expect(spyOnLogin).toHaveBeenCalled();
  });

  it('should refresh the token', async () => {
    const spyOnRefreshToken = jest.spyOn(controller, 'refreshTokens');
    const dto: RefreshTokenDto = {
      refresh_token: loginResponse.refreshToken,
    };
    const { refreshToken, token } = await controller.refreshTokens(dto);

    expect(refreshToken).toBeDefined();
    expect(token).toBeDefined();
    expect(refreshToken).not.toBe(loginResponse.refreshToken);
    expect(spyOnRefreshToken).toHaveBeenCalled();
    expect(spyOnRefreshToken).toBeCalledWith(dto);
  });

  it('should get user information', async () => {
    const retrievedUser = await controller.me(user);
    expect(retrievedUser).toBeDefined();
  });
});
