import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { ProductType } from './dto/product.type';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import Redis from 'ioredis';

const CACHE_KEY = 'products:all';
const CACHE_TTL = 60; // secs

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  private toType(doc: ProductDocument): ProductType {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price,
    };
  }

  async findAll(): Promise<ProductType[]> {
    const cached = await this.redis.get(CACHE_KEY);
    if (cached) {
      console.log('cache hit');
      return JSON.parse(cached) as ProductType[];
    }

    console.log('cache miss');
    const docs = await this.productModel.find();
    const result = docs.map((doc) => this.toType(doc));

    await this.redis.set(CACHE_KEY, JSON.stringify(result), 'EX', CACHE_TTL);

    return result;
  }

  async findOne(id: string): Promise<ProductType> {
    const cacheKey = `products:${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      console.log(`cache hit: ${cacheKey}`);
      return JSON.parse(cached) as ProductType;
    }

    console.log(`cache miss: ${cacheKey}`);
    const doc = await this.productModel.findById(id);
    if (!doc) throw new NotFoundException(`Product ${id} not found`);
    const result = this.toType(doc);

    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL);

    return result;
  }

  async create(input: CreateProductInput): Promise<ProductType> {
    const doc = await this.productModel.create(input);

    await this.redis.del(CACHE_KEY);

    return this.toType(doc);
  }

  async update(id: string, input: UpdateProductInput): Promise<ProductType> {
    const doc = await this.productModel.findByIdAndUpdate(id, input, {
      returnDocument: 'after',
    });

    if (!doc) throw new NotFoundException(`Product ${id} not found`);

    await this.redis.del(CACHE_KEY);
    await this.redis.del(`products:${id}`);

    return this.toType(doc);
  }

  async remove(id: string): Promise<true> {
    const doc = await this.productModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException(`Product ${id} not found`);

    await this.redis.del(CACHE_KEY);
    await this.redis.del(`products:${id}`);

    return true;
  }
}
