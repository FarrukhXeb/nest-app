import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TodoStatus } from '../todo-status.enum';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  title: string;

  @Column({ type: String })
  description: string;

  @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.IN_COMPLETE })
  status: TodoStatus;

  @ManyToOne(() => User, (User) => User.todos, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'date' })
  dueDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
