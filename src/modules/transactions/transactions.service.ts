import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import axios, { AxiosInstance } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transactions.entity';
import { Repository } from 'typeorm';
const randomstring = require('randomstring');
@Injectable()
export class TransactionsService {
  protected readonly axiosInstance: AxiosInstance;
  protected readonly customerPartnerId: string;
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {
    this.axiosInstance = axios.create({
      baseURL: process.env.B54_API,
      headers: {
        Authorization: process.env.B54_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    this.customerPartnerId = process.env.B54_CUSTOMER_PARTNER_ID;
  }
  async create(createTransactionDto: CreateTransactionDto[]) {
    try {
      /**
       This is not completed I don't know the way the transaction is 
       on the payload we are sending for aggragators
       **/
      const transactions = createTransactionDto.map((transaction) => ({
        amount: transaction.amount,
        fees: transaction.amount * Number(process.env.MARGIN),
      }));

      const response = await this.axiosInstance.post(`/transactions/register`, {
        customer_partner_id: this.customerPartnerId,
        sector: 'Aggregator',
        transactions,
      });

      if (response.data.status !== 'success') {
        throw new HttpException(
          'unable to make payment',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // This is not completed
      createTransactionDto.forEach(async (transaction) => {
        const randomString = randomstring.generate({
          length: 9,
          charset: 'numeric',
        });
        const amount =
          transaction.amount +
          (transaction.amount * Number(process.env.MARGIN)).toFixed(2);

        const body = {
          pin: `NGN${randomString} (TRG)`,
          date: new Date(),
          settlement_currency: transaction.settlement_currency,
          amount,
          amount_revised: amount,
          fees: transaction.fees,
          sub_total: amount + transaction.amount * Number(process.env.MARGIN),
          amount_destination:
            transaction.amount * Number(process.env.CONVERSION_RATE),
          transaction_status: transaction.status,
          completed_date: new Date(),
          paid_by: transaction.paid_by,
          waitlist_comment: transaction.waitlist_comment,
        };

        const transactionData = this.transactionRepository.create(body);
        await this.transactionRepository.save(transactionData);
      });
    } catch (error) {
      return {
        status: error,
        statusCode: 401,
        message: error.message,
      };
    }
  }

  async findAll() {
    return await this.transactionRepository.find({});
  }

  async findOne(pin: string) {
    return await this.transactionRepository.find({
      where: { pin },
    });
  }

  async remove(id: number) {
    return await this.transactionRepository.delete(id);
  }
}
