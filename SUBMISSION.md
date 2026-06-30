# SamayPe.AI Technical Submission Documentation

## Executive Summary
SamayPe.AI is an autonomous agentic deadline management system designed to eliminate temporal drift and task paralysis. Using Google Gemini 2.5 Flash reasoning models and a bi-directional Twilio WhatsApp integration, the platform continuously monitors user deadlines, decomposes high-level objectives into granular milestones, dynamically scores execution risk, and autonomously reschedules overloaded commitments.

Live Production URL: https://samaype-ai-339043112543.us-central1.run.app
GitHub Repository: https://github.com/KRIWAL21/SamayPe.AI
Demo Judge Credentials: Username: judge@vibe2ship.ai | Password: vibe2ship2026
WhatsApp Sandbox Integration: Send "join samaype-ai" to +1 415 523 8886

---

## Core System Architecture & Capabilities

### 1. Autonomous Task Decomposition (Gemini 2.5 Flash)
When a user inputs a high-level goal, the system invokes Gemini 2.5 Flash via structured function calling (`/api/decompose`) to break the goal into actionable subtasks. Each subtask is assigned an estimated time duration and sequential order. Subtask completion percentages dynamically update across all client interfaces.

### 2. Bi-Directional WhatsApp Companion Engine
Integrated with Twilio Serverless Webhooks (`/api/whatsapp`), users can manage their schedule entirely via WhatsApp without opening the web interface:
- Natural Language Task Creation: Users text natural language goals, and the backend parses deadlines and subtasks automatically.
- Daily Briefings & Schedule Audits: Texting "Menu" or "Schedule" retrieves real-time task queues sorted by deadline urgency.
- Auto-Fix Execution via SMS: Texting "Fix" triggers autonomous rescheduling of overlapping or overdue tasks directly from the mobile handset.

### 3. Multimodal Media Parser (Audio & Screenshots)
The WhatsApp webhook endpoint inspects inbound media (`MediaUrl0`). When a user transmits a voice note or an image (such as a whiteboard snapshot or error screenshot), Gemini 2.5 multimodal vision and audio processing extracts action items, assigns severity levels, and appends structured tasks to the user queue.

### 4. Voice Note Goal Capture (Web Audio API)
The web application features native browser speech recognition (`VoiceGoalButton.tsx`). Spoken input is transcribed in real time and transmitted to the Gemini reasoning pipeline to construct structured task objects without manual typing.

### 5. Proactive Auto-Fix Rescheduling
The platform calculates a real-time temporal risk score (`riskScore` from 0.0 to 1.0) for every task based on remaining hours versus estimated effort. When a task crosses critical risk thresholds or becomes overdue, the system enables an automated intervention. Invoking the rescheduling endpoint (`/api/reschedule`) compresses task durations and shifts deadlines to realistic windows while preserving high-priority commitments.

### 6. Live Agentic Thinking Visualizer
To provide transparency into AI reasoning, the `AgenticThinkingModal` streams internal cognitive steps during task generation and schedule realignment. Users observe prompt decomposition, temporal vector evaluation, and constraint checking in real time.

### 7. Judge Evaluation HUD & Test Harness
A dedicated inspection overlay (`JudgeEvaluationHUD.tsx`) is embedded for evaluators. It allows one-click injection of simulated edge cases (such as critical burnout drift or hackathon deadlines) and provides instant access to WhatsApp sandbox connection instructions.

### 8. Consistency & Habit Tracking Engine
The platform includes a habit tracking module (`/habits`) that records daily execution consistency across technical study, physical wellness, and productivity routines, correlating daily streaks with overall task completion velocity.

---

## Technical Stack

Frontend Framework: Next.js 15 (App Router, React 19, TypeScript)
Styling & Animations: Tailwind CSS, Framer Motion, Lucide Icons
AI & Reasoning Engine: Google Gemini 2.5 Flash (`@google/genai` SDK)
Communication Infrastructure: Twilio API for WhatsApp Webhooks
Deployment Infrastructure: Docker containerization hosted on Google Cloud Run (Fully Managed Serverless)

---

## API Endpoints & Core Modules

- `/api/tasks` (GET, POST, PUT, DELETE): CRUD controller for task management and status synchronization.
- `/api/decompose` (POST): Translates raw prompt strings into structured JSON subtask arrays via Gemini 2.5.
- `/api/reschedule` (POST): Analyzes overdue commitments and outputs optimized schedule timelines.
- `/api/chat` (POST): Context-aware AI Coach providing recommendations based on active user task data.
- `/api/whatsapp` (POST): Twilio XML webhook handler processing text, audio, and image payloads.

---

## Verification & Testing Procedure

1. Open the live production URL and sign in using the provided demo judge credentials.
2. Click the floating Judge Evaluation Tour HUD at the bottom right of the screen.
3. Select "Simulate Burnout Emergency" to inject a high-risk system task and observe dynamic risk classification.
4. Click "AUTO-FIX" on any overdue or critical task card to watch the AI realign subtasks.
5. Connect to the WhatsApp sandbox number and text a goal string to verify real-time webhook synchronization.
