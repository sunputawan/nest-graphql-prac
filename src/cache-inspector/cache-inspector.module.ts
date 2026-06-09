import { Module } from '@nestjs/common';
import { CacheInspectorService } from './cache-inspector.service';
import { CacheInspectorResolver } from './cache-inspector.resolver';

@Module({
  providers: [CacheInspectorService, CacheInspectorResolver],
})
export class CacheInspectorModule {}
