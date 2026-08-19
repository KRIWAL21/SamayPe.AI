import { z } from 'zod';

// ── Shared sub-schemas ──────────────────────────────────────────────────────

export const SubTaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Subtask title is required').max(300),
  estimatedMinutes: z.number().int().min(1).max(1440),
  completed: z.boolean().default(false),
  scheduledStart: z.string().datetime().optional(),
  scheduledEnd: z.string().datetime().optional(),
  dependsOn: z.array(z.string()).optional(),
});

// ── Auth schemas ────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  name: z.string().max(100).optional(),
  isDemo: z.boolean().optional(),
});

export const SignupSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  name: z.string().max(100).optional(),
  archetype: z.string().max(50).optional(),
  cognitiveWindow: z.string().max(50).optional(),
  whatsappNumber: z.string().max(20).optional(),
});

// ── Task schemas ────────────────────────────────────────────────────────────

export const CreateTaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().default(''),
  deadline: z.string().min(1, 'Deadline is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).default('TODO'),
  category: z.string().max(50).optional().default('General'),
  subtasks: z.array(SubTaskSchema).max(30).optional().default([]),
  riskScore: z.number().min(0).optional().default(0),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('LOW'),
  aiRecommendation: z.string().max(500).optional(),
  userId: z.string().optional(), // ignored server-side; sourced from JWT
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  id: z.string().min(1, 'Task ID is required'),
});

// ── Decompose schema ────────────────────────────────────────────────────────

export const DecomposeSchema = z.object({
  userInput: z.string().min(1, 'Goal description is required').max(500).trim(),
  userId: z.string().optional(), // ignored server-side
});

// ── Chat schema ─────────────────────────────────────────────────────────────

export const ChatSchema = z.object({
  message: z.string().min(1).max(1000).trim(),
  tasks: z.array(z.any()).optional().default([]),
});

// ── Type helpers ────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type DecomposeInput = z.infer<typeof DecomposeSchema>;
