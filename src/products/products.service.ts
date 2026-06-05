import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { ProductType } from './dto/product.type';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>
    ) {}

    private toType(doc: ProductDocument): ProductType {
        return {
            id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            price: doc.price
        };
    }

    async findAll(): Promise<ProductType[]> {
        const docs = await this.productModel.find();

        return docs.map(this.toType);
    }

    async findOne(id: string): Promise<ProductType> {
        const doc = await this.productModel.findById(id);
        if(!doc) throw new NotFoundException(`Product ${id} not found`);
        
        return this.toType(doc);
    }

    async create(input: CreateProductInput): Promise<ProductType> {
        const doc = await this.productModel.create(input);
        return this.toType(doc);
    }

    async update(id: string, input: UpdateProductInput): Promise<ProductType> {
        const doc = await this.productModel.findByIdAndUpdate(
            id, input, {returnDocument: 'after'}
        );

        if(!doc) throw new NotFoundException(`Product ${id} not found`);
        return this.toType(doc);
    }

    async remove(id: string): Promise<true> {
        const doc = await this.productModel.findByIdAndDelete(id);
        if(!doc) throw new NotFoundException(`Product ${id} not found`);
        return true;
    }
}
