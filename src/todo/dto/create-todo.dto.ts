import { TodoStatus } from '../types';

export class CreateTodoDto {
  title: string;
  description: string;
  status: TodoStatus;
}
