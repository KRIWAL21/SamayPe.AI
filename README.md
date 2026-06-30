# ⛩️ SamayPe.AI — Autonomous Agentic Deadline Management
**Your AI negotiates with time so you don't have to.**

[![Live Cloud Run Deployment](https://img.shields.io/badge/Live%20Production-Google%20Cloud%20Run-00f0ff?style=for-the-badge&logo=googlecloud)](https://samaype-ai-339043112543.us-central1.run.app)
[![Powered by Gemini 2.5](https://img.shields.io/badge/AI%20Engine-Gemini%202.5%20Flash-9d4edd?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Next.js 15](https://img.shields.io/badge/Framework-Next.js%2015%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Twilio WhatsApp](https://img.shields.io/badge/WhatsApp%20Bot-Twilio%20Webhooks-25D366?style=for-the-badge&logo=whatsapp)](https://www.twilio.com)

---

## 🌐 Live Demo & Judge Access

* **Live Production URL:** **[https://samaype-ai-339043112543.us-central1.run.app](https://samaype-ai-339043112543.us-central1.run.app)**
* **One-Click Judge Login:** Click **"One-Click Judge Demo Login 🚀"** directly on the `/login` page
* **Manual Credentials:** Username: `judge@vibe2ship.ai` | Password: `vibe2ship2026` *(Note: credentials will rotate after judging closes)*
* **Mobile Companion Sandbox:** Text **`join samaype-ai`** or **`menu`** to **`+1 415 523 8886`**

---

## 🔥 The Problem
Deadline tools today are passive. Calendars remind you a task exists; to-do apps let you check a box. Neither one notices when your workload has quietly become infeasible, neither renegotiates your schedule when something slips, and neither meets you where you actually are — on your phone, mid-conversation, not inside a dashboard tab you forgot to open. The result is the familiar spiral: a missed deadline cascades into three more, and by the time you notice, there's no good option left.

## ⚡ The Solution
SamayPe.AI is an agentic layer that sits on top of your commitments. It breaks goals into subtasks, continuously scores how much temporal risk each task is carrying, and — when something becomes unrealistic — actively reschedules around it rather than just flagging it. The same intelligence is reachable from a web dashboard or directly over mobile messaging, including by voice note or photo, so capturing a task never requires breaking your current flow.

---

## 🏛️ System Architecture & Data Flow

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

---

## 📱 Bi-Directional Mobile Companion Engine

SamayPe AI doesn't wait for you to log into a dashboard. It maintains an active, bi-directional webhook gateway that lets you manage your entire schedule on the go via messaging.

### 📸 Live Mobile Companion in Action

<div align="center">
  <img src="public/screenshots/whatsapp-menu.jpg" width="45%" alt="Mobile Interactive Menu" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="public/screenshots/whatsapp-planner.jpg" width="45%" alt="Mobile Task Planner" />
</div>

---

## 💎 Core Capabilities by Functional Tier

### 1. Task Intelligence
* **Goal Decomposition:** AI structured function calling (`/api/decompose`) turns a high-level goal into an ordered checklist with time estimates per subtask.
* **Temporal Risk Scoring:** Every commitment carries a live risk score (0.0–1.0) computed from time remaining versus estimated workload, surfacing overload before it becomes a missed deadline.
* **Autonomous Auto-Fix:** `/api/reschedule` compresses durations and realigns deadlines into feasible focus slots when risk crosses a critical threshold, while protecting flagged high-priority commitments.
* **Agentic Thinking Visualizer:** A live telemetry view showing the reasoning pipeline's decomposition and constraint-checking steps in real time, rather than a black-box spinner.

### 2. Multichannel Capture
* **WhatsApp Companion:** Serverless messaging webhook (`/api/whatsapp`) lets you create tasks, pull a schedule via "Menu"/"Schedule", or trigger a full reschedule via "Fix," all by text.
* **Multimodal Parsing:** Voice notes and images (syllabi, error logs, screenshots) sent over messaging are parsed by multimodal vision/audio models into structured tasks automatically.
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
* **Judge Evaluation HUD:** One-click edge-case injection (burnout drift, submission-crunch scenarios) plus QR onboarding to mobile messaging.
* **Background Reminders (`/api/cron/reminders`):** Scheduled audit job that dispatches proactive risk warnings before tasks go critical.

---

## 📦 Open Source Libraries, Dependencies & Attribution

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

## 🚀 Local Development Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/KRIWAL21/SamayPe.AI.git
   cd SamayPe.AI
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env.local`):**
   ```env
   GEMINI_API_KEY=your_api_key_here
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   USER_WHATSAPP_NUMBER=whatsapp:+91yourphonenumber
   ```

4. **Run Dev Server:**
   ```bash
   npm run dev
   ```

---

## 🔮 What's Next
* **Bi-Directional Calendar OAuth:** Native two-way synchronization with Google Calendar and Microsoft Outlook.
* **Team Workload Balancing:** Multi-user organization workspaces that distribute collaborative subtasks based on peer burnout scores.
* **Local Offline Agentic RAG:** Client-side vector storage for private offline study note indexing.

## 👥 Team Credits
* **Krishna Walia (`@KRIWAL21`)** — Lead Full-Stack AI & Agentic Systems Architect
