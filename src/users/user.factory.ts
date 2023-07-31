import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { User } from './entities/user.entity';

export class UserFactory {
  static createMany(quantity: number): User[] {
    const dummyUsers: User[] = [];
    const password = bcrypt.hashSync('testing1234', 10);
    for (let i = 0; i < quantity; i++) {
      dummyUsers.push({
        id: i + 1,
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.firstName(),
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: {
          id: 2,
          name: 'user',
        },
      });
    }

    return dummyUsers;
  }
}
