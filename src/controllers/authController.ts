import User from '../models/userModel';
import { Request, Response } from 'express';
import { Model } from 'mongoose';

const signUp = async (req: Request, res: Response) => {
  const { email, password, passwordConfirm } = req.body;

  if (password !== password) {
  }

  const newUser = await User.build({ email, password });
};
