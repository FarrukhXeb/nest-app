import { Module } from '@nestjs/common';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from '../entities/option.entity';
import { Question } from '../entities/question.entity';
import { QuestionsService } from '../questions/questions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Option, Question])],
  controllers: [OptionsController],
  providers: [OptionsService, QuestionsService],
})
export class OptionsModule {}
