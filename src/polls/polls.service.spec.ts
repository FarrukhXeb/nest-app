import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PollsService } from './polls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { CreatePollDto } from './dtos/create-poll.dto';
import { UsersService } from 'src/users/users.service';

describe('PollsService', () => {
  let service: PollsService;

  const newPoll: CreatePollDto = {
    title: 'my first poll',
    description: 'some description',
    startDate: faker.date.recent().toDateString(),
    endDate: faker.date.future().toDateString(),
    participants: [12, 2],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockReturnValue({ id: 1 }),
            find: jest.fn().mockReturnValue([{ id: 12 }, { id: 2 }]),
          },
        },
        {
          provide: getRepositoryToken(Poll),
          useValue: {
            save: jest.fn().mockResolvedValue(
              Promise.resolve({
                ...newPoll,
                id: 123,
                participants: [{ id: 12 }, { id: 43 }, { id: 2 }],
                user: { id: 1 },
              }),
            ),
            create: jest.fn().mockReturnValue(newPoll),
            findOne: jest
              .fn()
              .mockImplementation(({ where: { id: pollId } }) => {
                if (pollId === 2) return null;
                return {
                  id: 12,
                  text: 'test poll',
                  questions: [
                    {
                      id: 1,
                      text: 'test question',
                    },
                    {
                      id: 2,
                      text: 'test question',
                    },
                  ],
                };
              }),
            find: jest.fn().mockReturnValue([
              {
                id: 12,
                text: 'test poll',
                questions: [
                  {
                    id: 1,
                    text: 'test question',
                  },
                  {
                    id: 2,
                    text: 'test question',
                  },
                ],
                responses: [
                  {
                    id: 1,
                    text: 'test response',
                    question: {
                      id: 1,
                      text: 'test question',
                    },
                  },
                  {
                    id: 2,
                    text: 'test response',
                    question: {
                      id: 2,
                      text: 'test question',
                    },
                  },
                ],
                user: {
                  id: 1,
                },
              },
            ]),
            createQueryBuilder: () => {
              return {
                leftJoin: () => {
                  return {
                    where: () => ({
                      andWhere: () => ({
                        orWhere: () => ({
                          getOne: jest.fn().mockReturnValue(null),
                        }),
                      }),
                    }),
                  };
                },
              };
            },
          },
        },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);
  });

  it('should not add participants who are not registered', () => {
    expect(
      async () =>
        await service.create({ ...newPoll, participants: [12, 43, 2] }, 1),
    ).rejects.toThrowError();
  });

  it('should create a poll', async () => {
    const response = await service.create(newPoll, 1);
    expect(response).toBeDefined();
  });

  it('should get a poll with questions', async () => {
    const response = await service.findOne({}, 1);
    expect(response).toBeDefined();
    expect(response.questions).toBeDefined();
  });

  it('should get all the polls with responses', async () => {
    const response = await service.findAllWithResponses(1);
    expect(response).toBeDefined();
  });

  it('should return null if user is not the owner', async () => {
    const response = await service.findOne({ id: 2 }, 2);
    expect(response).toBeNull();
  });

  it('should return null if user is not a participant', async () => {
    const response = await service.checkIsParticipantOrOwner(1, 1);
    expect(response).toBeNull();
  });
});
