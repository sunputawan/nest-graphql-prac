import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { RedisModule } from './redis/redis.module';
import { CacheInspectorModule } from './cache-inspector/cache-inspector.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, 
    }),
    MongooseModule.forRoot('mongodb://localhost:27018', {
      user: 'root',
      pass: 'root',
      dbName: 'graphQLCRUD'
    }),
    RedisModule,
    ProductsModule,
    CacheInspectorModule,
  ],
})
export class AppModule {}