import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Poll } from '../entities/poll.entity';
import { QuestionTypes } from './question-types.enum';

describe('QuestionsController', () => {
  let controller: QuestionsController;

  const mockQuestionsService = {
    create: jest.fn().mockReturnValue({
      text: 'test',
      type: QuestionTypes.DROPDOWN,
      poll: { id: 1 },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        {
          provide: QuestionsService,
          useValue: mockQuestionsService,
        },
        {
          provide: getRepositoryToken(Poll),
          useValue: { findOne: jest.fn().mockReturnValue({ id: 1 }) }, // for the interceptor
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  it('should create a question', async () => {
    const response = await controller.create(1, { text: 'test' });
    expect(response).toBeDefined();
    expect(response.text).toBe('test');
  });

  it('should create a question with a type', async () => {
    const response = await controller.create(1, {
      text: 'test',
      type: QuestionTypes.DROPDOWN,
    });
    expect(response.type).toBe(QuestionTypes.DROPDOWN);
  });
});
