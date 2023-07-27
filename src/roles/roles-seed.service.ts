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
    const countUser = await this.roleRepository.count({
      where: {
        id: RoleEnum.USER,
      },
    });

    if (!countUser) {
      await this.roleRepository.save(
        this.roleRepository.create({
          id: RoleEnum.USER,
          name: 'user',
        }),
      );
    }

    const countAdmin = await this.roleRepository.count({
      where: {
        id: RoleEnum.ADMIN,
      },
    });

    if (!countAdmin) {
      await this.roleRepository.save(
        this.roleRepository.create({
          id: RoleEnum.ADMIN,
          name: 'admin',
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
