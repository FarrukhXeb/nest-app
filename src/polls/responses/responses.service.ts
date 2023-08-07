import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Response } from '../entities/response.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateResponsesDto } from '../dtos/create-responses.dto';
import { Poll } from '../entities/poll.entity';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectRepository(Response)
    private readonly responsesRepository: Repository<Response>,
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
  ) {}

  async submitResponse(
    responses: CreateResponsesDto[],
    userId: number, // The user Id Who submitted the poll response
    pollId: number,
  ) {
    const pollExists = await this.pollRepository.findOne({
      where: { id: pollId },
      relations: ['questions'],
    });
    if (!pollExists)
      throw new NotFoundException(`Poll with id ${pollId} not found`);

    // Validating that the question provided in the request belong to the poll
    const questionIds = pollExists.questions.map((question) => question.id);
    const questionOptionNotMatched = responses.some(
      (response) => !questionIds.includes(response.questionId),
    );
    if (questionOptionNotMatched)
      throw new NotFoundException(
        `The provided question does not belong to the poll`,
      );

    // Validating that the response has already been submitted by the user for a specific question in the poll
    const responseExists = await this.responsesRepository.findOne({
      where: {
        user: { id: userId },
        question: { id: In(responses.map((response) => response.questionId)) },
      },
    });
    if (responseExists)
      throw new BadRequestException(
        `Response has already been submitted for the question`,
      );

    // Validating that the option ids provided in the request belong to the question
    const optionsIds = pollExists.questions
      .map((question) => question.options.map((option) => option.id))
      .reduce((a, b) => [...a, ...b]);
    const optionNotMatched = responses.some(
      (response) => !optionsIds.includes(response.optionId),
    );
    if (optionNotMatched)
      throw new NotFoundException(
        `The provided option does not belong to the question`,
      );

    const poll = this.responsesRepository.create(
      responses.map((response) => ({
        poll: { id: pollId },
        user: {
          id: userId,
        },
        question: {
          id: response.questionId,
        },
        option: {
          id: response.optionId,
        },
      })),
    );
    return this.responsesRepository.save(poll);
  }
}
