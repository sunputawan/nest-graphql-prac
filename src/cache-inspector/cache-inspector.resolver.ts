import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { CacheInspectorService } from "./cache-inspector.service";
import { CacheEntryType } from "src/products/dto/cache-entry.type";

@Resolver()
export class CacheInspectorResolver {
    constructor(private readonly cacheInspectorService: CacheInspectorService) {}

    @Query(() => [String])
    async cacheKeys(
        @Args('pattern', { nullable: true, defaultValue: '*' }) pattern: string,
    ): Promise<string[]> {
        return this.cacheInspectorService.getKeys(pattern);
    }

    @Query(() => CacheEntryType)
    async cacheEntry(
        @Args('key') key: string,
    ): Promise<CacheEntryType> {
        return this.cacheInspectorService.getEntry(key);
    }

    @Query(() => String)
    async cacheStats(): Promise<String> {
        return this.cacheInspectorService.getStats();
    }

    @Mutation(() => Boolean)
    async invalidateCache(
        @Args('key') key: string,
    ): Promise<boolean> {
        return this.cacheInspectorService.invalidate(key)
    }

    @Mutation(() => Boolean)
    async flushCache(): Promise<boolean> {
        return this.cacheInspectorService.flush();
    }
}