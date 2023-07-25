import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoStatus } from './todo-status.enum';
import { CreateTodoDto } from './dto/create-todo.dto';

describe('TodoService', () => {
  let service: TodoService;
  const mockUserRepository = {
    create: jest.fn((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((dto, userId) =>
        Promise.resolve({ id: 1, user: { id: userId }, ...dto }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockUserRepository, // mock repository for testing purposes only
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a todo', async () => {
    const dto: CreateTodoDto = {
      title: faker.lorem.lines(1),
      description: faker.lorem.lines(3),
      dueDate: faker.date.future().toISOString(),
      status: TodoStatus.IN_COMPLETE,
    };
    const user = { id: 1 };
    const response = await service.create(dto, user.id);
    expect(response).toEqual({
      id: expect.any(Number),
      user,
      ...dto,
    });
    expect(mockUserRepository.create).toHaveBeenCalled();
  });
});
