# SamayPe.AI — Autonomous Agentic Deadline Management
**Your AI negotiates with time so you don't have to.**

* **Live Demo:** https://samaype-ai-339043112543.us-central1.run.app
* **Repository:** https://github.com/KRIWAL21/SamayPe.AI
* **Judge Login:** `judge@vibe2ship.ai` / `vibe2ship2026` *(Note: credentials will rotate after judging closes)*
* **WhatsApp Sandbox:** Text `join samaype-ai` to `+1 415 523 8886`

---

## The Problem
Deadline tools today are passive. Calendars remind you a task exists; to-do apps let you check a box. Neither one notices when your workload has quietly become infeasible, neither renegotiates your schedule when something slips, and neither meets you where you actually are — on your phone, mid-conversation, not inside a dashboard tab you forgot to open. The result is the familiar spiral: a missed deadline cascades into three more, and by the time you notice, there's no good option left.

## The Solution
SamayPe.AI is an agentic layer that sits on top of your commitments. It breaks goals into subtasks, continuously scores how much temporal risk each task is carrying, and — when something becomes unrealistic — actively reschedules around it rather than just flagging it. The same intelligence is reachable from a web dashboard or directly over WhatsApp, including by voice note or photo, so capturing a task never requires breaking your current flow.

---

## Core Capabilities

### 1. Task Intelligence
* **Goal Decomposition:** AI structured function calling (`/api/decompose`) turns a high-level goal into an ordered checklist with time estimates per subtask.
* **Temporal Risk Scoring:** Every commitment carries a live risk score (0.0–1.0) computed from time remaining versus estimated workload, surfacing overload before it becomes a missed deadline.
* **Autonomous Auto-Fix:** `/api/reschedule` compresses durations and realigns deadlines into feasible focus slots when risk crosses a critical threshold, while protecting flagged high-priority commitments.
* **Agentic Thinking Visualizer:** A live telemetry view showing the reasoning pipeline's decomposition and constraint-checking steps in real time, rather than a black-box spinner.

### 2. Multichannel Capture
* **WhatsApp Companion:** Serverless messaging webhook (`/api/whatsapp`) lets you create tasks, pull a schedule via "Menu"/"Schedule", or trigger a full reschedule via "Fix," all by text.
* **Multimodal Parsing:** Voice notes and images (syllabi, error logs, screenshots) sent over WhatsApp are parsed by multimodal vision/audio models into structured tasks automatically.
* **Browser Voice Capture (`VoiceGoalButton.tsx`):** Native Web Audio transcription feeds straight into the same task-generation pipeline on desktop.

### 3. Visibility & Coaching
* **AI Coach (`/chat`):** A context-aware mentor that reads your live task state and, when a breach is unavoidable, drafts a professional extension-request email tailored to a professor, manager, or client.
* **Calendar Grid (`/calendar`):** Chronological view of tasks and subtasks across domains.
* **Burnout & Load Analytics (`/insights`):** Tracks completion velocity and cognitive load distribution, flagging when density approaches burnout.
* **Calibration (`/create-plan`, `/profile-setup`):** User-defined urgency, impact, and energy weightings personalize how the scheduler makes tradeoffs.

### 4. Habit & Community Layer
* **Habit Tracking (`/habits`):** Streak tracking with AI pattern detection correlating consistency to deadline success.
* **Peer Accountability (`/community`):** Anonymized leaderboard of momentum and execution streaks.

### 5. Ops & Judge Tooling
* **Judge Evaluation HUD:** One-click edge-case injection (burnout drift, submission-crunch scenarios) plus QR onboarding to WhatsApp.
* **Background Reminders (`/api/cron/reminders`):** Scheduled audit job that dispatches proactive risk warnings before tasks go critical.

---

## Architecture Flow

```
User
 ├─ Web Dashboard (Next.js 15 / React 19)
 └─ WhatsApp Companion (Twilio Webhook) ─┐
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
```

### Technical Stack Summary

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router), React 19, TypeScript | Server-Side Rendering, API Routes, & Client UI |
| **AI Reasoning & Vision** | Google Gemini 2.5 Flash (`@google/genai` SDK) | Cognitive Decomposition, Risk Scoring, & Multimodal NLP |
| **Messaging Infrastructure**| Twilio Serverless API | Bi-directional interactive chat & webhook payload processing |
| **Styling & Motion** | Tailwind CSS v4, Framer Motion v12 | Responsive Cyber-Mecha UI & glassmorphism components |
| **Deployment & Hosting** | Docker on Google Cloud Run | Auto-scaling serverless containerized production environment |

---

## Comprehensive Open Source Libraries & Dependencies

| Package / Library | Version | Role & Description | Source |
| :--- | :--- | :--- | :--- |
| **`next`** | `15.2.9` | Full-stack App Router framework, API endpoints | [github.com/vercel/next.js](https://github.com/vercel/next.js) |
| **`react` & `react-dom`** | `19.2.4` | Core UI rendering engine and state tree | [github.com/facebook/react](https://github.com/facebook/react) |
| **`@google/generative-ai`**| `^0.24.1` | Official SDK for reasoning, function calling, & vision | [github.com/google-gemini](https://github.com/google-gemini/generative-ai-js) |
| **`framer-motion`** | `^12.42.0` | Declarative motion library powering HUD modals | [github.com/framer/motion](https://github.com/framer/motion) |
| **`tailwindcss`** | `^4.0.0` | Utility-first CSS framework for responsive design | [github.com/tailwindlabs](https://github.com/tailwindlabs/tailwindcss) |
| **`lucide-react`** | `^1.21.0` | Vector iconography suite for UI badges and controls | [github.com/lucide-icons](https://github.com/lucide-icons/lucide) |
| **`recharts`** | `^3.9.0` | Responsive SVG charting library for `/insights` | [github.com/recharts/recharts](https://github.com/recharts/recharts) |
| **`react-hot-toast`** | `^2.6.0` | Lightweight toast notifications for user feedback | [github.com/timolins](https://github.com/timolins/react-hot-toast) |
| **`clsx` & `tailwind-merge`**| `^2.1.1` / `^3.6.0` | Conditional CSS class merging and utility utilities | [github.com/lukeed/clsx](https://github.com/lukeed/clsx) |
| **`date-fns`** | `^4.4.0` | Temporal parsing and deadline risk duration math | [github.com/date-fns](https://github.com/date-fns/date-fns) |
| **`uuid`** | `^14.0.1` | RFC-compliant unique identifier generation | [github.com/uuidjs/uuid](https://github.com/uuidjs/uuid) |

---

## Verification Steps for Judges

1. Open the live URL and sign in with the judge credentials above.
2. Click the floating **Judge Evaluation HUD** (bottom right) to inject test scenarios and inspect telemetry.
3. Watch a task's risk score update live, then click **AUTO-FIX** on a critical item to confirm autonomous compression.
4. Open **AI Coach (`/chat`)** and run a quick prompt to confirm live context sync and extension email drafting.
5. Text, voice-note, or photo the WhatsApp sandbox number to confirm multimodal ingestion end-to-end.

---

## What's Next
* **Bi-Directional Calendar OAuth:** Native two-way synchronization with Google Calendar and Microsoft Outlook.
* **Team Workload Balancing:** Multi-user organization workspaces that distribute collaborative subtasks based on peer burnout scores.
* **Local Offline Agentic RAG:** Client-side vector storage for private offline study note indexing.

## Team
* **Krishna Walia (`@KRIWAL21`)** — Lead Full-Stack AI & Agentic Systems Architect
