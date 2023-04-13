import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum Status {
  COMPLETED = 'completed',
  UNCOMPLETED = 'uncompleted',
}

export enum Currency {
  USD = 'usd',
  NGN = 'ngn',
  GBP = 'gbp',
}

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  settlement_currency: Currency;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  fees: number;

  @IsString()
  @IsNotEmpty()
  status: Status;

  @IsString()
  @IsNotEmpty()
  paid_by: string;

  @IsString()
  @IsNotEmpty()
  waitlist_comment: string;
}
