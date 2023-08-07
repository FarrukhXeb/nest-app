import { Test, TestingModule } from '@nestjs/testing';
import { PollingGateway } from './polling.gateway';

describe('PollingGateway', () => {
  let gateway: PollingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollingGateway],
    }).compile();

    gateway = module.get<PollingGateway>(PollingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
