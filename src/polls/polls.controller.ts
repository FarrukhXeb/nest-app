import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePollDto } from './dtos/create-poll.dto';
import { PollsService } from './polls.service';
import { RequestWithUser } from 'src/auth/decorators/user-request.decorator';
import { User } from 'src/users/entities/user.entity';
import { ResponsesService } from './responses/responses.service';
import { CreateResponsesDto } from './dtos/create-responses.dto';

@Controller('polls')
@UseGuards(AuthGuard('jwt'))
export class PollsController {
  constructor(
    private readonly pollsService: PollsService,
    private readonly responsesService: ResponsesService,
  ) {}
  @Post()
  create(
    @Body() createPollDto: CreatePollDto,
    @RequestWithUser() user: Pick<User, 'id'>,
  ) {
    return this.pollsService.create(createPollDto, user.id);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.findOne({ id });
  }

  @Post(':id/responses')
  async submitResponse(
    @Param('id', ParseIntPipe) id: number,
    @RequestWithUser() user: Pick<User, 'id'>,
    @Body() responses: CreateResponsesDto[],
  ) {
    return this.responsesService.submitResponse(responses, user.id, id);
  }

  @Get(':id/responses')
  async getPollResponses(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.findAllWithResponses(id);
  }
}
