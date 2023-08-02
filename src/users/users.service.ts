import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRespository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.roleRespository.findOne({
      where: { id: createUserDto.role || 2 },
    });
    return this.userRepository.save(
      this.userRepository.create({
        ...createUserDto,
        role,
      }),
    );
  }

  findAll() {
    return this.userRepository.find();
  }

  find(fields: FindOptionsWhere<User>) {
    return this.userRepository.find({ where: fields });
  }

  findOne(fields: FindOptionsWhere<User>) {
    return this.userRepository.findOne({ where: fields });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const role = await this.roleRespository.findOne({
      where: { id: updateUserDto.role || 1 },
    });
    return this.userRepository.update({ id }, { ...updateUserDto, role });
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
