import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import User from './models/userModel';

dotenv.config({ path: './config.env' });

if (!process.env.DATABASE_URI || !process.env.JWT_KEY) {
  process.exit();
}

mongoose
  .connect(process.env.DATABASE_URI!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successfull');
  });

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);

  const user = new User({});
  user.createPasswordResetToken();
});
