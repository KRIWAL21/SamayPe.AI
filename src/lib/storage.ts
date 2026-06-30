import fs from 'fs';
import path from 'path';
import { Task, Priority, RiskLevel } from './types';

const DATA_DIR = path.join(process.cwd(), '.data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

const defaultTasks: Task[] = [
  {
    id: 'task-1',
    userId: 'hackathon-user',
    title: 'Submit Vibe2Ship AI Hackathon Solution',
    description: 'Finalize agentic loop, record 3-min demo video, deploy to Google Cloud Run, and complete BlockseBlock submission.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(),
    priority: Priority.URGENT,
    status: 'IN_PROGRESS' as any,
    category: 'Hackathon Sprint',
    riskScore: 0.88,
    riskLevel: RiskLevel.CRITICAL,
    aiRecommendation: '🚨 URGENT: Only 14 hours left. Skip extra CSS tweaks and focus strictly on recording the demo video.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: '1-1', title: 'Implement Gemini Function Calling Task Decomposer', estimatedMinutes: 45, completed: true },
      { id: '1-2', title: 'Set up Twilio WhatsApp Bot Webhook', estimatedMinutes: 30, completed: true },
      { id: '1-3', title: 'Deploy Docker Container to Google Cloud Run', estimatedMinutes: 40, completed: false },
      { id: '1-4', title: 'Record walkthrough video showing autonomous rescheduling', estimatedMinutes: 30, completed: false },
      { id: '1-5', title: 'Complete compulsory Step 5 on BlockseBlock dashboard', estimatedMinutes: 15, completed: false },
    ]
  },
  {
    id: 'task-2',
    userId: 'hackathon-user',
    title: 'Advanced Machine Learning End-Semester Project',
    description: 'Complete data preprocessing pipeline, train XGBoost model on GPU instance, and generate 15-page IEEE format report.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 60).toISOString(),
    priority: Priority.HIGH,
    status: 'TODO' as any,
    category: 'Academics',
    riskScore: 0.62,
    riskLevel: RiskLevel.HIGH,
    aiRecommendation: '⚠️ High Risk: Large volume of report writing remaining. Suggest starting literature review tonight.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: '2-1', title: 'Clean missing values & feature scaling', estimatedMinutes: 60, completed: true },
      { id: '2-2', title: 'Hyperparameter tuning with Optuna', estimatedMinutes: 120, completed: false },
      { id: '2-3', title: 'Draft IEEE format LaTeX report', estimatedMinutes: 180, completed: false },
    ]
  },
  {
    id: 'task-3',
    userId: 'hackathon-user',
    title: 'Pay Electricity & Fiber Broadband Bills',
    description: 'Avoid late fee disconnection penalties before month end.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
    priority: Priority.MEDIUM,
    status: 'TODO' as any,
    category: 'Personal',
    riskScore: 0.25,
    riskLevel: RiskLevel.LOW,
    aiRecommendation: '✅ On Track: Sufficient buffer remaining. Automated payment suggested.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: '3-1', title: 'Login to utility portal and verify amount due', estimatedMinutes: 10, completed: false },
      { id: '3-2', title: 'Complete UPI payment authorization', estimatedMinutes: 5, completed: false },
    ]
  }
];

export function getTasks(): Task[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TASKS_FILE)) {
      fs.writeFileSync(TASKS_FILE, JSON.stringify(defaultTasks, null, 2), 'utf-8');
      return defaultTasks;
    }
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Storage getTasks error:', err);
    return defaultTasks;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Storage saveTasks error:', err);
  }
}

export function addTask(task: Task): Task {
  const tasks = getTasks();
  tasks.unshift(task);
  saveTasks(tasks);
  return task;
}

export function updateTask(updated: Task): Task {
  let tasks = getTasks();
  tasks = tasks.map(t => t.id === updated.id ? updated : t);
  saveTasks(tasks);
  return updated;
}

export function deleteTask(id: string): void {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
}
