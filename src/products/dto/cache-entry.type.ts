import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CacheEntryType {
  @Field()
  key: string;

  @Field(() => String, { nullable: true })
  value: string | null;

  @Field(() => Int)
  ttl: number;
}
