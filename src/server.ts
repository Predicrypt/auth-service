import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import User from './models/userModel';
import { natsWrapper } from './natsWrapper';
import winston from 'winston';

dotenv.config({ path: './config.env' });
const LOGGER = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log' }),
  ],
});

const start = async () => {
  if (!process.env.DATABASE_URI) {
    LOGGER.warn('No DATABASE_URI ');
    process.exit();
  }

  if (!process.env.JWT_KEY) {
    LOGGER.warn('No JWT_KEY');
    process.exit();
  }

  if (!process.env.NATS_CLUSTER_ID) {
    LOGGER.warn('No NATS CLUSTER ID');
    process.exit();
  }

  if (!process.env.NATS_CLIENT_ID) {
    LOGGER.warn('No NATS CLIENT ID');
    process.exit();
  }

  if (!process.env.NATS_URL) {
    LOGGER.warn('No NATS URL');
    process.exit();
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
  } catch (err) {
    LOGGER.error(err);
  }

  mongoose
    .connect(process.env.DATABASE_URI!, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('DB connection successfull');
    });
};

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});

start();
