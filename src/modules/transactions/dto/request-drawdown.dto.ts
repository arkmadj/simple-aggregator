import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RequestDrawdownDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  tenor: number;
}
