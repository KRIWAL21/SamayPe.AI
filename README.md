# SamayPe.AI — Autonomous Agentic Deadline Management
**Your AI negotiates with time so you don't have to.**

* **Live Cloud Run Deployment:** https://samaype-ai-339043112543.us-central1.run.app
* **GitHub Repository Link:** https://github.com/KRIWAL21/SamayPe.AI
* **Judge Login Credentials:** `judge@vibe2ship.ai` / `vibe2ship2026` *(Note: credentials will rotate after judging closes)*
* **WhatsApp Companion Sandbox:** Text `join samaype-ai` to `+1 415 523 8886`

---

## 1. Problem Statement Selected
**Track:** *The Last-Minute Life Saver*

Students, professionals, and developers suffer from chronic **Deadline Drift**. Traditional calendars and to-do lists are passive repositories—they remind you that a task exists, but do nothing when your workload becomes mathematically infeasible or cognitive fatigue sets in. When an unexpected roadblock occurs, passive tools force the user to manually reorganize dozens of commitments, triggering avoidance behaviors that spiral into missed submissions and severe burnout.

---

## 2. Solution Overview
**SamayPe.AI** moves beyond passive reminders by serving as an active, autonomous productivity guardian across **4 Cognitive Domains**: *Time Urgency*, *Career/Academic Impact*, *Cognitive Energy Demand*, and *Streak Velocity*. 

Powered by **Google Gemini 2.5 Flash** and backed by a resilient **MongoDB Atlas Cloud Database**, the system breaks monolithic goals into achievable subtask roadmaps, scores temporal risk in real time, and—when a schedule slips—autonomously compresses durations and renegotiates deadlines into realistic focus blocks. This intelligence meets users where they already live: inside a modern **ClickUp & Todoist inspired web workspace** or bi-directionally over **WhatsApp messaging** (including voice notes and photo attachments), ensuring zero cognitive friction.

---

## 3. Google Technologies Utilized

SamayPe AI heavily integrates state-of-the-art Google infrastructure and models at every layer of the stack:

1. **Google Gemini 2.5 Flash (`@google/genai` Official SDK v0.1.1)**
   * **Structured Function Calling (`/api/decompose`):** Converts raw user goals into JSON subtask arrays with precise minutes estimation, suggested priority, and temporal risk evaluation.
   * **Multimodal Vision Parsing:** Reads syllabus photos, assignment screenshots, and error logs sent via WhatsApp to extract structured action items automatically.
   * **Native Audio Processing:** Transcribes spoken Voice Notes sent over messaging or web audio capture into scheduled milestones.
   * **Agentic Reasoning & Auto-Fix (`/api/reschedule`):** Evaluates multi-domain constraint conflicts and generates optimized schedule re-alignments when overload occurs.
2. **Google Cloud Run (Serverless Container Platform)**
   * Deployed as an auto-scaling, high-availability production Docker container (`samaype-ai-339043112543.us-central1.run.app`) ensuring instant webhook response times and zero maintenance overhead.
3. **Google Cloud Build & Container Registry**
   * Automated multi-stage container builds and registry orchestration for continuous cloud deployment.

---

## 4. Comprehensive Feature Catalog

### 💎 Tier 1: Professional ClickUp & Todoist Hybrid Architecture
* **Standalone Execution Inbox (`/inbox`):** Dedicated zero-clutter capture workspace separated from the main dashboard. Features real-time task search filtering, one-click subtask toggles, and integrated **Voice Goal Capture** wired directly to Gemini cognitive reasoning and MongoDB cloud storage.
* **Todoist Upcoming Chronological Timeline (`/calendar`):** Interactive horizontal 7-day strip paired with a vertical timeline grouped by upcoming dates (`Today`, `Tomorrow`, future dates). Includes Todoist-style **inline quick-add creators (`+ Add task / event`)** under every specific date to schedule future meetings and commitments directly onto your timeline.
* **Dynamic Personalized User Profiles (`/profile`):** Customizable display names, avatars, professional roles (`Software Engineer`, `Hackathon Builder`, `Research Scientist`), and execution modes. Powers real-time, time-of-day dynamic dashboard greetings (`Good morning/afternoon/evening, {userName} 🌅`).

### 🧠 Tier 2: Autonomous Task Intelligence & Real-Time Reasoning
* **Goal Decomposition:** AI structured function calling turns high-level goals into ordered checklists with granular time estimates per subtask.
* **Live Temporal Risk Scoring:** Every commitment carries a dynamic risk score (0.0–1.0) computed from time remaining versus estimated workload, surfacing overload before it becomes a missed deadline.
* **Autonomous Auto-Fix:** Clicking **AUTO-FIX ✨** compresses durations and realigns deadlines into feasible focus slots when risk crosses a critical threshold, while protecting flagged high-priority commitments.
* **Real-Time Agentic Thinking HUD (`AgenticThinkingModal`):** A live visual telemetry modal showing Gemini's cognitive decomposition steps, constraint evaluation, and scheduling reasoning in real time.

### ☁️ Tier 3: Production Cloud Persistence & Multichannel Messaging
* **MongoDB Atlas Cloud Engine (`/api/tasks`, `/lib/db.ts`):** Enterprise-grade cloud persistence ensuring user profiles, tasks, subtasks, and AI recommendations are reliably stored and synchronized across all sessions and webhook interactions.
* **WhatsApp Companion Hook (`/api/whatsapp`):** Serverless messaging webhook lets you create tasks, pull daily schedules via "Menu", or trigger full reschedules via "Fix," all by text.
* **Multimodal Capture:** Voice notes and images (syllabi, error logs, screenshots) sent over messaging are parsed by multimodal vision/audio models into structured tasks automatically.

<p align="center">
  <img src="public/screenshots/whatsapp-menu.jpg" width="240" alt="WhatsApp Companion Menu" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="public/screenshots/whatsapp-planner.jpg" width="240" alt="WhatsApp Companion Planner" />
</p>

### 📈 Tier 4: Context-Aware Visibility, Coaching & Analytics
* **AI Coach (`/chat`):** A context-aware mentor that reads your live task state and drafts professional extension-request emails tailored to professors or managers when deadlines slip.
* **Burnout & Load Analytics (`/insights`):** Tracks completion velocity and cognitive load distribution, flagging when density approaches burnout.
* **Personal Calibration (`/create-plan`, `/profile-setup`):** User-defined urgency, impact, and energy weightings personalize how the scheduler makes tradeoffs.
* **Habit Tracking (`/habits`):** Streak tracking with AI pattern detection correlating consistency to deadline success.
* **Peer Accountability (`/community`):** Anonymized leaderboard of execution momentum and streaks.
* **Judge Evaluation HUD:** One-click edge-case injection (burnout drift, hackathon submission crunch) plus QR onboarding to WhatsApp.

---

## 5. System Architecture & Tech Stack

### End-to-End Architecture Flow

```
User
 ├─ ClickUp/Todoist Web UI (Next.js 15 / React 19)
 └─ WhatsApp Companion (Twilio Webhook) ──┐
                                           ▼
                          API Layer (Next.js Route Handlers)
                                           │
                                           ▼
                    Reasoning Engine (Gemini 2.5 Flash SDK)
                                           │
                                           ▼
                 MongoDB Atlas Store ── Risk Scoring ── Auto-Reschedule
                                           │
                                           ▼
                    Cron Engine (proactive alerts) ─→ back to User
```

### Technical Stack Breakdown

| Layer | Technology | Role & Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router), React 19, TypeScript | Server-Side Rendering, API Route Handlers, & Reactive Client UI |
| **AI Reasoning & Vision** | Google Gemini 2.5 Flash (`@google/genai` SDK) | Cognitive Goal Decomposition, Risk Scoring, & Multimodal NLP |
| **Database & Persistence**| MongoDB Atlas Cloud (`mongodb` official driver) | Real-time cloud storage for tasks, goals, subtasks, and user profiles |
| **Messaging Infrastructure**| Twilio Serverless API | Bi-directional interactive chat & webhook payload processing |
| **Styling & Motion** | Tailwind CSS v4, Vanilla CSS, Framer Motion v12 | Responsive Cyber-Mecha UI, Todoist/ClickUp glassmorphism components |
| **Deployment & Hosting** | Docker on Google Cloud Run | Auto-scaling serverless containerized production environment |

### Open Source Libraries & Dependencies

| Package / Library | Version | Role & Description | Source |
| :--- | :--- | :--- | :--- |
| **`next`** | `15.2.9` | Full-stack App Router framework, API endpoints | [github.com/vercel/next.js](https://github.com/vercel/next.js) |
| **`react` & `react-dom`** | `19.2.4` | Core UI rendering engine and state tree | [github.com/facebook/react](https://github.com/facebook/react) |
| **`@google/genai`** | `^0.1.1` | Official Google Gen AI SDK for reasoning & function calling | [github.com/googleapis/nodejs-genai](https://github.com/googleapis/nodejs-genai) |
| **`mongodb`** | `^6.14.2` | Official MongoDB Node.js driver for cloud persistence | [github.com/mongodb/node-mongodb-native](https://github.com/mongodb/node-mongodb-native) |
| **`framer-motion`** | `^12.42.0` | Declarative motion library powering HUD modals | [github.com/framer/motion](https://github.com/framer/motion) |
| **`tailwindcss`** | `^4.0.0` | Utility-first CSS framework for responsive design | [github.com/tailwindlabs](https://github.com/tailwindlabs/tailwindcss) |
| **`lucide-react`** | `^1.21.0` | Vector iconography suite for UI badges and controls | [github.com/lucide-icons](https://github.com/lucide-icons/lucide) |
| **`recharts`** | `^3.9.0` | Responsive SVG charting library for `/insights` | [github.com/recharts/recharts](https://github.com/recharts/recharts) |
| **`react-hot-toast`** | `^2.6.0` | Lightweight toast notifications for user feedback | [github.com/timolins](https://github.com/timolins/react-hot-toast) |
| **`clsx` & `tailwind-merge`**| `^2.1.1` / `^3.6.0` | Conditional CSS class merging and utility utilities | [github.com/lukeed/clsx](https://github.com/lukeed/clsx) |
| **`date-fns`** | `^4.4.0` | Temporal parsing and deadline risk duration math | [github.com/date-fns](https://github.com/date-fns/date-fns) |

---

## 6. Verification Steps for Judges

1. Open the **Live Cloud Run URL** (`https://samaype-ai-339043112543.us-central1.run.app`) and explore the **Dashboard**. Observe the personalized time-of-day greeting (`Good morning/afternoon/evening, {userName}`).
2. Navigate to **Execution Inbox (`/inbox`)**: Click the floating **Voice Goal Button** or type a goal. Watch the real-time **Agentic Thinking HUD** visualize Gemini breaking your request into subtasks and persisting them in **MongoDB Atlas**.
3. Open **Upcoming Timeline (`/calendar`)**: Explore the Todoist-inspired horizontal week strip and vertical timeline. Click **`+ Add task / event`** under any future date to instantly schedule an upcoming commitment.
4. Customize your identity in **Profile Setup (`/profile`)**: Change your display name, avatar, and professional role.
5. Click the floating **Judge Evaluation HUD** (bottom right) to inject test scenarios (burnout crunch, deadline drift) and click **AUTO-FIX ✨** on a critical item to confirm autonomous schedule compression.
6. Test multichannel interaction via the **WhatsApp sandbox** (`+1 415 523 8886`) by sending text commands, voice notes, or photos.

---

## 7. Roadmap & Future Scope
* **Bi-Directional Calendar OAuth:** Native two-way synchronization with Google Calendar and Microsoft Outlook.
* **Team Workload Balancing:** Multi-user organization workspaces that distribute collaborative subtasks based on peer burnout scores.
* **Local Offline Agentic RAG:** Client-side vector storage for private offline study note indexing.

## 8. Team
* **Krishna Agarwal (`@KRIWAL21`)** — Lead Full-Stack AI & Agentic Systems Architect
