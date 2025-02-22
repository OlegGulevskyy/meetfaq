/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {Logger, ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {AppModule} from "@meetfaq/backend/src/app.module";
import cookieParser from 'cookie-parser';
import {SubscriptionExceptionFilter} from "@meetfaq/backend/src/services/authorization/subscription.exception";
import morgan from 'morgan';
import {ResponseInterceptor} from "@meetfaq/backend/src/services/response.interceptor";
import * as process from "process";
import {loadSwagger} from "@meetfaq/helpers/src/swagger/load.swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: {
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'apikey', 'serverkey'],
      credentials: true,
      methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      origin: [process.env.FRONTEND_URL, process.env.MARKETING_WEBSITE_URL],
    }
  });

  app.use(cookieParser());
  app.use(morgan(':method :url'));
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  app.useGlobalFilters(new SubscriptionExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  loadSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

bootstrap();
