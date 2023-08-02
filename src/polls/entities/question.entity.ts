import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Poll } from './poll.entity';
import { Option } from './option.entity';
import { QuestionTypes } from '../questions/question-types.enum';
import { Response } from './response.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => Poll, (poll) => poll.questions)
  poll: Poll;

  @OneToMany(() => Option, (option) => option.question, { eager: true })
  options: Option[];

  @OneToMany(() => Response, (response) => response.question)
  responses: Response[];

  @Column({
    type: 'enum',
    enum: QuestionTypes,
    default: QuestionTypes.TEXT,
  })
  type: QuestionTypes;
}
