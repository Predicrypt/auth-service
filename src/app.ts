import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';
import { currentUser, errorHandler, NotFoundError } from '@Predicrypt/common';

import { userRouter } from './routes/userRoutes';
import cookieSession from 'cookie-session';

const app = express();

app.set('trust proxy', true);
app.use(cors());
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    httpOnly: false,
    sameSite: 'none',
  })
);
app.use(currentUser);
app.use(userRouter);
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

app.use(errorHandler);

export default app;
