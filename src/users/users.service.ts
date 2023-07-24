import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RoleEnum } from 'src/roles/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(
      this.userRepository.create({
        ...createUserDto,
        role: { id: RoleEnum.USER },
      }),
    );
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(fields: FindOptionsWhere<User>) {
    return this.userRepository.findOne({ where: fields });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
