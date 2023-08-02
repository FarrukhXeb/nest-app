import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from '../dtos/create-option.dto';

@Controller('polls/:id/questions/:questionId/options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  create(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: CreateOptionDto,
  ) {
    return this.optionsService.create(questionId, dto);
  }
}
