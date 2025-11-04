import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // .env available everywhere
    }),
    TypeOrmModule.forRoot(databaseConfig),
    ProductsModule,
  ],
})
export class AppModule {}
