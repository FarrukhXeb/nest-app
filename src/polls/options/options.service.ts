import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from '../dtos/create-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from '../entities/option.entity';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    private readonly questionService: QuestionsService,
  ) {}

  async create(questionId: number, dto: CreateOptionDto) {
    const question = await this.questionService.findOne({ id: questionId });
    if (!question)
      throw new NotFoundException(`Question with id ${questionId} not found`);
    return this.optionRepository.save(
      this.optionRepository.create({
        ...dto,
        question: {
          id: questionId,
        },
      }),
    );
  }
}
