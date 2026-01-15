import {
  IsCreditCard,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cvc?: string;

  @IsNumber()
  @IsOptional()
  exp_month?: number;

  @IsNumber()
  @IsOptional()
  exp_year?: number;

  @IsCreditCard()
  @IsOptional()
  number?: string;

  // For Stripe test tokens like 'tok_visa'
  @IsString()
  @IsOptional()
  token?: string;
}
