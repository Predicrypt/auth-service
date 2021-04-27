import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import { userRouter } from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(json());
app.use(userRouter);

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

export default app;
