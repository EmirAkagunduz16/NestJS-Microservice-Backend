import {
  IsCreditCard,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CardMessage } from '../types';

export class CardDto implements CardMessage {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cvc: string;

  @IsNumber()
  @IsOptional()
  expMonth: number;

  @IsNumber()
  @IsOptional()
  expYear: number;

  @IsCreditCard()
  @IsOptional()
  number: string;

  // For Stripe test tokens like 'tok_visa'
  @IsString()
  @IsOptional()
  token: string;
}
