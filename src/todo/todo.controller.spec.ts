import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { faker } from '@faker-js/faker';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoStatus } from './todo-status.enum';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoController', () => {
  let controller: TodoController;

  const todos = [
    {
      id: 1,
      title: faker.lorem.lines(1),
      description: faker.lorem.lines(3),
      dueDate: faker.date.future().toISOString(),
      status: TodoStatus.IN_COMPLETE,
      user: { id: 1 },
    },
    {
      id: 2,
      title: faker.lorem.lines(1),
      description: faker.lorem.lines(3),
      dueDate: faker.date.future().toISOString(),
      status: TodoStatus.COMPLETED,
      user: { id: 1 },
    },
    {
      id: 3,
      title: faker.lorem.lines(1),
      description: faker.lorem.lines(3),
      dueDate: faker.date.future().toISOString(),
      status: TodoStatus.COMPLETED,
      user: { id: 2 },
    },
  ];

  const mockTodoService = {
    create: jest.fn((dto, userId) => {
      return {
        id: 1,
        user: { id: userId },
        ...dto,
      };
    }),
    findAll: jest.fn((userId) =>
      todos.filter((todo) => todo.user.id == userId),
    ),
    find: jest.fn((id, userId) =>
      todos.find((todo) => todo.id === id && todo.user.id === userId),
    ),
    update: jest.fn((id, dto) => ({
      id,
      ...dto,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [TodoService],
    })
      .overrideProvider(TodoService)
      .useValue(mockTodoService)
      .compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should create a todo', () => {
    const dto: CreateTodoDto = {
      title: faker.lorem.lines(1),
      description: faker.lorem.lines(3),
      dueDate: faker.date.future().toISOString(),
      status: TodoStatus.IN_COMPLETE,
    };
    const user = { id: 1 };
    expect(controller.create(dto, user)).toEqual({
      id: expect.any(Number),
      user,
      ...dto,
    });
    expect(mockTodoService.create).toHaveBeenCalled();
  });

  it('should fetch all the todos', async () => {
    const user = { id: 1 };
    const spyFindAll = jest.spyOn(controller, 'findAll');
    const todos = await controller.findAll(user);
    expect(spyFindAll).toHaveBeenCalled();
    expect(todos).toBeDefined();
  });

  it('should fetch todos of a particular user', async () => {
    const user = { id: 1 };
    const spyFindAll = jest.spyOn(controller, 'findAll');
    const todos = await controller.findAll(user);
    expect(spyFindAll).toHaveBeenCalled();
    expect(todos).toBeDefined();
    expect(todos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: { id: 1 },
        }),
      ]),
    );
  });

  it('should update a todo', () => {
    const dto: UpdateTodoDto = {
      status: TodoStatus.COMPLETED,
    };
    const user = { id: 1 };
    expect(controller.update(1, dto, user)).toEqual({
      id: 1,
      ...dto,
    });
    expect(mockTodoService.update).toHaveBeenCalled();
  });
});
