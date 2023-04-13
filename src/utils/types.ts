export enum Status {
  COMPLETED = 'completed',
  UNCOMPLETED = 'uncompleted',
}

export enum Currency {
  USD = 'usd',
  NGN = 'ngn',
  GBP = 'gbp',
}

export class CreateTransactionType {
  settlement_currency: Currency;
  amount: number;
  fees: number;
  status: Status;
  paid_by: string;
  pin: string;
  date: string;
  completed_date: string;
  amount_destination: number;
  waitlist_comment: string;
}
