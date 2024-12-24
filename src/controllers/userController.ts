import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { sendEmail } from '../services/emailService';
import mongoose from 'mongoose';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, age, role } = req.body;

  try {
    console.log('Received data:', { firstName, lastName, email, password, age, role });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      role,
      verificationCode,
      isVerified: false,
    });

    await user.save();
    console.log('User created:', user);

    await sendEmail(email, 'Confirm Your Registration', `Your verification code is ${verificationCode}`);

    res.status(201).json({ message: 'User created successfully. Check your email for verification code.' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId, verificationCode } = req.body;

  try {
    const user = await User.findById(new mongoose.Types.ObjectId(userId));

    if (!user) {
      console.log('user', user)
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.verificationCode !== verificationCode) {
      res.status(400).json({ error: 'Invalid verification code' });
      return;
    }

    user.isVerified = true;
    await user.save();

    next();
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
