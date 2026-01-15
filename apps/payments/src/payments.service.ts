import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') ?? '',
    );
  }

  private readonly stripe: Stripe;

  async createCharge({ amount }: CreateChargeDto) {
    // // Use token if provided, otherwise create payment method from card details
    // let paymentMethodId: string;

    // if (card.token) {
    //   // If a token is provided, create payment method from token
    //   const paymentMethod = await this.stripe.paymentMethods.create({
    //     type: 'card',
    //     card: { token: card.token },
    //   });
    //   paymentMethodId = paymentMethod.id;
    // } else {
    //   // For development: Use a test payment method ID directly
    //   // In production, you should tokenize cards on the client side
    //   paymentMethodId = 'pm_card_visa'; // Stripe's test payment method
    // }

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });

    return paymentIntent;
  }
}
