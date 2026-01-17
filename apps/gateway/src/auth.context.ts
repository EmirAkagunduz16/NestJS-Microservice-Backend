import { AUTH_SERVICE } from '@app/common';
import { UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { app } from './app';
import { lastValueFrom } from 'rxjs';

interface RequestWithHeaders {
  headers?: {
    authentication?: string;
  };
}

export const authContext = async ({ req }: { req: RequestWithHeaders }) => {
  try {
    const authClient = app.get<ClientProxy>(AUTH_SERVICE);
    const user = await lastValueFrom<unknown>(
      authClient.send('authenticate', {
        Authentication: req.headers?.authentication ?? '',
      }),
    );
    return { user };
  } catch (error) {
    throw new UnauthorizedException(error);
  }
};
