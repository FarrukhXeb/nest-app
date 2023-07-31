import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/roles/entities/role.entity';
import { UserFactory } from './user.factory';

describe('UsersService', () => {
  let service: UsersService;
  const users: User[] = UserFactory.createMany(10);
  const userRole = {
    id: 2,
    name: 'user',
  };
  const mockUserRepository = {
    find: jest.fn(() => users),
    findOne: jest.fn(({ where: { id } }) => {
      return users.find((user) => user.id === id);
    }),
    save: jest.fn((user) => {
      users.push(user);
      return users[users.length - 1];
    }),
    create: jest.fn((dto: CreateUserDto) => {
      return {
        ...dto,
        id: users.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: userRole,
      };
    }),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockRoleRepository = {
    findOne: jest.fn(() => userRole),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const spyOnCreate = jest.spyOn(service, 'create');
    const user: CreateUserDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
    const response = await service.create(user);
    expect(spyOnCreate).toHaveBeenCalled();
    expect(response.email).toBe(user.email);
  });

  it('should find all users', async () => {
    const response = await service.findAll();
    expect(response).toBeDefined();
  });

  it('should find a user', async () => {
    const response = await service.findOne({ id: 1 });
    expect(response).toBeDefined();
    expect(response.id).toBe(1);
  });
});
