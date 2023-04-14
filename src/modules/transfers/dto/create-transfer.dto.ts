import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum Type {
  MOBILE = 'mobile-money',
  BANK = 'bank',
}

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  transaction_id: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  account_number: string; // only compulsory for bank

  account_name: string; // only compulsory for bank

  @IsString()
  @IsNotEmpty()
  type: Type;

  mobile_no: string; // only compulsory for mobile money

  @IsString()
  @IsNotEmpty()
  account_provider: string;

  narration: string;
}
