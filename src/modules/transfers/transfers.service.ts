import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import axios, { AxiosInstance } from 'axios';
import { Transfer } from 'src/entities/transfer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
  create(createTransferDto: CreateTransferDto[]) {
    return 'This action adds a new transfer';
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
