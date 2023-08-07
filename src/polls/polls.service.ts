import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePollDto } from './dtos/create-poll.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UpdatePollDto } from './dtos/update-poll.dto';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll) private readonly pollRepository: Repository<Poll>,
    private readonly userService: UsersService,
  ) {}

  async create(dto: CreatePollDto, userId: number) {
    // Finding all the users which are going to be participating in the poll
    const participants = await this.getParticipants(dto);

    return this.pollRepository.save(
      this.pollRepository.create({
        ...dto,
        participants,
        user: { id: userId },
      }),
    );
  }

  async update(id: number, dto: UpdatePollDto) {
    const participants = await this.getParticipants(dto);
    return this.pollRepository.update({ id }, { ...dto, participants });
  }

  async find(userId: number, fields: FindOptionsWhere<Poll> = {}) {
    return this.pollRepository.find({
      where: { ...fields, user: { id: userId } },
      select: {
        id: true,
        title: true,
        description: true,
        user: {
          id: true,
          email: true,
        },
        participants: {
          id: true,
          email: true,
        },
      },
      relations: ['questions', 'participants'],
    });
  }

  async findOne(where: FindOptionsWhere<Poll>) {
    return this.pollRepository.findOne({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        user: {
          id: true,
          email: true,
        },
        participants: {
          id: true,
          email: true,
        },
      },
      relations: ['questions', 'participants'],
    });
  }

  private async getParticipants(dto: CreatePollDto | UpdatePollDto) {
    const participants = await this.userService.find({
      id: In(dto.participants),
    });
    if (participants.length !== dto.participants.length) {
      const participantsIds = participants.map((participant) => participant.id);
      const notFound = dto.participants.filter(
        (participant) => !participantsIds.includes(participant),
      );
      throw new BadRequestException(
        `Users with ids ${notFound.join(', ')} not found`,
      );
    }
    return participants;
  }

  findAllWithResponses(id: number) {
    return this.pollRepository.findOne({
      where: { id },
      relations: ['responses', 'responses.option', 'responses.question'],
    });
  }

  checkIsParticipantOrOwner(pollId: number, userId: number) {
    return this.pollRepository
      .createQueryBuilder('poll')
      .leftJoin('poll.participants', 'participants')
      .where('poll.id = :pollId', { pollId })
      .andWhere('poll.userId = :userId', { userId })
      .orWhere('participants.id = :userId', { userId })
      .getOne();
  }
}
