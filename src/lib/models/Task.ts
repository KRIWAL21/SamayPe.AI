import mongoose, { Schema, Document, Model } from 'mongoose';
import { Priority, RiskLevel, TaskStatus } from '../types';

const SubTaskSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  estimatedMinutes: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  scheduledStart: { type: String, required: false },
  scheduledEnd: { type: String, required: false }
}, { _id: false });

const TaskSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: String, required: true },
  priority: { type: String, enum: Object.values(Priority), default: Priority.MEDIUM },
  status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.TODO },
  category: { type: String, default: 'Engineering' },
  subtasks: { type: [SubTaskSchema], default: [] },
  riskScore: { type: Number, default: 0.2 },
  riskLevel: { type: String, enum: Object.values(RiskLevel), default: RiskLevel.LOW },
  aiRecommendation: { type: String, required: false },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
});

export const TaskModel = mongoose.models.Task || mongoose.model('Task', TaskSchema);
