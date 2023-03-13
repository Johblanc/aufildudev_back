import { Test, TestingModule } from '@nestjs/testing';
import { TchatGateway } from './tchat.gateway';

describe('TchatGateway', () => {
  let gateway: TchatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TchatGateway],
    }).compile();

    gateway = module.get<TchatGateway>(TchatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
