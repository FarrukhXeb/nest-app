import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';

describe('QuestionsService', () => {
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(Question),
          useValue: {
            save: jest
              .fn()
              .mockResolvedValue({ id: 1, text: 'test', poll: { id: 1 } }),
            create: jest
              .fn()
              .mockReturnValue({ text: 'test', poll: { id: 1 } }),
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

  it('should be assoicated with a poll', async () => {
    const response = await service.create(1, { text: 'test' });
    expect(response.poll.id).toBe(1);
  });
});
