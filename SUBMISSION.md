# SamayPe.AI Technical Submission Documentation

## Executive Summary
SamayPe.AI is an autonomous agentic deadline management platform designed to eliminate temporal drift and cognitive overload. By integrating Google Gemini 2.5 Flash reasoning models with bi-directional Twilio WhatsApp serverless webhooks, the system continuously monitors execution momentum, decomposes complex goals into structured subtasks, dynamically scores temporal risk, and autonomously reschedules overlapping commitments across both web and mobile channels.

Live Production URL: https://samaype-ai-339043112543.us-central1.run.app
GitHub Repository: https://github.com/KRIWAL21/SamayPe.AI
Demo Judge Credentials: Username: judge@vibe2ship.ai | Password: vibe2ship2026
Sandbox Onboarding: Send "join samaype-ai" to +1 415 523 8886

---

## Complete Feature & Architectural Inventory

### 1. Autonomous Task Decomposition
When a user inputs a high-level goal, the system invokes structured AI function calling (`/api/decompose`) to break the objective into a sequential checklist of bite-sized subtasks. Each subtask includes time estimation and execution ordering. Completion percentages update dynamically across all interfaces.

### 2. Bi-Directional Mobile Companion Engine
Integrated via serverless webhooks (`/api/whatsapp`), users can query schedules, insert tasks, and execute interventions directly over SMS messaging:
- Natural Language Task Creation: Users text unstructured goals; the backend extracts deadlines, categories, and priority weights.
- Daily Briefing & Schedule Audits: Sending "Menu" or "Schedule" retrieves real-time task queues sorted by deadline urgency.
- Remote Auto-Fix Execution: Sending "Fix" triggers autonomous compression and realignment of overdue tasks without opening the browser.

### 3. Multimodal Media Parser (Audio & Screenshots)
The messaging webhook inspects incoming media attachments (`MediaUrl0`). When a user transmits voice notes or images (such as error logs or syllabus screenshots), multimodal vision and audio processing parses actionable items, estimates effort, and appends structured tasks to the user dashboard.

### 4. Voice Note Goal Capture (Web Audio API)
The web interface incorporates native browser speech recognition (`VoiceGoalButton.tsx`). Spoken input is transcribed in real time and processed through reasoning models to generate categorized tasks and subtasks instantaneously.

### 5. Proactive Auto-Fix Rescheduling & Temporal Risk Scoring
The platform calculates a dynamic temporal risk score (`riskScore` from 0.0 to 1.0) for every commitment based on time remaining versus estimated workload. Overdue or overloaded tasks trigger critical alerts. Clicking "AUTO-FIX" invokes `/api/reschedule` to compress durations and realign deadlines to feasible focus slots while safeguarding high-priority commitments.

### 6. Live Agentic Thinking Visualizer
The `AgenticThinkingModal` renders real-time streaming telemetry during cognitive tasks. Users observe prompt decomposition, temporal vector evaluation, and constraint checking steps as the reasoning pipeline calculates optimal schedules.

### 7. Context-Aware AI Coach & Emergency Extension Generator (`/chat`)
An interactive conversational mentor analyzes active user tasks in real time to deliver tailored productivity strategies. If a deadline breach is inevitable, the system automatically drafts formal, professional deadline extension request emails tailored for professors, project managers, or clients.

### 8. Interactive Plan Builder & User Calibration (`/create-plan` & `/profile-setup`)
Allows users to configure multi-domain parameters (Time Urgency, Academic Impact, Energy Load) and define cognitive profiles (peak energy periods, daily buffer preferences) to tailor automated scheduling decisions.

### 9. Multi-Domain Schedule Grid (`/calendar`)
A chronological timeline mapping all active tasks and subtasks by deadline. Synchronizes directly with backend storage to provide visual workload distribution across academic, engineering, and personal domains.

### 10. Burnout Diagnostics & Cognitive Load Analytics (`/insights`)
Tracks execution momentum, completion velocity, and cognitive distribution across categories. Visual charts alert users when task density approaches burnout thresholds.

### 11. Consistency & Habit Tracking Engine (`/habits`)
Records daily routine streaks across engineering study, health, and productivity routines. Incorporates pattern detection to correlate consistent habits with deadline completion success rates.

### 12. Peer Accountability Network (`/community`)
A collaborative execution leaderboard displaying anonymized momentum scores and completion streaks to foster accountability among creators and engineers.

### 13. Judge Evaluation HUD & Test Harness (`JudgeEvaluationHUD.tsx`)
A dedicated inspection overlay built for hackathon judges. Features one-click injection of edge-case simulation tasks (such as critical burnout drift or hackathon submission crunch) and immediate QR code onboarding for the mobile companion.

### 14. Automated Background Reminders (`/api/cron/reminders`)
A cron-compatible notification endpoint that audits upcoming deadlines and dispatches proactive risk warnings before tasks transition to critical status.

---

## Technical Stack & Libraries Used

Core Architecture: Next.js 15.2.9 (App Router, Server Actions, TypeScript 5)
UI & Interaction: React 19.2.4, React DOM 19.2.4
Styling Engine: Tailwind CSS v4, `@tailwindcss/postcss`
Animation & Motion: Framer Motion v12.42.0
Data Visualization: Recharts v3.9.0
Iconography: Lucide React v1.21.0
Notifications & Feedback: React Hot Toast v2.6.0
Utility Libraries: `clsx` v2.1.1, `tailwind-merge` v3.6.0, `date-fns` v4.4.0, `uuid` v14.0.1
AI SDK: `@google/generative-ai` v0.24.1
Hosting Infrastructure: Google Cloud Run Container Registry (Serverless Docker Deployment)

---

## Verification & Testing Procedure

1. Access the live URL and authenticate using the provided judge credentials (`judge@vibe2ship.ai`).
2. Click the floating Judge Evaluation Tour HUD at the bottom right to review system telemetry and inject test scenarios.
3. Observe real-time risk calculation and click "AUTO-FIX" on critical tasks to verify autonomous schedule compression.
4. Open AI Coach (`/chat`) and select quick prompts to test live context synchronization and email drafting.
5. Connect to the mobile companion number and send text, voice notes, or image screenshots to confirm multimodal ingestion.
