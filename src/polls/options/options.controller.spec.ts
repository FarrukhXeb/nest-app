import { Test, TestingModule } from '@nestjs/testing';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';

describe('OptionsController', () => {
  let controller: OptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionsController],
      providers: [
        {
          provide: OptionsService,
          useValue: {
            create: jest.fn().mockReturnValue({
              text: 'test',
              question: { id: 1 },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<OptionsController>(OptionsController);
  });

  it('should create an option for a question', async () => {
    const response = await controller.create(1, { text: 'test' });
    expect(response).toBeDefined();
    expect(response.text).toBe('test');
    expect(response.question.id).toBe(1);
  });
});
