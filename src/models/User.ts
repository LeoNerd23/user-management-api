import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verificationCode?: number;
  isVerified: boolean;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationCode: { type: Number },
  isVerified: { type: Boolean, default: false },
});


const User = mongoose.model<IUser>('User', UserSchema);

export default User;
