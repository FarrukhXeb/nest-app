import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { QuestionsService } from './questions.service';
import { PollWithIdInterceptor } from '../interceptors/poll-with-id.interceptor';
import { UpdateQuestionDto } from '../dtos/update-question.dto';

@Controller('polls/:id/questions')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(PollWithIdInterceptor)
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}
  @Post()
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.questionService.create(id, dto);
  }

  @Patch(':questionId')
  update(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionService.update(questionId, dto);
  }
}
