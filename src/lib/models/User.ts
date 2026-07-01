import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  id: string;
  email: string;
  password?: string;
  name: string;
  isDemo?: boolean;
  archetype?: string;
  cognitiveWindow?: string;
  whatsappNumber?: string;
  createdAt: string;
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  isDemo: { type: Boolean, default: false },
  archetype: { type: String, default: 'Hackathon Warrior' },
  cognitiveWindow: { type: String, default: 'Night Owl' },
  whatsappNumber: { type: String, default: '+14155238886' },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
