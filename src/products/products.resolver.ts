import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { ProductType } from './dto/product.type';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver(() => ProductType)
export class ProductResolver {
  constructor(private readonly productService: ProductsService) {}

  @Query(() => [ProductType])
  async products(): Promise<ProductType[]> {
    return this.productService.findAll();
  }

  @Query(() => ProductType)
  async product(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ProductType> {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductType)
  async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<ProductType> {
    return this.productService.create(input);
  }

  @Mutation(() => ProductType)
  async updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductType> {
    return this.productService.update(id, input);
  }

  @Mutation(() => Boolean)
  async removeProduct(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.productService.remove(id);
  }
}
