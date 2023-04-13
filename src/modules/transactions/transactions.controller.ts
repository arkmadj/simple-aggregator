import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { RequestDrawdownDto } from './dto/request-drawdown.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto[]) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Post('/request-drawdown')
  requestDrawdown(@Body() requestDrawdownDto: RequestDrawdownDto) {
    return this.transactionsService.requestDrawdown(requestDrawdownDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':pin')
  findOne(@Param('pin') pin: string) {
    return this.transactionsService.findOne(pin);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
