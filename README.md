# SamayPe.AI — Autonomous Agentic Deadline Management
**Your AI negotiates with time so you don't have to.**

* **Live Cloud Run Deployment:** https://samaype-ai-339043112543.us-central1.run.app
* **GitHub Repository Link:** https://github.com/KRIWAL21/SamayPe.AI
* **Judge Login Credentials:** `judge@vibe2ship.ai` / `vibe2ship2026`
* **WhatsApp Companion Sandbox:** Text `join samaype-ai` to `+1 415 523 8886`

---

## 1. Problem Statement
**Track:** *The Last-Minute Life Saver*

Students, professionals, and developers suffer from chronic **Deadline Drift**. Traditional calendars and to-do lists are passive repositories—they remind you that a task exists, but do nothing when your workload becomes mathematically infeasible or cognitive fatigue sets in. When an unexpected roadblock occurs, passive tools force the user to manually reorganize dozens of commitments, triggering avoidance behaviors that spiral into missed submissions and severe burnout.

---

## 2. Solution Overview
**SamayPe.AI** moves beyond passive reminders by serving as an active, autonomous productivity guardian across **4 Cognitive Domains**: *Time Urgency*, *Career/Academic Impact*, *Cognitive Energy Demand*, and *Streak Velocity*. 

Powered by **Google Gemini 2.5 Flash** and backed by a resilient **MongoDB Atlas Cloud Engine**, the system breaks monolithic goals into achievable subtask roadmaps, scores temporal risk in real time, and—when a schedule slips—autonomously compresses durations and renegotiates deadlines into realistic focus blocks. This intelligence meets users where they already live: inside an interactive, high-performance web dashboard or bi-directionally over **WhatsApp messaging** (including voice notes and photo attachments), ensuring zero cognitive friction.

---

## 3. Google Technologies Utilized

SamayPe AI heavily integrates state-of-the-art Google infrastructure and models at every layer of the stack:

1. **Google Gemini 2.5 Flash (`@google/genai` Official SDK)**
   * **Structured Function Calling (`/api/decompose`):** Converts raw user goals into JSON subtask arrays with precise minutes estimation, suggested priority, and temporal risk evaluation.
   * **Multimodal Vision Parsing:** Reads syllabus photos, assignment screenshots, and error logs sent via WhatsApp to extract structured action items automatically.
   * **Native Audio Processing:** Transcribes spoken Voice Notes sent over messaging or web audio capture into scheduled milestones.
   * **Agentic Reasoning & Auto-Fix (`/api/reschedule`):** Evaluates multi-domain constraint conflicts and generates optimized schedule re-alignments when overload occurs.
2. **Google Cloud Run (Serverless Container Platform)**
   * Deployed as an auto-scaling, high-availability production Docker container (`samaype-ai-339043112543.us-central1.run.app`) ensuring instant webhook response times and zero maintenance overhead.
3. **Google Cloud Build & Container Registry**
   * Automated multi-stage container builds and container registry orchestration for seamless continuous cloud deployment.

---

## 4. Key Features & Agentic Capabilities

### Tier 1: Task Intelligence & Autonomous Execution
* **Goal Decomposition:** AI structured function calling turns high-level goals into ordered checklists with granular time estimates per subtask.
* **Temporal Risk Scoring:** Every commitment carries a live risk score (0.0–1.0) computed from time remaining versus estimated workload, surfacing overload before it becomes a missed deadline.
* **Autonomous Auto-Fix (`/api/reschedule`):** Compresses durations and realigns deadlines into feasible focus slots when risk crosses a critical threshold, while protecting flagged high-priority commitments.
* **Agentic Thinking Visualizer HUD (`AgenticThinkingModal`):** A live telemetry view showing the reasoning pipeline's step-by-step cognitive decomposition and constraint-checking steps in real time.
* **Dedicated Execution Inbox (`/inbox`):** A zero-clutter capture workspace separated from the dashboard, featuring instant search filtering, one-click subtask progress tracking, and integrated Voice Goal capture.

### Tier 2: Multichannel Capture & Voice Assistance
* **WhatsApp Companion (`/api/whatsapp`):** Serverless messaging webhook lets you create tasks, pull daily schedules via "Menu", or trigger full reschedules via "Fix," all by text.
* **Multimodal Parsing:** Voice notes and images (syllabi, error logs, screenshots) sent over messaging are parsed by multimodal vision/audio models into structured tasks automatically.
* **Browser Voice Capture (`VoiceGoalButton.tsx`):** Native Web Audio transcription feeds straight into the same task-generation pipeline on desktop and inside the Execution Inbox.

<p align="center">
  <img src="public/screenshots/whatsapp-menu.jpg" width="240" alt="WhatsApp Companion Menu" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="public/screenshots/whatsapp-planner.jpg" width="240" alt="WhatsApp Companion Planner" />
</p>

### Tier 3: Context-Aware Visibility & Coaching
* **AI Coach (`/chat`):** A context-aware mentor that reads your live task state and drafts professional extension-request emails tailored to professors or managers when deadlines slip.
* **Chronological Calendar Grid (`/calendar`):** Multi-domain visual timeline mapping active subtasks across a horizontal 7-day strip and date-grouped feed (`Today`, `Tomorrow`, future dates), complete with inline quick-add creators (`+ Add task / event`) under every specific date.
* **Dynamic Personalized User Profiles (`/profile`):** Customizable avatars, professional roles (`Software Engineer`, `Hackathon Builder`, `Research Scientist`), and real-time time-of-day dynamic dashboard greetings (`Good morning/afternoon/evening, {userName} 🌅`).
* **Burnout & Load Analytics (`/insights`):** Tracks completion velocity and cognitive load distribution, flagging when density approaches burnout.
* **Personal Calibration (`/create-plan`, `/profile-setup`):** User-defined urgency, impact, and energy weightings personalize how the scheduler makes tradeoffs.

### Tier 4: Habit Tracking & Peer Accountability
* **Habit Tracking (`/habits`):** Streak tracking with AI pattern detection correlating consistency to deadline success.
* **Peer Accountability (`/community`):** Anonymized leaderboard of execution momentum and streaks.

### Tier 5: Evaluation & Ops Tooling
* **MongoDB Atlas Cloud Engine (`/api/tasks`, `/lib/db.ts`):** Enterprise-grade cloud persistence synchronizing user profiles, tasks, and subtask progress across all web sessions and WhatsApp hooks.
* **Judge Evaluation HUD:** One-click edge-case injection (burnout drift, hackathon submission crunch) plus QR onboarding to WhatsApp.
* **Background Reminders (`/api/cron/reminders`):** Scheduled audit job that dispatches proactive risk warnings before tasks go critical.

---

## 5. Technologies Used

### Architecture Flow

```
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
             MongoDB Atlas Task Store ── Risk Scoring ── Auto-Reschedule
                                          │
                                          ▼
                   Cron Engine (proactive alerts) ─→ back to User
```

### Technical Stack Breakdown

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router), React 19, TypeScript | Server-Side Rendering, API Routes, & Reactive Client UI |
| **AI Reasoning & Vision** | Google Gemini 2.5 Flash (`@google/genai` SDK) | Cognitive Decomposition, Risk Scoring, & Multimodal NLP |
| **Database & Persistence**| MongoDB Atlas Cloud Engine (`mongodb` official driver) | Real-time cloud persistence for tasks, subtasks, habits, and user profiles |
| **Messaging Infrastructure**| Twilio Serverless API | Bi-directional interactive chat & webhook payload processing |
| **Styling & Motion** | Tailwind CSS v4, Framer Motion v12 | Responsive Cyber-Mecha UI & glassmorphism components |
| **Deployment & Hosting** | Docker on Google Cloud Run | Auto-scaling serverless containerized production environment |

### Comprehensive Open Source Libraries & Dependencies

| Package / Library | Version | Role & Description |
| :--- | :--- | :--- |
| **`next`** | `15.2.9` | Full-stack App Router framework, API endpoints |
| **`react` & `react-dom`** | `19.2.4` | Core UI rendering engine and state tree |
| **`@google/genai`** | `^0.1.1` | Official Google GenAI SDK for reasoning, function calling, & vision |
| **`mongodb`** | `^6.14.2` | Official MongoDB Node.js client driver for cloud persistence |
| **`framer-motion`** | `^12.42.0` | Declarative motion library powering HUD modals |
| **`tailwindcss`** | `^4.0.0` | Utility-first CSS framework for responsive design |
| **`lucide-react`** | `^1.21.0` | Vector iconography suite for UI badges and controls |
| **`recharts`** | `^3.9.0` | Responsive SVG charting library for `/insights` |
| **`react-hot-toast`** | `^2.6.0` | Lightweight toast notifications for user feedback |
| **`clsx` & `tailwind-merge`**| `^2.1.1` / `^3.6.0` | Conditional CSS class merging and utility utilities |
| **`date-fns`** | `^4.4.0` | Temporal parsing and deadline risk duration math |
| **`uuid`** | `^14.0.1` | RFC-compliant unique identifier generation |

---

## 6. Verification Steps for Judges

1. Open the **Live Cloud Run URL** (`https://samaype-ai-339043112543.us-central1.run.app`) and sign in with the judge credentials (`judge@vibe2ship.ai` / `vibe2ship2026`). Observe the personalized time-of-day greeting (`Good morning/afternoon/evening, {userName}`).
2. Navigate to **Execution Inbox (`/inbox`)** and click the floating **Voice Goal Button** to record or type a goal. Watch the real-time **Agentic Thinking HUD** visualize Gemini breaking your request into subtasks and persisting them in **MongoDB Atlas**.
3. Open **Upcoming Timeline (`/calendar`)**: Explore the horizontal week strip and vertical date timeline. Click **`+ Add task / event`** under any future date to schedule an upcoming commitment directly onto your timeline.
4. Click the floating **Judge Evaluation HUD** (bottom right) to inject test scenarios and inspect real-time AI telemetry.
5. Watch a task's risk score update live, then click **AUTO-FIX ✨** on a critical item to confirm autonomous schedule compression.
6. Open **AI Coach (`/chat`)** and ask for an extension request draft to confirm live context synchronization.
7. Text, voice-note, or send a photo to the **WhatsApp sandbox number (`+1 415 523 8886`)** to verify end-to-end multimodal capture.

---

## 7. What's Next & Roadmap
* **Bi-Directional Calendar OAuth:** Native two-way synchronization with Google Calendar and Microsoft Outlook.
* **Team Workload Balancing:** Multi-user organization workspaces that distribute collaborative subtasks based on peer burnout scores.
* **Local Offline Agentic RAG:** Client-side vector storage for private offline study note indexing.

## 8. Team
* **Krishna Agarwal (`@KRIWAL21`)** — Lead Full-Stack AI & Agentic Systems Architect
