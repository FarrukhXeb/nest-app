import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { createMiniApp } from './utils/createMiniApp';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

describe('Polls (e2e)', () => {
  let app: INestApplication;
  let cookies = [];
  let user: User;
  beforeAll(async () => {
    app = await createMiniApp();
    await app.init();
    const userService = app.get<UsersService>(UsersService);
    // Create user for testing
    user = await userService.create({
      email: 'test@example.com',
      password: 'testing1234',
      firstName: 'Test',
      lastName: 'User',
    });
    // Login user and get cookies for next requests
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'testing1234',
      });
    cookies = response.header['set-cookie'];
  });

  afterAll(async () => {
    // Remove user after testing
    const userService = app.get<UsersService>(UsersService);
    await userService.remove(user.id);
    await app.close();
  });

  it('Create new poll: /polls (POST)', async () => {
    return request(app.getHttpServer())
      .post('/polls')
      .set('Cookie', cookies)
      .send({
        title: 'Test poll',
        description: 'Test poll description',
        startDate: '2023-08-02T04:48:20.561Z',
        endDate: '2023-10-07T19:00:00.000Z',
        participants: [],
      })
      .expect(HttpStatus.CREATED);
  });
});
