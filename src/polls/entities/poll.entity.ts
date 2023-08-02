import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  startDate?: string;

  @Column({ type: 'timestamp' })
  endDate: string;

  @ManyToMany(() => User, (user) => user.polls, { cascade: true })
  participants: User[];

  @ManyToOne(() => User, (user) => user.createdPolls, {
    cascade: true,
  })
  user: User;

  @OneToMany(() => Question, (question) => question.poll, {
    cascade: true,
  })
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
