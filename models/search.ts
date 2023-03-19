import AppDataSource from "db";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Product } from "./product";

@Entity()
export class Search extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  q: string;

  @Column()
  active: Boolean;

  @OneToMany(() => Product, (product) => product.search)
  products: Product[];

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
