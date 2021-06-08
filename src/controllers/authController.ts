import User from '../models/userModel';
import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@Predicrypt/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRegisteredPublisher } from '../events/publishers/UserRegisteredPublisher';
import { natsWrapper } from '../natsWrapper';

export const signUp = async (req: Request, res: Response) => {
  const { email, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    throw new BadRequestError('Passwords must be equals');
  }

  const newUser = await User.build({ email, password });
  await newUser.save();

  new UserRegisteredPublisher(natsWrapper.client).publish({
    userId: newUser.id,
    email: newUser.email,
  });

  res.status(201).send({ id: newUser.id });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || (await !bcrypt.compare(password, user.password))) {
    throw new BadRequestError('Incorrect email or password');
  }

  const jwtToken = jwt.sign(
    {
      id: user._id,
      email: email,
    },
    process.env.JWT_KEY!,
    {
      expiresIn: '24h',
    }
  );

  req.session = { jwt: jwtToken };

  res.status(200).send({ status: 'success' });
};

export const logout = (req: Request, res: Response) => {
  req.session = null;

  res.send({});
};

export const requestNewPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError();
  }
  const resetToken = user.createPasswordResetToken();

  res.status(200).send({ resetToken });
};

export const changePassword = async (req: Request, res: Response) => {
  const { password, passwordConfirm, passwordResetToken } = req.body;

  if (password !== passwordConfirm) {
    throw new BadRequestError('Passwords must be equals');
  }

  const user = await User.findOne({ passwordResetToken });

  user.password = password;
  await user.save();

  res.status(201).send({ status: 'success' });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const user = await User.find({});
  res.status(200).send(user);
};
