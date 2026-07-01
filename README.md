# SamayPe.AI — Autonomous Agentic Deadline Management
Your AI negotiates with time so you don't have to.

* Live Cloud Run Deployment: https://samaype-ai-339043112543.us-central1.run.app
* GitHub Repository Link: https://github.com/KRIWAL21/SamayPe.AI
* Judge Login Credentials: judge@vibe2ship.ai / vibe2ship2026
* WhatsApp Companion Sandbox: Text "join samaype-ai" to +1 415 523 8886

1. Problem Statement
Track: The Last-Minute Life Saver

Students, professionals, and developers suffer from chronic Deadline Drift. Traditional calendars and to-do lists are passive repositories—they remind you that a task exists, but do nothing when your workload becomes mathematically infeasible or cognitive fatigue sets in. When an unexpected roadblock occurs, passive tools force the user to manually reorganize dozen of commitments, triggering avoidance behaviors that spiral into missed submissions and severe burnout.

2. Solution Overview
SamayPe.AI moves beyond passive reminders by serving as an active, autonomous productivity guardian across 4 Cognitive Domains: Time Urgency, Career/Academic Impact, Cognitive Energy Demand, and Streak Velocity. 

Powered by Google Gemini 2.5 Flash, the system breaks monolithic goals into achievable subtask roadmaps, scores temporal risk in real time, and—when a schedule slips—autonomously compresses durations and renegotiates deadlines into realistic focus blocks. This intelligence meets users where they already live: inside an interactive web dashboard or bi-directionally over WhatsApp messaging (including voice notes and photo attachments), ensuring zero cognitive friction.

3. Google Technologies Utilized

SamayPe AI heavily integrates state-of-the-art Google infrastructure and models at every layer of the stack:

Google Gemini 2.5 Flash (@google/genai Official SDK)
Structured Function Calling (/api/decompose): Converts raw user goals into JSON subtask arrays with precise minutes estimation.
Multimodal Vision Parsing: Reads syllabus photos, assignment screenshots, and error logs sent via WhatsApp to extract structured action items automatically.
Native Audio Processing: Transcribes spoken Voice Notes sent over messaging or web audio capture into scheduled milestones.
Agentic Reasoning & Auto-Fix: Evaluates multi-domain constraint conflicts and generates optimized schedule re-alignments.
Google Cloud Run (Serverless Container Platform): Deployed as an auto-scaling, high-availability production Docker container ensuring instant webhook response times and zero maintenance overhead.
---

4. Key Features & Agentic Capabilities

Tier 1: Task Intelligence & Autonomous Execution
* Goal Decomposition: AI structured function calling turns high-level goals into ordered checklists with time estimates per subtask.
* Temporal Risk Scoring: Every commitment carries a live risk score (0.0–1.0) computed from time remaining versus estimated workload, surfacing overload before it becomes a missed deadline.
* Autonomous Auto-Fix: /api/reschedule compresses durations and realigns deadlines into feasible focus slots when risk crosses a critical threshold, while protecting flagged high-priority commitments.
* Agentic Thinking Visualizer: A live telemetry view showing the reasoning pipeline's decomposition and constraint-checking steps in real time.

Tier 2: Multichannel Capture & Voice Assistance
* WhatsApp Companion: Serverless messaging webhook (/api/whatsapp) lets you create tasks, pull daily schedules via "Menu", or trigger full reschedules via "Fix," all by text.
* Multimodal Parsing: Voice notes and images (syllabi, error logs, screenshots) sent over messaging are parsed by multimodal vision/audio models into structured tasks automatically.
* Browser Voice Capture (VoiceGoalButton.tsx): Native Web Audio transcription feeds straight into the same task-generation pipeline on desktop.

Tier 3: Context-Aware Visibility & Coaching
* AI Coach (/chat): A context-aware mentor that reads your live task state and drafts professional extension-request emails tailored to professors or managers when deadlines slip.
* Chronological Calendar Grid (/calendar): Multi-domain visual timeline mapping active subtasks.
* Burnout & Load Analytics (/insights): Tracks completion velocity and cognitive load distribution, flagging when density approaches burnout.
* Personal Calibration (/create-plan, /profile-setup): User-defined urgency, impact, and energy weightings personalize how the scheduler makes tradeoffs.

Tier 4: Habit Tracking & Peer Accountability
* Habit Tracking (/habits): Streak tracking with AI pattern detection correlating consistency to deadline success.
* Peer Accountability (/community): Anonymized leaderboard of execution momentum and streaks.

Tier 5: Evaluation & Ops Tooling
* Judge Evaluation HUD: One-click edge-case injection (burnout drift, hackathon submission crunch) plus QR onboarding to WhatsApp.
* Background Reminders (/api/cron/reminders): Scheduled audit job that dispatches proactive risk warnings before tasks go critical.

5. Technologies Used

### Architecture Flow

User
 ├─ Web Dashboard (Next.js 15 / React 19)
 └─ WhatsApp Companion (Twilio Webhook) ──┐
                                          ▼
                         API Layer (Next.js Route Handlers)
                                          │
                                          ▼
                   Reasoning Engine (text + vision + audio processing)
                                          │
                                          ▼
                   Task Store ── Risk Scoring ── Auto-Reschedule
                                          │
                                          ▼
                   Cron Engine (proactive alerts) ─→ back to User




Layer
Technology
Purpose
Frontend Framework
Next.js 15 (App Router), React 19, TypeScript
Server-Side Rendering, API Routes, & Client UI
AI Reasoning & Vision
Google Gemini 2.5 Flash (@google/genai SDK)
Cognitive Decomposition, Risk Scoring, & Multimodal NLP
Messaging Infrastructure
Twilio Serverless API
Bi-directional interactive chat & webhook payload processing
Styling & Motion
Tailwind CSS v4, Framer Motion v12
Responsive Cyber-Mecha UI & glassmorphism components
Deployment & Hosting
Docker on Google Cloud Run
Auto-scaling serverless containerized production environment


### Comprehensive Open Source Libraries & Dependencies



Package / Library
Version
Role & Description
next
15.2.9
Full-stack App Router framework, API endpoints
react & react-dom
19.2.4
Core UI rendering engine and state tree
@google/generative-ai
^0.24.1
Official SDK for reasoning, function calling, & vision
framer-motion
^12.42.0
Declarative motion library powering HUD modals
tailwindcss
^4.0.0
Utility-first CSS framework for responsive design
lucide-react
^1.21.0
Vector iconography suite for UI badges and controls
recharts
^3.9.0
Responsive SVG charting library for /insights
react-hot-toast
^2.6.0
Lightweight toast notifications for user feedback
clsx & tailwind-merge
^2.1.1 / ^3.6.0
Conditional CSS class merging and utility utilities
date-fns
^4.4.0
Temporal parsing and deadline risk duration math
uuid
^14.0.1
RFC-compliant unique identifier generation


6. Verification Steps for Judges

1. Open the Live Cloud Run URL and sign in with the judge credentials (judge@vibe2ship.ai / vibe2ship2026).
2. Click the floating Judge Evaluation HUD (bottom right) to inject test scenarios and inspect real-time AI telemetry.
3. Watch a task's risk score update live, then click AUTO-FIX ✨ on a critical item to confirm autonomous schedule compression.
4. Open AI Coach (/chat) and ask for an extension request draft to confirm live context synchronization.
5. Text, voice-note, or send a photo to the WhatsApp sandbox number (+1 415 523 8886) to verify end-to-end multimodal capture.

7. What's Next & Roadmap
* Bi-Directional Calendar OAuth: Native two-way synchronization with Google Calendar and Microsoft Outlook.
* Team Workload Balancing: Multi-user organization workspaces that distribute collaborative subtasks based on peer burnout scores.
* Local Offline Agentic RAG: Client-side vector storage for private offline study note indexing.
8. Team
* Krishna Agarwal (@KRIWAL21) — Lead Full-Stack AI & Agentic Systems Architect
