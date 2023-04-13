import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Status {
  COMPLETED = 'completed',
  UNCOMPLETED = 'uncompleted',
}

export enum Currency {
  USD = 'usd',
  NGN = 'ngn',
  GBP = 'gbp',
}

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public pin: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'enum', enum: Currency })
  public settlement_currency: Currency;

  @Column({ type: 'float' })
  public amount: number;

  @Column({ type: 'float' })
  public amount_revised: number;

  @Column({ type: 'float' })
  public fees: number;

  @Column({ type: 'float' })
  public sub_total: number;

  @Column({ type: 'float' })
  public amount_destination: number;

  @Column({ type: 'enum', enum: Status })
  public transaction_status: Status;

  @Column({ type: 'timestamp' })
  completed_date: Date;

  @Column()
  public paid_by: string;

  @Column({ type: 'text', default: 'no' })
  public watchlist_comment: string;

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
