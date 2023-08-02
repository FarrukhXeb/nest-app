import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}
  create(id: number, dto: CreateQuestionDto) {
    return this.questionRepository.save(
      this.questionRepository.create({ ...dto, poll: { id } }),
    );
  }
}
