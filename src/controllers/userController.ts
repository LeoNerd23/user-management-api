import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { sendEmail } from '../services/emailService';
import mongoose from 'mongoose';

/**
 * Creates a new user with the provided details.
 * 
 * Validates the input (name, email, and password formats) and ensures the email is unique.
 * Hashes the password, generates a verification code, and sends an email for verification.
 * 
 * @param {Request} req - Express request object containing user details in the body
 * @param {Response} res - Express response object for sending back the status and messages
 * @returns {Promise<void>} - Returns a JSON response indicating success or failure
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      res.status(400).json({ error: 'First and Last names can only contain letters and spaces' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        error:
          'Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
      return;
    }

    console.log('Received data:', { firstName, lastName, email, password });

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

/**
 * Verifies a user with the provided user ID and verification code.
 * 
 * Checks if the user exists, validates the verification code, and marks the user as verified.
 * 
 * @param {Request} req - Express request object containing user ID and verification code in the body
 * @param {Response} res - Express response object for sending back the status and messages
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a JSON response indicating success or failure
 */
export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId, verificationCode } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.verificationCode !== verificationCode) {
      res.status(400).json({ error: 'Invalid verification code' });
      return;
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: 'User verified successfully' });
    next();
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Retrieves a user by their ID.
 * 
 * Validates the ID format and checks if the user exists in the database.
 * 
 * @param {Request} req - Express request object containing the user ID as a URL parameter
 * @param {Response} res - Express response object for sending back the user data or error messages
 * @returns {Promise<void>} - Returns a JSON response with the user data or an error
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Deletes a user by their ID.
 * Validates the ID format and removes the user if they exist in the database.
 * @param {Request} req - Express request object containing the user ID as a URL parameter
 * @param {Response} res - Express response object for sending back the status and messages
 * @returns {Promise<void>} - Returns a JSON response indicating success or failure
 */
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Updates the firstName and lastName of a user by their ID.
 * 
 * Validates the ID format and the name fields using regex before updating the user.
 * 
 * @param {Request} req - Express request object containing the user ID as a URL parameter and updated names in the body
 * @param {Response} res - Express response object for sending back the status and messages
 * @returns {Promise<void>} - Returns a JSON response indicating success or failure
 */
export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      res.status(400).json({ error: 'First and Last names can only contain letters and spaces' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user name by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Handles user login by verifying email and password.
 * Generates a JWT token if the credentials are valid.
 * @param {Request} req - Express request object containing email and password in the body
 * @param {Response} res - Express response object for sending back the status and messages
 * @returns {Promise<void>} - Returns a JSON response indicating success or failure
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ error: 'User is not verified. Please verify your account.' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret', // Use a secure secret in production
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};