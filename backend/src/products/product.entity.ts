import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  asin: string;

  @Column()
  title: string;

  @Column()
  brand: string;

  @Column()
  category: string;

  @Column()
  image_url: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ nullable: true })
  availability: string;

  @Column()
  seller: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ type: 'int', nullable: true })
  reviews_count: number;
}
