import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Search } from "./search";
import AppDataSource from "db";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  id_in_website: number;

  @Column()
  title: string;

  @Column()
  price: string;

  @Column()
  image: string;

  @Column()
  category: string;

  @Column({
    type: "date",
  })
  published_at: Date;

  @ManyToOne(() => Search, (search) => search.products)
  search: number;

  @Column({
    type: Boolean,
    default: () => false,
  })
  is_scraped: Boolean;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
