# Hackathon Submission Document — SamayPe.AI
**Project Title:** SamayPe.AI — Autonomous Agentic Deadline Management  
**Problem Statement Track:** *The Last-Minute Life Saver*  
**Team / Builder:** Krishna Agarwal (`@KRIWAL21`)

---

## Executive Links & Sandbox Access
* **Live Cloud Run Production URL:** https://samaype-ai-339043112543.us-central1.run.app
* **GitHub Repository:** https://github.com/KRIWAL21/SamayPe.AI
* **Judge Login Credentials:** `judge@vibe2ship.ai` / `vibe2ship2026`
* **WhatsApp Companion Sandbox:** Text `join samaype-ai` to `+1 415 523 8886`

---

## 1. Problem Statement Selected
**Track:** *The Last-Minute Life Saver*

Modern professionals and students face severe workflow friction when managing high-stakes deadlines. Traditional tools (static calendars, simple to-do lists) lack cognitive awareness—they do not understand when a task is computationally or physically impossible given remaining time. When schedules slip due to unexpected hurdles, users experience burnout drift and task paralysis. SamayPe.AI resolves this by continuously evaluating real-time risk scores and autonomously restructuring timelines before failure occurs.

---

## 2. Solution Overview
SamayPe.AI is an autonomous productivity guardian engineered across **4 Cognitive Domains**: *Time Urgency*, *Career/Academic Impact*, *Cognitive Energy Demand*, and *Streak Velocity*. 

Powered by **Google Gemini 2.5 Flash** and **MongoDB Atlas Cloud Engine**, the platform automatically decomposes complex goals into granular subtask roadmaps, computes temporal risk scores continuously, and provides one-click autonomous schedule compression when workloads overflow. The system features a modern ClickUp & Todoist inspired web application paired with an interactive WhatsApp messaging companion for zero-friction capture.

---

## 3. Google Technologies Utilized

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

## 4. Comprehensive Feature Breakdown

### 🎯 Tier 1: ClickUp & Todoist Hybrid Workspace
* **Execution Inbox (`/inbox`):** Dedicated zero-clutter capture view separated from the dashboard, featuring live search filtering, subtask progress trackers, and voice goal capture.
* **Todoist Upcoming Timeline (`/calendar`):** Chronological horizontal 7-day strip paired with a vertical date-grouped feed. Includes inline quick-add creators (`+ Add task / event`) under every future date.
* **Dynamic User Profiles (`/profile`):** Customizable avatars, roles (`Software Engineer`, `Hackathon Builder`), and real-time time-of-day greetings (`Good morning/afternoon/evening, {userName}`).

### 🤖 Tier 2: Real-Time Agentic Reasoning & Auto-Fix
* **Cognitive Goal Decomposition:** AI function calling turns high-level goals into ordered checklists with granular time estimates per subtask.
* **Live Temporal Risk Scoring:** Continuously updates risk scores (0.0–1.0) based on remaining runway versus work density.
* **One-Click Autonomous Auto-Fix:** Automatically compresses duration and rebalances focus windows when critical risk thresholds are crossed.
* **Agentic Thinking HUD (`AgenticThinkingModal`):** Live step-by-step cognitive telemetry modal showing Gemini's reasoning pipeline in real time.

### 🌐 Tier 3: MongoDB Atlas Cloud & Multichannel Webhooks
* **MongoDB Atlas Persistence (`/api/tasks`, `/lib/db.ts`):** Cloud-hosted persistence layer synchronizing tasks, subtasks, habits, and user profiles across all devices.
* **WhatsApp Companion (`/api/whatsapp`):** Bi-directional messaging hook supporting task creation, schedule querying ("Menu"), auto-rescheduling ("Fix"), voice note transcription, and photo parsing.

### 📊 Tier 4: Coaching, Analytics & Accountability
* **AI Coach (`/chat`):** Context-aware mentor that drafts professional extension request emails.
* **Cognitive Load Analytics (`/insights`):** Visualizes completion velocity and burnout density.
* **Habits & Accountability (`/habits`, `/community`):** Tracks consistency streaks and anonymous peer leaderboards.
* **Judge Evaluation HUD:** Quick injection of edge cases and immediate QR code onboarding.

---

## 5. Architecture & Tech Stack

```
User Web/WhatsApp ──► Next.js 15 API Handlers ──► Gemini 2.5 Flash Engine
                            │
                            ▼
                    MongoDB Atlas Cluster ──► Autonomous Scheduler & Cron
```

### Open Source Libraries & Dependencies

| Library / Package | Version | Role & Description | Repository Link |
| :--- | :--- | :--- | :--- |
| **`next`** | `15.2.9` | Full-stack App Router framework & serverless routes | [github.com/vercel/next.js](https://github.com/vercel/next.js) |
| **`react` & `react-dom`** | `19.2.4` | Reactive UI view layer and component model | [github.com/facebook/react](https://github.com/facebook/react) |
| **`@google/genai`** | `^0.1.1` | Official Google GenAI SDK for reasoning & function calling | [github.com/googleapis/nodejs-genai](https://github.com/googleapis/nodejs-genai) |
| **`mongodb`** | `^6.14.2` | MongoDB cloud database client driver | [github.com/mongodb/node-mongodb-native](https://github.com/mongodb/node-mongodb-native) |
| **`framer-motion`** | `^12.42.0` | Declarative UI animation & modal transitions | [github.com/framer/motion](https://github.com/framer/motion) |
| **`tailwindcss`** | `^4.0.0` | Utility-first CSS styling engine | [github.com/tailwindlabs](https://github.com/tailwindlabs/tailwindcss) |
| **`lucide-react`** | `^1.21.0` | Vector iconography suite | [github.com/lucide-icons](https://github.com/lucide-icons/lucide) |

---

## 6. Judge Verification Instructions
1. Access the **Live Production URL** at `https://samaype-ai-339043112543.us-central1.run.app`. Notice the dynamic time-of-day greeting.
2. Go to **Execution Inbox (`/inbox`)** and use the **Voice Goal Button** to record a complex goal. Observe the live **Agentic Thinking HUD** pop up.
3. Open **Upcoming Timeline (`/calendar`)** and click **`+ Add task / event`** under any future date to schedule an upcoming commitment.
4. Open the bottom-right **Judge Evaluation HUD** to simulate burnout crunch or trigger instant schedule rescheduling.
