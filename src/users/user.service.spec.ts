import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserRepository = {
    find: jest.fn(() => []),
    findOne: jest.fn(() => ({ id: 1 })),
    save: jest.fn((dto) => dto),
    create: jest.fn((dto) => dto),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
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
    expect(response.email).toBe(user.email);
    expect(spyOnCreate).toHaveBeenCalled();
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
