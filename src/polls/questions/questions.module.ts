import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { Poll } from '../entities/poll.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Question])],
  providers: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
