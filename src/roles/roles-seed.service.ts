import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from './roles.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesSeedService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async run(): Promise<void> {
    const countAdmin = await this.roleRepository.count({
      where: {
        name: 'admin',
      },
    });
    if (!countAdmin) {
      await this.roleRepository.save(
        this.roleRepository.create({
          name: 'admin',
        }),
      );
    }

    const countUser = await this.roleRepository.count({
      where: {
        name: 'user',
      },
    });
    if (!countUser) {
      await this.roleRepository.save(
        this.roleRepository.create({
          name: 'user',
        }),
      );
    }

    // There should be atleast one admin user
    const adminUser = await this.userRepository.count({
      where: {
        role: {
          id: RoleEnum.ADMIN,
        },
      },
    });

    if (!adminUser) {
      await this.userRepository.save(
        this.userRepository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@example.com',
          password: 'testing1234',
          role: {
            id: RoleEnum.ADMIN,
            name: 'admin',
          },
        }),
      );
    }
  }
}
