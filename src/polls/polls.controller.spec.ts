import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PollsController } from './polls.controller';
import { CreatePollDto } from './dtos/create-poll.dto';
import { PollsService } from './polls.service';

describe('PollsController', () => {
  let controller: PollsController;
  const newPoll: CreatePollDto = {
    title: 'my first poll',
    description: 'some description',
    startDate: faker.date.recent().toDateString(),
    endDate: faker.date.future().toDateString(),
    participants: [12, 43, 2],
  };
  const mockPollsService = {
    create: jest.fn().mockReturnValue({
      id: 1,
      title: newPoll.title,
      participants: [{ id: 12 }, { id: 43 }, { id: 2 }],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsController],
      providers: [
        {
          provide: PollsService,
          useValue: mockPollsService,
        },
      ],
    }).compile();

    controller = module.get<PollsController>(PollsController);
  });

  it('should create a poll', async () => {
    const response = await controller.create(newPoll, { id: 1 });
    expect(response).toBeDefined();
    expect(response.title).toBe(newPoll.title);

    // Checking whether the new poll created contains the participants which were selected
    const contains = response.participants.some((user) =>
      newPoll.participants.includes(user.id),
    );
    expect(contains).toBeTruthy();
  });
});
