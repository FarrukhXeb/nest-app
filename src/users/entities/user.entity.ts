import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Token } from 'src/token/entities/token.entity';
import { Todo } from 'src/todo/entities/todo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true })
  email: string;

  @Column({ type: String })
  password: string;

  @Column({ type: String })
  firstName: string;

  @Column({ type: String, nullable: true })
  lastName: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Token, (Token) => Token.user)
  tokens: Token[];

  @OneToMany(() => Todo, (Todo) => Todo.user)
  todos: Todo[];

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
