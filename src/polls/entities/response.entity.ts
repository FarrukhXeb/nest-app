import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { Option } from './option.entity';
import { Poll } from './poll.entity';

// Not to be confused with the Network Response object
// This is the Response entity that is stored in the database associated with a poll and a user
@Entity()
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.polls, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Question, (user) => user.responses)
  question: Question;

  @ManyToOne(() => Option, (option) => option.responses)
  option: Option;

  @ManyToOne(() => Poll, (user) => user.responses)
  poll: Option;
}
