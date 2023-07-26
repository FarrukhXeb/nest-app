import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/roles/entities/role.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from './roles.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesSeedService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private userService: UsersService,
    private configService: ConfigService,
  ) {}

  async run(): Promise<void> {
    const roles = Object.keys(RoleEnum).filter((key) =>
      isNaN(Number(key.toLowerCase())),
    ) as Array<keyof typeof RoleEnum>;
    const [, count] = await this.roleRepository.findAndCount();
    if (!count) {
      const promises = [];
      for (const role of roles) {
        promises.push(
          this.roleRepository.save(this.roleRepository.create({ name: role })),
        );
      }
      await Promise.all(promises);
    }

    // There should be atleast one admin user
    const users = await this.userService.findAll();
    const adminCount = users.filter(
      (user) => user.role.name === 'admin',
    ).length;
    if (!adminCount) {
      this.userService.create({
        email: this.configService.get('ADMIN_EMAIL'),
        firstName: 'admin',
        lastName: 'admin',
        password: this.configService.get('ADMIN_PASSWORD'),
        role: RoleEnum.ADMIN,
      });
    }
  }
}
