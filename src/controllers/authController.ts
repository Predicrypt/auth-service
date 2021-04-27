import User from '../models/userModel';
import { Request, Response } from 'express';
import { Model } from 'mongoose';

const signUp = async (req: Request, res: Response) => {
  const { email, password, passwordConfirm } = req.body;

  if (password !== password) {
      throw new AppError('Passwords must be equals', 400)
  }

  const newUser = await User.build({ email, password });
};
