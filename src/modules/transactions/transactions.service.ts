import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionType } from '../../utils/types';
import axios, { AxiosInstance } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transactions.entity';
import { Repository } from 'typeorm';
import { RequestDrawdownDto } from './dto/request-drawdown.dto';
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
  async create(createTransactionDto_: CreateTransactionDto[]) {
    try {
      /**
       This is not completed I don't know the way the transaction is 
       on the payload we are sending for aggragators
       **/
      const createTransactionDto = createTransactionDto_.map((item) => {
        const randomString = randomstring.generate({
          length: 9,
          charset: 'numeric',
        });
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const destinationAmount =
          item.amount -
          Number((item.amount * Number(process.env.MARGIN)).toFixed(2));
        return {
          ...item,
          pin: `NGN${randomString} (TRG)`,
          date: today.toISOString().split('T')[0], // convert to YYYY-MM-DD
          completed_date: nextWeek.toISOString().split('T')[0], // convert to YYYY-MM-DD in a future date
          amount_destination: destinationAmount * Number(process.env.CONVERSION_RATE),
        };
      });
      const transactions = createTransactionDto.map(
        (transaction: CreateTransactionType) => ({
          client: {
            business_name: transaction.paid_by,
            contact_number: '',
          },
          transaction_reference: transaction.pin,
          transaction_date: transaction.date,
          expected_settlement_date: transaction.completed_date,
          category: 'Money Exchange',
          amount: transaction.amount_destination,
          number_of_transactions: 1,
          transaction_fees: transaction.amount * Number(process.env.MARGIN),
          status: 'success',
        }),
      );

      const financed_transactions = createTransactionDto.map(
        (transaction: CreateTransactionType) => ({
          transaction_reference: transaction.pin,
          amount: transaction.amount_destination,
          payments: [
            {
              disbursement_date: transaction.date,
              expected_payment_date: transaction.completed_date,
              amount: transaction.amount_destination,
            },
          ],
        }),
      );

      const response = await this.axiosInstance.post(`/transactions/register`, {
        customer_partner_id: this.customerPartnerId,
        sector: 'Aggregator',
        transactions,
        financed_transactions,
      });

      if (response.data.status !== 'success') {
        throw new HttpException(
          'unable to make payment',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // This is not completed
      for (const transaction of createTransactionDto) {
        const amount = Number(
          transaction.amount +
            Number(
              (transaction.amount * Number(process.env.MARGIN)).toFixed(2),
            ),
        );

        const body = {
          pin: transaction.pin,
          date: transaction.date,
          settlement_currency: transaction.settlement_currency,
          amount,
          amount_revised: amount,
          fees: transaction.fees,
          sub_total: amount + transaction.fees,
          amount_destination: transaction.amount_destination,
          transaction_status: transaction.status,
          completed_date: transaction.completed_date,
          paid_by: transaction.paid_by,
          waitlist_comment: transaction.waitlist_comment,
        };

        const transactionData = this.transactionRepository.create(body);
        await this.transactionRepository.save(transactionData);

        return {
          status: 'success',
          statusCode: 201,
          message: 'Transaction has been created successfully.',
          data: [],
        };
      }
    } catch (error) {
      return {
        status: error,
        statusCode: 401,
        message: error.message,
      };
    }
  }

  async requestDrawdown(requestDrawdownDto: RequestDrawdownDto) {
    try {
      const response = await this.axiosInstance.post(`/draw-downs/customer-partner/${this.customerPartnerId}/request`, {
        ...requestDrawdownDto
      });

      return {
        status: 'success',
        statusCode: 201,
        message: response.data.message,
      }
    } catch(error) {
      return {
        status: 'error',
        statusCode: error.response ? error.response.status : 500,
        message: error.response ? error.response.data.message : error.response,
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
