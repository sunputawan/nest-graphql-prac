import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  collection: 'Product',
})
export class Product {
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description!: string;

  @Prop()
  price!: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
