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
import { Response } from './response.entity';

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

  @ManyToMany(() => User, (user) => user.polls)
  participants: User[];

  @ManyToOne(() => User, (user) => user.createdPolls, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Question, (question) => question.poll)
  questions: Question[];

  @OneToMany(() => Response, (response) => response.poll)
  responses: Response[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
