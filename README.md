# SamayPe AI — Autonomous Agentic Deadline Guardian ⚡

> **Vibe2Ship Hackathon 2026** | Built with Gemini 2.0 Flash, Next.js 16, Firebase & Twilio

An event-driven agentic productivity system that goes beyond passive reminders. SamayPe AI **autonomously decomposes goals, schedules subtasks, detects temporal drift, and triggers multi-channel interventions** before deadlines are missed.

---

## 🏗️ Architecture

```
User Input (Voice / Text / WhatsApp)
         ↓
   Gemini 2.0 Flash (Orchestrator Agent)
         ↓
   ┌─────┴──────┐
   │            │
 Task Planner   Risk Telemetry
 Agent          Engine
   │            │
   └─────┬──────┘
         ↓
   Schedule Engine (Google Calendar API)
         ↓
   Firebase Firestore (Persistence)
         ↓
   ┌─────┴──────┐
   │            │
 Web Dashboard  WhatsApp Bot
 (Next.js 16)   (Twilio Webhook)
```

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Agentic Task Decomposition** | Gemini Function Calling (`create_task_plan`) converts vague goals into dependency-mapped execution DAGs |
| **Deterministic Risk Telemetry** | Formula: `remaining_work / free_calendar_slots` — auto-classifies tasks as Low → Medium → High → Critical |
| **Autonomous Auto-Fix** | One-click proactive schedule compression when deadlines drift |
| **WhatsApp Companion Bot** | Text goals to WhatsApp → Gemini decomposes → syncs to web dashboard instantly |
| **Voice Input** | Web Speech API tuned for Indian English (`en-IN`) with pulsing recording animation |
| **Weekly Sprint Plan Builder** | Select commitments + execution velocity → AI synthesizes zero-collision 7-day roadmap |
| **Community Accountability** | Gamified leaderboard with live arena telemetry and virtual cheer boosts |
| **Habit Momentum Engine** | Streak tracking with 7-day contribution dots and AI pattern correlation |
| **Behavioral Analytics** | Recharts Area + Pie charts showing completion velocity and workload distribution |
| **AI Profile Calibration** | 3-step onboarding wizard to tune archetype, peak hours, and alert channels |

---

## 🔧 Tech Stack

### Google Technologies
- **Gemini 2.0 Flash** — Agentic orchestration with structured Function Calling
- **Firebase Auth** — Google Sign-In authentication
- **Firebase Firestore** — Real-time task and habit persistence
- **Google Calendar API** — Intelligent schedule synchronization
- **Google Cloud Run** — Containerized production deployment

### Frontend & Infra
- **Next.js 16** (App Router + Turbopack) — React Server Components
- **TypeScript** — Strict type safety across all 20+ files
- **Tailwind CSS v4** — Utility-first dark theme styling
- **Framer Motion** — Layout animations, staggered lists, accordion transitions
- **Recharts** — Interactive Area and Pie chart visualizations
- **Lucide React** — Consistent icon system
- **Twilio** — WhatsApp Sandbox webhook integration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/KRIWAL21/SamayPeAI.git
cd SamayPeAI

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local and add your real GEMINI_API_KEY

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
SamayPeAI/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing Dashboard
│   │   ├── layout.tsx            # Root Layout + Sidebar
│   │   ├── globals.css           # Dark theme design tokens
│   │   ├── chat/page.tsx         # AI Conversational Coach
│   │   ├── calendar/page.tsx     # Visual Schedule Engine
│   │   ├── habits/page.tsx       # Streak & Habit Tracker
│   │   ├── insights/page.tsx     # Analytics Dashboard
│   │   ├── create-plan/page.tsx  # Weekly Sprint Plan Builder
│   │   ├── community/page.tsx    # Accountability Leaderboard
│   │   ├── profile-setup/page.tsx # AI Onboarding Wizard
│   │   └── api/
│   │       ├── chat/route.ts     # Gemini conversational endpoint
│   │       ├── decompose/route.ts # Function Calling decomposer
│   │       ├── tasks/route.ts    # Tasks CRUD
│   │       └── whatsapp/route.ts # Twilio WhatsApp webhook
│   ├── components/
│   │   ├── Sidebar.tsx           # Glass sidebar + mobile bottom nav
│   │   ├── TaskCard.tsx          # Expandable priority task card
│   │   ├── AddTaskModal.tsx      # AI-powered task creation modal
│   │   ├── VoiceButton.tsx       # Web Speech API microphone
│   │   └── WhatsAppWidget.tsx    # QR code + deep-link widget
│   └── lib/
│       ├── gemini.ts             # Gemini SDK + Function Declarations
│       ├── firebase.ts           # Firebase client config
│       ├── riskEngine.ts         # Deterministic risk scoring
│       ├── priorityEngine.ts     # Urgency × importance ranking
│       └── types.ts              # TypeScript domain models
├── Dockerfile                    # Multi-stage Cloud Run container
├── .env.example                  # Environment template
└── package.json
```

---

## 🐳 Deployment (Google Cloud Run)

```bash
# Build and deploy in one command
gcloud run deploy samaype-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-key-here
```

---

## 📊 Evaluation Criteria Mapping

| Criteria | Weight | Implementation |
|---|---|---|
| Agentic Depth | 20% | Gemini Function Calling, autonomous rescheduling, multi-step DAG decomposition |
| Problem Solving | 20% | Targets procrastination paralysis with proactive intervention, not passive reminders |
| Innovation | 20% | Risk telemetry engine, WhatsApp multi-channel, community accountability |
| Google Tech | 15% | Gemini API, Firebase, Cloud Run, Google Calendar |
| Product UX | 10% | Glassmorphism dark theme, Framer Motion animations, mobile-responsive |
| Technical | 10% | TypeScript strict, zero build errors, clean architecture |
| Completeness | 5% | 8 pages, 4 API routes, voice + text + WhatsApp input channels |

---

## 👨‍💻 Author

**KRIWAL21** — Built for the Vibe2Ship Hackathon 2026

---

*SamayPe doesn't just remind you — it fights for your deadline.* ⚡
