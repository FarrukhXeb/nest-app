import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { UserFactory } from './user.factory';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  const users: User[] = UserFactory.createMany(10);

  const mockUserService = {
    findOne: jest.fn(({ id }) => users.find((user) => user.id === id)),
    create: jest.fn((dto) => {
      users.push(dto);
      return users[users.length - 1];
    }),
    findAll: jest.fn(() => users),
    update: jest.fn((dto) => dto),
    remove: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should find all users', async () => {
    const spyOnFindAllUsers = jest.spyOn(controller, 'findAll');
    const users = await controller.findAll();
    expect(spyOnFindAllUsers).toHaveBeenCalled();
    expect(users).toBeDefined();
  });

  it('should find one user', async () => {
    const spyOnFindOneUser = jest.spyOn(controller, 'findOne');
    const user = await controller.findOne(1);
    expect(spyOnFindOneUser).toHaveBeenCalled();
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
  });

  it('should create a user', async () => {
    const spyOnCreateUser = jest.spyOn(controller, 'create');
    const dto: CreateUserDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
    const createdUser = await controller.create(dto);
    expect(spyOnCreateUser).toHaveBeenCalled();
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(dto.email);
  });

  it('should update a user', async () => {
    const spyOnUpdateUser = jest.spyOn(controller, 'update');
    const dto: UpdateUserDto = {
      email: faker.internet.email(),
    };
    const updatedUser = await controller.update(1, dto);
    expect(spyOnUpdateUser).toHaveBeenCalled();
    expect(updatedUser).toBeDefined();
  });

  it('should delete a user', async () => {
    const spyOnDeleteUser = jest.spyOn(controller, 'remove');
    await controller.remove('1');
    expect(spyOnDeleteUser).toHaveBeenCalled();
    expect(spyOnDeleteUser).toHaveBeenCalledWith('1');
  });
});
