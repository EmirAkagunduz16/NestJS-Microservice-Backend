import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
  private notificationsService: NotificationsServiceClient;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') ?? '',
    );
  }

  private readonly stripe: Stripe;

  async createCharge({ card, amount, email }: PaymentCreateChargeDto) {
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

    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        cvc: card.cvc,
        number: card.number,
        exp_month: card.expMonth,
        exp_year: card.expYear,
      },
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });

    if (!this.notificationsService) {
      this.notificationsService =
        this.client.getService<NotificationsServiceClient>(
          NOTIFICATIONS_SERVICE_NAME,
        );
    }

    this.notificationsService
      .notifyEmail({
        email,
        text: `Your payment of $${amount} has been received.`,
      })
      .subscribe(() => {});

    return paymentIntent;
  }
}
