import request from 'supertest';
import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createMiniApp } from './utils/createMiniApp';

describe('Auth user (e2e)', () => {
  let app: INestApplication;
  const newUserFirstName = faker.person.firstName();
  const newUserLastName = faker.person.lastName();
  const newUserEmail = faker.internet.email();
  const newUserPassword = faker.internet.password({ length: 10 });
  let apiToken: string;

  beforeAll(async () => {
    app = await createMiniApp();
    await app.init();
  });

  it('Register new user: /auth/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: newUserEmail,
        password: newUserPassword,
        firstName: newUserFirstName,
        lastName: newUserLastName,
      })
      .expect(HttpStatus.NO_CONTENT);
  });

  it('Empty password should throw bad request: /auth/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: newUserEmail,
        firstName: newUserFirstName,
        lastName: newUserLastName,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('Password length less then 8 chars throw bad request: /auth/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: newUserEmail,
        firstName: newUserFirstName,
        lastName: newUserLastName,
        password: faker.internet.password({ length: 4 }),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('Login: /auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: newUserEmail, password: newUserPassword })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.refreshToken).toBeDefined();
        expect(body.tokenExpires).toBeDefined();
        expect(body.user.email).toBeDefined();
        apiToken = body.token;
      });
  });

  it('Login should not work without email or password: /auth/login (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: '', password: newUserPassword })
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: newUserEmail, password: '' })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('Delete user: /auth/me (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete('/auth/me')
      .auth(apiToken, {
        type: 'bearer',
      })
      .expect(HttpStatus.NO_CONTENT);
  });
});
