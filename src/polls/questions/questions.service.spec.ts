import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { QuestionTypes } from './question-types.enum';

describe('QuestionsService', () => {
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(Question),
          useValue: {
            save: jest.fn().mockResolvedValue({
              id: 1,
              text: 'test',
              poll: { id: 1 },
              type: QuestionTypes.DROPDOWN,
            }),
            create: jest.fn().mockReturnValue({
              text: 'test',
              poll: { id: 1 },
              type: QuestionTypes.DROPDOWN,
            }),
            update: jest.fn().mockReturnValue({
              affected: 1,
            }),
            findOne: jest.fn().mockReturnValue({
              id: 1,
              text: 'test',
              poll: { id: 1 },
              type: QuestionTypes.DROPDOWN,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should create a question', async () => {
    const response = await service.create(1, { text: 'test' });
    expect(response).toBeDefined();
    expect(response.text).toBe('test');
  });

  it('should create a question with a type', async () => {
    const response = await service.create(1, {
      text: 'test',
      type: QuestionTypes.DROPDOWN,
    });
    expect(response.type).toBe(QuestionTypes.DROPDOWN);
  });

  it('should be assoicated with a poll', async () => {
    const response = await service.create(1, { text: 'test' });
    expect(response.poll.id).toBe(1);
  });

  it('should update a question with a specific type', async () => {
    const response = await service.update(1, {
      text: 'test',
      type: QuestionTypes.DROPDOWN,
    });
    expect(response.type).toBe(QuestionTypes.DROPDOWN);
  });
});
