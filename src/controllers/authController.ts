import User from '../models/userModel';
import { Request, Response } from 'express';
import { BadRequestError } from '@Predicrypt/common';

export const signUp = async (req: Request, res: Response) => {
  const { email, password, passwordConfirm } = req.body;

  if (password !== password) {
    throw new BadRequestError('Passwords must be equals');
  }

  const newUser = await User.build({ email, password });
};
