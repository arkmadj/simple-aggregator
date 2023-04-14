import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import axios, { AxiosInstance } from 'axios';
import { Transfer } from 'src/entities/transfer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'src/entities/transfer.entity';

@Injectable()
export class TransfersService {
  protected readonly axiosInstance: AxiosInstance;
  protected readonly customerPartnerId: string;
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
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
  async create(createTransferDto: CreateTransferDto[]) {
    try {
      for (const transfer of createTransferDto) {
        let _transfer = {};
        if (transfer.type === 'bank') {
          _transfer = {
            name: transfer.account_name,
            amount: transfer.amount,
            account_type: transfer.type,
            mobile_no: transfer.mobile_no ?? null,
            account_number: transfer.account_number,
            bank_code: transfer.account_provider,
          };
        } else {
          _transfer = {
            amount: transfer.amount,
            account_type: transfer.type,
            mobile_no: transfer.mobile_no,
            correspondent: transfer.account_provider,
            narration: transfer.narration ?? null,
          };
        }
        const response = await this.axiosInstance.post(
          `baas/customer-partner/${this.customerPartnerId}/withdraw`,
          _transfer,
        );

        if (response.data.status !== 'success') {
          throw new HttpException(
            'unable to make payment',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        const transferData = this.transferRepository.create({
          status: Status.PROCESSING,
          ...transfer,
        });
        await this.transferRepository.save(transferData);
      }

      return {
        status: 'success',
        statusCode: 201,
        message: 'Transfer has been created successfully.',
        data: [],
      };
    } catch (error) {
      return {
        status: error,
        statusCode: error.status,
        message: error.message,
      };
    }
  }

  async findAll() {
    return await this.transferRepository.find({});
  }

  async findAllTransactionTransfers(id: number) {
    return await this.transferRepository.find({
      where: { transaction_id: id },
    });
  }

  async findOne(id: number) {
    return await this.transferRepository.find({
      where: { id },
    });
  }

  async remove(id: number) {
    return await this.transferRepository.delete(id);
  }
}
