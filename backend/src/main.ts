import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { envConfig } from './config/envConfig';
import { UserController } from './user/controllers/user';
import { prisma } from '../prisma/prisma';
import { RecordController } from './record/controllers/record';
import { JwtAuthMiddleware } from './_common/middlewares/global.jwt-auth';
import bodyParser from 'body-parser';
import { GlobalErrorHandlerMiddleware } from './_common/middlewares/global.error-handler';

useContainer(Container);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

useExpressServer(app, {
  routePrefix: '/api',
  controllers: [UserController, RecordController],
  middlewares: [GlobalErrorHandlerMiddleware, JwtAuthMiddleware],
  defaultErrorHandler: false,
});

const { PORT } = envConfig;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  prisma
    .$connect()
    .then(async () => {
      console.log('DB has been connected');
      await prisma.$disconnect();
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });
});

export const appInstance = app;
