import {
  IsCreditCard,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CardMessage } from '../types';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CardDto implements CardMessage {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Field()
  cvc: string;

  @IsNumber()
  @IsOptional()
  @Field()
  expMonth: number;

  @IsNumber()
  @IsOptional()
  @Field()
  expYear: number;

  @IsCreditCard()
  @IsOptional()
  @Field()
  number: string;

  // For Stripe test tokens like 'tok_visa'
  @IsString()
  @IsOptional()
  @Field()
  token: string;
}
