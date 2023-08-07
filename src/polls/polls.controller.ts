import {
  Body,
  Controller,
  Get,
  NotFoundException,
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
import { PollGuard } from './polls.guard';

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

  @Get()
  getPolls(@RequestWithUser() user: Pick<User, 'id'>) {
    return this.pollsService.find(user.id);
  }

  @Get(':id')
  @UseGuards(PollGuard)
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @RequestWithUser() user: Pick<User, 'id'>,
  ) {
    const poll = await this.pollsService.findOne({ id }, user.id);
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }
    return poll;
  }

  @Post(':id/responses')
  @UseGuards(PollGuard)
  async submitResponse(
    @Param('id', ParseIntPipe) id: number,
    @RequestWithUser() user: Pick<User, 'id'>,
    @Body() responses: CreateResponsesDto[],
  ) {
    return this.responsesService.submitResponse(responses, user.id, id);
  }

  @Get(':id/responses')
  @UseGuards(PollGuard)
  async getPollResponses(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.findAllWithResponses(id);
  }
}
