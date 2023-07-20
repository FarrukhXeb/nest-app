import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { TodoStatus } from '../types';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  status: TodoStatus = TodoStatus.IN_COMPLETE;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;
}
