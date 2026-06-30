export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

export interface SubTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
  scheduledStart?: string; // ISO string
  scheduledEnd?: string;   // ISO string
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  priority: Priority;
  status: TaskStatus;
  category: string;
  subtasks: SubTask[];
  riskScore: number; // 0.0 to 1.0+
  riskLevel: RiskLevel;
  aiRecommendation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekly';
  completions: string[]; // Array of ISO date strings (YYYY-MM-DD)
  currentStreak: number;
  longestStreak: number;
  aiInsight?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  functionCall?: {
    name: string;
    args: Record<string, any>;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  timezone: string;
}

export interface RankedTask extends Task {
  priorityScore: number;
  reasoning: string;
}
