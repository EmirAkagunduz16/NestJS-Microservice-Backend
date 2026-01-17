import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';

interface GraphQLContext {
  req?: {
    headers?: {
      user?: string;
    };
  };
}

const getCurrentUserByContext = (
  context: ExecutionContext,
): UserDocument | undefined => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest<{ user: UserDocument }>().user;
  }
  const gqlContext = context.getArgs()[2] as GraphQLContext | undefined;
  const user = gqlContext?.req?.headers?.user;
  if (user) {
    return JSON.parse(user) as UserDocument;
  }
  return undefined;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
