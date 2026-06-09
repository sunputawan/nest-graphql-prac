import { Test, TestingModule } from '@nestjs/testing';
import { CacheInspectorService } from './cache-inspector.service';

describe('CacheInspectorService', () => {
  let service: CacheInspectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheInspectorService],
    }).compile();

    service = module.get<CacheInspectorService>(CacheInspectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
