import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import Starter from '@config/starter';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();
const starter = new Starter();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'err',
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'err',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('🔥  Server started on port 3333');
});

setTimeout(() => {
  starter.createAdmin();
}, 3000);
