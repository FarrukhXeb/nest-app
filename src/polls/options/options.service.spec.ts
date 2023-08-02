import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from './options.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Option } from '../entities/option.entity';
import { QuestionsService } from '../questions/questions.service';

describe('OptionsService', () => {
  let service: OptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionsService,
        {
          provide: getRepositoryToken(Option),
          useValue: {
            save: jest.fn().mockResolvedValue(
              Promise.resolve({
                id: 1,
                text: 'test option',
                question: { id: 1 },
              }),
            ),
            create: jest.fn().mockReturnValue({
              text: 'test option',
              question: { id: 1 },
            }),
          },
        },
        {
          provide: QuestionsService,
          useValue: {
            findOne: jest.fn().mockImplementation(({ id }) => {
              if (id === 2) return null;
              return { id: 1 };
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OptionsService>(OptionsService);
  });

  it('should create an option', async () => {
    const response = await service.create(1, { text: 'test option' });
    expect(response).toBeDefined();
    expect(response.text).toBe('test option');
    expect(response.question.id).toBe(1);
  });

  it('should throw an error if question does not exist', async () => {
    await expect(
      async () => await service.create(2, { text: 'test option' }),
    ).rejects.toThrowError();
  });
});
