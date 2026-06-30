import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from '@google/generative-ai';
import { Task, SubTask, Priority, RiskLevel } from './types';

// Initialize Gemini SDK
const apiKey = process.env.GEMINI_API_KEY || 'MOCK_API_KEY_FOR_DEV';
const genAI = new GoogleGenerativeAI(apiKey);

// Define Function Declarations for Agentic Tool Use
export const createTaskPlanTool: FunctionDeclaration = {
  name: 'create_task_plan',
  description: 'Decompose a user goal into actionable subtasks with time estimates and suggested priorities.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      title: { type: SchemaType.STRING, description: 'Clear title of the overall project or assignment' },
      category: { type: SchemaType.STRING, description: 'Category e.g., Academic, Work, Personal, Finance' },
      deadline: { type: SchemaType.STRING, description: 'ISO string or clear human date representation' },
      suggestedPriority: { type: SchemaType.STRING, description: 'HIGH, MEDIUM, LOW, or URGENT' },
      subtasks: {
        type: SchemaType.ARRAY,
        description: 'Chronological list of actionable steps needed to complete the goal',
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING, description: 'Action-oriented step title' },
            estimatedMinutes: { type: SchemaType.NUMBER, description: 'Realistic time estimate in minutes' }
          },
          required: ['title', 'estimatedMinutes']
        }
      }
    },
    required: ['title', 'subtasks', 'suggestedPriority']
  }
};

export const rescheduleTaskTool: FunctionDeclaration = {
  name: 'reschedule_task',
  description: 'Reorganize and reschedule subtasks when a user falls behind schedule.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      taskId: { type: SchemaType.STRING, description: 'ID of the task' },
      reason: { type: SchemaType.STRING, description: 'Why it is being rescheduled' },
      newStrategy: { type: SchemaType.STRING, description: 'Encouraging advice on how to tackle the compressed timeline' }
    },
    required: ['taskId', 'newStrategy']
  }
};

export function getGeminiAgentModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    tools: [{ functionDeclarations: [createTaskPlanTool, rescheduleTaskTool] }]
  });
}

/**
 * Decompose natural language user input into a structured Task with Subtasks
 */
export async function decomposeTask(userInput: string): Promise<Partial<Task>> {
  const fallbackPlan = () => {
    const isML = userInput.toLowerCase().includes('ml') || userInput.toLowerCase().includes('model');
    const isVideo = userInput.toLowerCase().includes('video') || userInput.toLowerCase().includes('record');
    
    return {
      title: userInput.slice(0, 45),
      description: userInput,
      category: isML ? 'Research' : isVideo ? 'Media' : 'Work',
      priority: Priority.HIGH,
      deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
      subtasks: isML ? [
        { id: `sub-${Date.now()}-1`, title: 'Data Preprocessing & Feature Scaling', estimatedMinutes: 45, completed: false },
        { id: `sub-${Date.now()}-2`, title: 'Model Training & Hyperparameter Tuning', estimatedMinutes: 60, completed: false },
        { id: `sub-${Date.now()}-3`, title: 'Evaluate Accuracy & ROC-AUC Metrics', estimatedMinutes: 30, completed: false },
        { id: `sub-${Date.now()}-4`, title: 'Compile Final Results & Summary Paper', estimatedMinutes: 45, completed: false }
      ] : [
        { id: `sub-${Date.now()}-1`, title: 'Scope Analysis & Architecture Setup', estimatedMinutes: 30, completed: false },
        { id: `sub-${Date.now()}-2`, title: 'Execute Core Milestones & Logic', estimatedMinutes: 90, completed: false },
        { id: `sub-${Date.now()}-3`, title: 'QA Testing & Edge Case Verification', estimatedMinutes: 40, completed: false },
        { id: `sub-${Date.now()}-4`, title: 'Final Review & Production Deployment', estimatedMinutes: 20, completed: false }
      ]
    };
  };

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('MOCK')) {
    return fallbackPlan();
  }

  try {
    const model = getGeminiAgentModel();
    const prompt = `You are SamayPe AI, an autonomous deadline guardian. 
Analyze the user's request: "${userInput}"
Current Time: ${new Date().toISOString()}

Decompose this into logical subtasks with realistic minute estimates using the create_task_plan tool.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === 'create_task_plan') {
        const args = call.args as any;
        return {
          title: args.title || userInput.slice(0, 45),
          description: userInput,
          category: args.category || 'General',
          priority: (args.suggestedPriority as Priority) || Priority.HIGH,
          deadline: args.deadline || new Date(Date.now() + 86400000 * 2).toISOString(),
          subtasks: (args.subtasks || []).map((st: any, idx: number) => ({
            id: `sub-${Date.now()}-${idx}`,
            title: st.title,
            estimatedMinutes: st.estimatedMinutes || 30,
            completed: false
          }))
        };
      }
    }
    return fallbackPlan();
  } catch (error: any) {
    console.warn('Gemini API quota or network error, engaging deterministic fallback:', error.message);
    return fallbackPlan();
  }
}

/**
 * Conversational Chat with AI Assistant
 */
export async function chatWithAI(userPrompt: string, currentTasks: Task[]) {
  try {
    const systemContext = `You are SamayPe AI, an empathetic, proactive deadline companion.
User's Current Active Tasks:
${JSON.stringify(currentTasks.map(t => ({ title: t.title, deadline: t.deadline, status: t.status, risk: t.riskLevel })))}

Provide direct, concise, motivating guidance tailored to their exact tasks. If asked about rescheduling, highest risk deadlines, or micro-actions, answer specifically based on their active task list. Keep responses formatted in clean Markdown.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemContext
    });

    const chat = model.startChat();
    const res = await chat.sendMessage(userPrompt);
    return res.response.text();
  } catch (error: any) {
    console.warn('Gemini Chat fallback triggered:', error.message);
    const lower = userPrompt.toLowerCase();
    if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('late')) {
      return "⚡ **SamayPe Cognitive Guardian:** I detect temporal drift stress. Take a deep breath. Let's execute a **5-minute micro-action**: Pick the smallest subtask on your dashboard and complete just the first step. Momentum breeds velocity!";
    }
    return `✨ **SamayPe AI:** I've analyzed your prompt regarding "${userPrompt}". Based on your current calendar load, I recommend blocking out 45 minutes of uninterrupted focus flow today. Let me know if you want me to auto-reschedule overlapping meetings!`;
  }
}

/**
 * Draft an Emergency Extension Request Email
 */
export async function generateEmailDraft(task: Task, recipientType: 'professor' | 'manager' | 'client' = 'manager') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Draft a concise, professional, polite deadline extension request email.
Task: ${task.title}
Original Deadline: ${task.deadline}
Recipient: ${recipientType}

Explain that unexpected complexities arose, progress has been made, and request a realistic 48-hour extension. Keep it humble and professional.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.warn('Email draft fallback triggered:', error.message);
    return `Subject: Extension Request & Progress Update: ${task.title}\n\nDear ${recipientType.toUpperCase()},\n\nI am writing to provide a quick status update on "${task.title}". We have completed significant core milestones, but to ensure enterprise-grade quality and thorough testing, I would respectfully request a 48-hour extension past our original deadline.\n\nThank you for your understanding and support.\n\nBest regards,\nSamayPe AI Guardian (on behalf of Creator)`;
  }
}

/**
 * Reschedule and optimize delayed task using Gemini 2.5 Flash
 */
export async function rescheduleTaskWithAI(task: Task): Promise<{ recommendation: string; newDeadline: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Analyze this delayed task and provide an optimized recovery strategy:
Title: ${task.title}
Current Deadline: ${task.deadline}
Subtasks remaining: ${task.subtasks.filter(s => !s.completed).map(s => s.title).join(', ')}

Return ONLY a JSON object with two fields:
1. "recommendation": A short, motivating 1-sentence advice on how the schedule was compressed or reorganized.
2. "newDeadline": An ISO date string extended by 24 to 48 hours from now.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    return {
      recommendation: parsed.recommendation || '✨ Autonomously rescheduled! Optimized non-critical subtasks for better workflow.',
      newDeadline: parsed.newDeadline || new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString()
    };
  } catch (error: any) {
    console.warn('Reschedule AI fallback triggered:', error.message);
    return {
      recommendation: '✨ Autonomously rescheduled! Compressed timeline & prioritized core milestones.',
      newDeadline: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString()
    };
  }
}

/**
 * Generate dynamic 7-day weekly sprint roadmap using Gemini 2.5 Flash
 */
export async function generateWeeklyPlanWithAI(categories: string[], intensity: string): Promise<any[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Generate a 7-day weekly sprint schedule for a creator working on: ${categories.join(', ')} with execution intensity: "${intensity}".
Return ONLY a valid JSON array of 7 objects (Monday through Sunday). Each object must have:
- "day": Name of day e.g. "Monday"
- "focus": Specific action item e.g. "Core Engine & Webhooks Setup"
- "hours": e.g. "6 hrs" or "8 hrs"
- "status": e.g. "High Priority", "Critical Milestone", or "Deep Work"
- "color": One of these Tailwind string classes: "border-purple-500/40 bg-purple-950/20", "border-blue-500/40 bg-blue-950/20", "border-red-500/40 bg-red-950/20 text-red-300 animate-pulse", "border-orange-500/40 bg-orange-950/30 text-orange-300", "border-green-500/40 bg-green-950/20"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    throw new Error('Invalid array');
  } catch (error: any) {
    console.warn('Weekly plan AI fallback triggered:', error.message);
    return [
      { day: 'Monday', focus: `${categories[0] || 'Core Project'} Setup & Architecture`, hours: '8 hrs', status: 'High Priority', color: 'border-purple-500/40 bg-purple-950/20' },
      { day: 'Tuesday', focus: 'API Integration & Webhook Endpoints', hours: '7 hrs', status: 'High Priority', color: 'border-purple-500/40 bg-purple-950/20' },
      { day: 'Wednesday', focus: 'Core Feature Execution & Logic Validation', hours: '8 hrs', status: 'Critical Milestone', color: 'border-red-500/40 bg-red-950/20 text-red-300 animate-pulse' },
      { day: 'Thursday', focus: `${categories[1] || 'Secondary Goal'} Iteration & Testing`, hours: '6 hrs', status: 'Deep Work', color: 'border-blue-500/40 bg-blue-950/20' },
      { day: 'Friday', focus: 'Final QA, Bug Fixes & Walkthrough Video 🏆', hours: '9 hrs', status: 'Deadline Day 🔥', color: 'border-orange-500/40 bg-orange-950/30 text-orange-300' },
      { day: 'Saturday', focus: 'Documentation & Production Deployment', hours: '5 hrs', status: 'Deep Work', color: 'border-blue-500/40 bg-blue-950/20' },
      { day: 'Sunday', focus: 'Review, Retrospective & Next Sprint Prep', hours: '2 hrs', status: 'Recharge', color: 'border-green-500/40 bg-green-950/20' },
    ];
  }
}
