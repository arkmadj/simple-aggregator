import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transactions.entity';

export enum Status {
  FAILED = 'failed',
  SUCCESS = 'success',
}

export enum Type {
  MOBILE = 'mobile-money',
  BANK = 'bank',
}

@Entity({ name: 'transfers' })
export class Transfer {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Transaction, { eager: true })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column({ name: 'transaction_id' })
  public transaction_id: number; // foreign key to transaction

  @Column({ type: 'float' })
  public amount: number; // desination amount from transaction

  @Column()
  public account_name: string; // use this for bank

  @Column()
  public account_number: string; // use this for bank

  @Column()
  public mobile_no: string; // use this for mobile money

  @Column({ type: 'enum', enum: Type })
  public type: Type;

  @Column({ type: 'enum', enum: Status })
  public status: Status;

  @Column()
  public account_provider: string; // mobile correspondent or bank acc. provider

  @Column()
  public narration: string; // compulsory for mobile money => auto-generate par transaction

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updated_at: Date;
}
