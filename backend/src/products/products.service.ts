import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async create(productData: Partial<Product>): Promise<Product> {
    let product = await this.productRepo.findOneBy({ asin: productData.asin });
    if (!product) {
      product = this.productRepo.create(productData);
      await this.productRepo.save(product);
    }
    return product;
  }
}
