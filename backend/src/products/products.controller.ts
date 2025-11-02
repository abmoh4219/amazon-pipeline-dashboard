import { Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ScraperService } from './scraper.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly scraperService: ScraperService,
  ) {}

  @Get()
  getAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Post('scrape-by-asins')
  async scrapeByASINs(): Promise<string> {
    await this.scraperService.fetchProductsByASINs();
    return 'Products scraped and saved using ASINs!';
  }

}
