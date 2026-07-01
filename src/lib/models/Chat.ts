import mongoose, { Schema, Model } from 'mongoose';

const ChatSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() }
});

export const ChatModel = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
