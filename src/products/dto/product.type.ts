import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class ProductType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Float)
  price: number;
}
