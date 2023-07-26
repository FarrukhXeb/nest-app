import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { createMiniApp } from './utils/createMiniApp';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { CreateTodoDto } from 'src/todo/dto/create-todo.dto';
import { TodoStatus } from 'src/todo/todo-status.enum';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Todo } from 'src/todo/entities/todo.entity';

describe('Todo (e2e)', () => {
  let app: INestApplication;
  let apiToken: string;
  let user: User;
  let createdTodo: Todo;

  const todoDto: CreateTodoDto = {
    title: faker.lorem.lines(1),
    description: faker.lorem.lines(3),
    dueDate: faker.date.future().toISOString(),
    status: TodoStatus.IN_COMPLETE,
  };

  beforeAll(async () => {
    app = await createMiniApp();
    await app.init();
    const userDto: RegisterDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
    };
    // Create a dummy user
    const authService = app.get(AuthService);
    await authService.register(userDto);
    const { token, user: _user } = await authService.login({
      email: userDto.email,
      password: userDto.password,
    });
    user = _user;
    apiToken = token;
  });

  it("Unauthenticated users can't perform CRUD operations on Todo endpoints", async () => {
    await request(app.getHttpServer())
      .post('/todo')
      .send(todoDto)
      .expect(HttpStatus.UNAUTHORIZED);
    await request(app.getHttpServer())
      .get('/todo')
      .expect(HttpStatus.UNAUTHORIZED);
    await request(app.getHttpServer())
      .patch('/todo/1')
      .expect(HttpStatus.UNAUTHORIZED);
    await request(app.getHttpServer())
      .delete('/todo/1')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('Create Todo: /todo (POST)', async () => {
    return request(app.getHttpServer())
      .post('/todo')
      .auth(apiToken, {
        type: 'bearer',
      })
      .send(todoDto)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        createdTodo = body as Todo;
      });
  });

  it('Creating a todo with improper fields should give bad request: /todo (POST)', async () => {
    // If title is missing
    await request(app.getHttpServer())
      .post('/todo')
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({
        description: faker.lorem.lines(3),
        dueDate: faker.date.future().toISOString(),
      })
      .expect(HttpStatus.BAD_REQUEST);

    // If description is missing
    await request(app.getHttpServer())
      .post('/todo')
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({
        title: faker.lorem.lines(1),
        dueDate: faker.date.future().toISOString(),
      })
      .expect(HttpStatus.BAD_REQUEST);

    // If due date is missing
    await request(app.getHttpServer())
      .post('/todo')
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({
        title: faker.lorem.lines(1),
        description: faker.lorem.lines(3),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('Getting the newly created todo: /todo (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/todo/${createdTodo.id}`)
      .auth(apiToken, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        const todo = body as Todo;
        expect(todo).toBeDefined();
      });
  });

  it('Getting the newly created todo must belong to the user who created the todo: /todo (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/todo/${createdTodo.id}`)
      .auth(apiToken, { type: 'bearer' })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        const todo = body as Todo;
        expect(todo).toBeDefined();
        expect(todo.user.id).toBe(user.id);
      });
  });

  it('Updating a todo: /todo/{id} (PATCH)', async () => {
    const updatedTitle = 'Updated title';
    await request(app.getHttpServer())
      .patch(`/todo/${createdTodo.id}`)
      .auth(apiToken, { type: 'bearer' })
      .send({
        title: updatedTitle,
        status: TodoStatus.IN_PROGRESS,
      })
      .expect(HttpStatus.NO_CONTENT);

    return request(app.getHttpServer())
      .get(`/todo/${createdTodo.id}`)
      .auth(apiToken, { type: 'bearer' })
      .expect(({ body }) => {
        const todo = body as Todo;
        expect(todo).toBeDefined();
        expect(todo.title).toBe(updatedTitle);
        expect(todo.status).toBe(TodoStatus.IN_PROGRESS);
      });
  });

  it('Updating a todo with improper dueDate format will cause an error: /todo/{id} (PATCH)', () => {
    const dueDate = 'improper-date';
    return request(app.getHttpServer())
      .patch(`/todo/${createdTodo.id}`)
      .auth(apiToken, { type: 'bearer' })
      .send({
        dueDate,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('Deleting a todo: /todo/{id} (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/todo/${createdTodo.id}`)
      .auth(apiToken, { type: 'bearer' })
      .expect(HttpStatus.NO_CONTENT);

    return request(app.getHttpServer())
      .get(`/todo/${createdTodo.id}`)
      .auth(apiToken, { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    // Deleting the user and it's associated todos
    const userService = app.get(UsersService);
    await userService.remove(user.id);
  });
});
