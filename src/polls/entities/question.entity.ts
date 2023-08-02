import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Poll } from './poll.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => Poll, (poll) => poll.questions)
  poll: Poll;
}
