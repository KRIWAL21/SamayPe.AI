import mongoose, { Schema, Model } from 'mongoose';

const HabitSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  completions: { type: [String], default: [] },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  aiInsight: { type: String, required: false }
});

export const HabitModel = mongoose.models.Habit || mongoose.model('Habit', HabitSchema);
