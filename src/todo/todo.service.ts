import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}

  create(createTodoDto: CreateTodoDto, userId: User['id']): Promise<Todo> {
    return this.todoRepository.save(
      this.todoRepository.create({ ...createTodoDto, user: { id: userId } }),
    );
  }

  findAll(userId: User['id']): Promise<Todo[]> {
    return this.todoRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: User['id']): Promise<Todo> {
    const todo: Todo = await this.todoRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userId: User['id']) {
    await this.findOne(id, userId);
    return this.todoRepository.update(
      { id, user: { id: userId } },
      updateTodoDto,
    );
  }

  async remove(id: number, userId: User['id']) {
    await this.findOne(id, userId);
    return this.todoRepository.delete({ id, user: { id: userId } });
  }
}
