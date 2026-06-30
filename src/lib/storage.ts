import fs from 'fs';
import path from 'path';
import { Task, Priority, RiskLevel } from './types';

const DATA_DIR = path.join(process.cwd(), '.data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

const defaultTasks: Task[] = [
  {
    id: 'task-1',
    userId: 'demo-user',
    title: 'System Architecture & Microservice API Review',
    description: 'Audit authentication middleware, verify rate-limiting thresholds, and document Swagger REST endpoints.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    priority: Priority.LOW,
    status: 'IN_PROGRESS' as any,
    category: 'Engineering',
    riskScore: 0.15,
    riskLevel: RiskLevel.LOW,
    aiRecommendation: '🌱 Low Risk & Synchronized: Pace is optimal. Consider completing API documentation during tomorrow afternoon focus block.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: '1-1', title: 'Audit JWT token expiration and refresh logic', estimatedMinutes: 30, completed: true },
      { id: '1-2', title: 'Update Swagger OpenAPI schema definitions', estimatedMinutes: 45, completed: false },
      { id: '1-3', title: 'Review Redis caching TTL parameters', estimatedMinutes: 25, completed: false }
    ]
  },
  {
    id: 'task-2',
    userId: 'demo-user',
    title: 'Weekly Gym Workout & Nutrition Check-In',
    description: 'Complete 4 days of resistance training and log daily hydration goals.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    priority: Priority.LOW,
    status: 'TODO' as any,
    category: 'Wellness',
    riskScore: 0.10,
    riskLevel: RiskLevel.LOW,
    aiRecommendation: '✅ On Track: Physical wellness directly fuels mental execution velocity. Keep up the consistent routine.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: '2-1', title: 'Morning 5km interval cardio run', estimatedMinutes: 35, completed: true },
      { id: '2-2', title: 'Upper body hypertrophy & stretching session', estimatedMinutes: 50, completed: false }
    ]
  },
  {
    id: 'task-3',
    userId: 'demo-user',
    title: 'Quarterly Financial Tax & SaaS Invoice Reconciliation',
    description: 'Organize cloud server invoices, SaaS subscription receipts, and file GST expense report.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    priority: Priority.MEDIUM,
    status: 'TODO' as any,
    category: 'Finance',
    riskScore: 0.38,
    riskLevel: RiskLevel.MEDIUM,
    aiRecommendation: '⚡ Moderate Buffer: Allocate 30 minutes on Friday morning to upload vendor invoices before accounting deadline.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: '3-1', title: 'Download AWS and Google Cloud billing PDFs', estimatedMinutes: 15, completed: true },
      { id: '3-2', title: 'Categorize software subscription receipts', estimatedMinutes: 25, completed: false }
    ]
  },
  {
    id: 'task-4',
    userId: 'demo-user',
    title: 'Client Product Demo & Roadmap Presentation',
    description: 'Finalize slide deck showing Q3 feature releases, interactive analytics charts, and mobile UI improvements.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    priority: Priority.HIGH,
    status: 'TODO' as any,
    category: 'Product',
    riskScore: 0.52,
    riskLevel: RiskLevel.MEDIUM,
    aiRecommendation: '💡 Proactive Tip: Slide content is 70% complete. Rehearse live demo walkthrough to ensure smooth transitions.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: '4-1', title: 'Compile slide deck with user velocity metrics', estimatedMinutes: 40, completed: true },
      { id: '4-2', title: 'Rehearse 10-minute live demonstration', estimatedMinutes: 30, completed: false }
    ]
  },
  {
    id: 'task-5',
    userId: 'demo-user',
    title: 'Resolve Production Payment Gateway Timeout Bug',
    description: 'Investigate Stripe webhook retry timeouts occurring during high-concurrency checkout bursts.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 10).toISOString(),
    priority: Priority.URGENT,
    status: 'IN_PROGRESS' as any,
    category: 'Engineering',
    riskScore: 0.82,
    riskLevel: RiskLevel.HIGH,
    aiRecommendation: '⚠️ High Priority: Isolate database connection pool contention. Review CloudWatch error logs immediately.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: '5-1', title: 'Inspect database connection pool limits', estimatedMinutes: 30, completed: true },
      { id: '5-2', title: 'Deploy exponential backoff retry handler', estimatedMinutes: 45, completed: false }
    ]
  },
  {
    id: 'task-6',
    userId: 'demo-user',
    title: 'Revise LangChain Notes & Agentic Memory Patterns',
    description: 'Review LCEL (LangChain Expression Language), tool-calling loops, and vector database indexing techniques.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
    priority: Priority.MEDIUM,
    status: 'TODO' as any,
    category: 'AI Study',
    riskScore: 0.22,
    riskLevel: RiskLevel.LOW,
    aiRecommendation: '📚 Core AI Mastery: Practice implementing custom Runnable sequences and callback handlers.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: '6-1', title: 'Review LangChain LCEL pipeline piping logic', estimatedMinutes: 35, completed: true },
      { id: '6-2', title: 'Practice multi-agent supervisor graph implementation', estimatedMinutes: 50, completed: false }
    ]
  },
  {
    id: 'task-7',
    userId: 'demo-user',
    title: 'Revise Core ML Algos & Mathematics',
    description: 'Re-derive backpropagation equations, gradient boosting decision trees (XGBoost), and self-attention matrices.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 144).toISOString(),
    priority: Priority.LOW,
    status: 'TODO' as any,
    category: 'Academics',
    riskScore: 0.12,
    riskLevel: RiskLevel.LOW,
    aiRecommendation: '💡 Deep Tech Foundation: Consistent revision prevents foundational decay. Allocate 45 mins every second day.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: '7-1', title: 'Derive softmax cross-entropy gradient derivations', estimatedMinutes: 40, completed: true },
      { id: '7-2', title: 'Compare Random Forest vs Gradient Boosted Trees variance', estimatedMinutes: 45, completed: false }
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
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && (parsed.some((t: Task) => t.title?.includes('Vibe2Ship AI Hackathon Solution')) || !parsed.some((t: Task) => t.title?.includes('Revise LangChain Notes')))) {
      fs.writeFileSync(TASKS_FILE, JSON.stringify(defaultTasks, null, 2), 'utf-8');
      return defaultTasks;
    }
    return parsed;
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
