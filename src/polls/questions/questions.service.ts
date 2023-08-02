import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateQuestionDto } from '../dtos/update-question.dto';

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
  findOne(where: FindOptionsWhere<Question>) {
    return this.questionRepository.findOne({ where });
  }
  async update(id: number, dto: UpdateQuestionDto) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question)
      throw new NotFoundException(`Question with id ${id} not found`);

    await this.questionRepository.update({ id }, dto);

    return this.questionRepository.findOne({ where: { id } });
  }
}
