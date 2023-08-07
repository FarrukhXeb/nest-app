import { Test, TestingModule } from '@nestjs/testing';
import { ResponsesService } from './responses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Response } from '../entities/response.entity';
import { CreateResponsesDto } from '../dtos/create-responses.dto';
import { Poll } from '../entities/poll.entity';

describe('ResponsesService', () => {
  let service: ResponsesService;
  const payload: CreateResponsesDto[] = [
    {
      questionId: 1,
      optionId: 1,
    },
    {
      questionId: 2,
      optionId: 2,
    },
    {
      questionId: 2,
      optionId: 1,
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponsesService,
        {
          provide: getRepositoryToken(Response),
          useValue: {
            create: jest.fn().mockResolvedValue([
              {
                poll: { id: 1 },
                user: { id: 1 },
                question: { id: 1 },
                option: { id: 2 },
              },
              {
                poll: { id: 1 },
                user: { id: 1 },
                question: { id: 2 },
                option: { id: 3 },
              },
              {
                poll: { id: 1 },
                user: { id: 1 },
                question: { id: 3 },
                option: { id: 1 },
              },
            ]),
            save: jest.fn().mockResolvedValue([
              {
                id: 1,
                poll: { id: 1 },
                user: { id: 1 },
                question: { id: 1 },
                option: { id: 2 },
              },
              {
                id: 2,
                poll: { id: 1 },
                user: { id: 1 },
                question: { id: 2 },
                option: { id: 3 },
              },
              {
                id: 3,
                poll: { id: 1 },
                user: { id: 1 },
                question: { id: 3 },
                option: { id: 1 },
              },
            ]),
            findOne: jest
              .fn()
              .mockImplementation(({ where: { id, ...rest } }) => {
                if (rest.user.id === 2) return {};
                return null;
              }),
          },
        },
        {
          provide: getRepositoryToken(Poll),
          useValue: {
            findOne: jest.fn().mockImplementation(({ where: { id } }) => {
              if (id === 1)
                return {
                  id: 1,
                  text: 'test poll',
                  questions: [
                    {
                      id: 1,
                      text: 'test question',
                      options: [
                        {
                          id: 1,
                          text: 'test option',
                        },
                      ],
                    },
                    {
                      id: 2,
                      text: 'test question',
                      options: [
                        {
                          id: 1,
                          text: 'test option',
                        },
                        {
                          id: 2,
                          text: 'test option',
                        },
                      ],
                    },
                  ],
                };
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ResponsesService>(ResponsesService);
  });

  it('should update a poll with responses', async () => {
    const response = await service.submitResponse(payload, 1, 1);
    expect(response).toBeDefined();
  });

  it('should give an error if poll is not found', async () => {
    await expect(service.submitResponse(payload, 1, 2)).rejects.toThrow();
  });

  it('should not add response if question not part of poll', async () => {
    await expect(
      service.submitResponse(
        [
          {
            questionId: 1,
            optionId: 2,
          },
          {
            questionId: 2,
            optionId: 3,
          },
          {
            questionId: 3,
            optionId: 1,
          },
          {
            questionId: 4,
            optionId: 1,
          },
        ],
        1,
        1,
      ),
    ).rejects.toThrow();
  });

  it('should not add a response if option not part of question', async () => {
    await expect(
      service.submitResponse(
        [
          {
            questionId: 1,
            optionId: 3,
          },
        ],
        1,
        1,
      ),
    ).rejects.toThrow(`The provided option does not belong to the question`);
  });

  it('should submit a valid response', async () => {
    const response = await service.submitResponse(payload, 1, 1);
    expect(response).toBeDefined();
  });

  it('should not submit a response if user has already responded to a question', async () => {
    await expect(service.submitResponse(payload, 2, 1)).rejects.toThrow(
      `Response has already been submitted for the question`,
    );
  });
});
