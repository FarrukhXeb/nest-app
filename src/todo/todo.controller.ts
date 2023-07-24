import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/auth/decorators/user-request.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('todo')
@UseGuards(AuthGuard('jwt'))
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(
    @Body() createTodoDto: CreateTodoDto,
    @RequestWithUser() user: Pick<User, 'id'>,
  ) {
    return this.todoService.create(createTodoDto, user.id);
  }

  @Get()
  findAll(@RequestWithUser() user: Pick<User, 'id'>) {
    return this.todoService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @RequestWithUser() user: Pick<User, 'id'>,
  ) {
    return this.todoService.findOne(id, user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @RequestWithUser() user: Pick<User, 'id'>,
  ) {
    return this.todoService.update(id, updateTodoDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @RequestWithUser() user: Pick<User, 'id'>,
  ) {
    return this.todoService.remove(id, user.id);
  }
}
