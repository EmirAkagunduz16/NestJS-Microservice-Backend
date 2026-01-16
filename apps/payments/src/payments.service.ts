import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { CreateChargeDto } from '@app/common/dto';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsClient: ClientProxy,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') ?? '',
    );
  }

  private readonly stripe: Stripe;

  async createCharge({ amount, email }: PaymentCreateChargeDto) {
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

    this.notificationsClient.emit('notify_email', {
      email,
      text: `Your payment of $${amount} has been received.`,
    });

    return paymentIntent;
  }
}
