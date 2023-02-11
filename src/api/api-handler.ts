import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Handler } from 'aws-lambda';
import { AppModule } from './app.module';

const bootstrap = async (): Promise<Handler> => {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const handler = await bootstrap();
