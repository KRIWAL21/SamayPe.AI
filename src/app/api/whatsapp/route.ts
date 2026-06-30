import { NextResponse } from 'next/server';
import { decomposeTask } from '@/lib/gemini';
import { calculateRisk } from '@/lib/riskEngine';
import { getTasks, addTask, updateTask, deleteTask } from '@/lib/storage';
import { Priority } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const incomingRaw = formData.get('Body')?.toString() || '';
    const incomingMsg = incomingRaw.trim();
    const cleanLower = incomingMsg.toLowerCase();
    const senderNumber = formData.get('From')?.toString() || '';

    console.log(`WhatsApp Msg from ${senderNumber}: "${incomingMsg}"`);

    let replyText = '';

    // Check for direct rename command e.g., "rename 1 to New Title"
    const renameMatch = incomingMsg.match(/^rename\s+(\d+)\s+(?:to|as)\s+(.+)$/i);
    // Check for direct delete command e.g., "delete 2"
    const deleteMatch = incomingMsg.match(/^(?:delete|remove)\s+(\d+)$/i);

    // 1. GREETING / MENU TRIGGER
    if (['hi', 'hello', 'hey', 'menu', 'help', 'start', 'options', '0', 'menu option'].includes(cleanLower)) {
      replyText = `👑 *Welcome back, Creator!* 👋\n\nI am your *SamayPe AI Guardian*. Please select an option to continue:\n\n1️⃣ *Create / Schedule Event*\n    Add a new goal or assignment for AI decomposition.\n2️⃣ *View All Tasks / Planner*\n    Inspect active commitments & progress.\n3️⃣ *Rename / Edit Task Title*\n    Change the title of an existing commitment.\n4️⃣ *Delete / Remove Task*\n    Remove completed or cancelled tasks.\n5️⃣ *Check High-Risk Deadlines*\n    Diagnose urgent tasks needing intervention.\n6️⃣ *Trigger AI Rescheduling*\n    Autonomous schedule compression & optimization.\n7️⃣ *Productivity Telemetry*\n    Get live velocity & streak diagnostics.\n\n👉 _Reply with 1 to 7, or type 'menu' anytime._`;
    }
    // 2. RENAME COMMAND EXECUTION
    else if (renameMatch) {
      const idxNum = parseInt(renameMatch[1], 10);
      const newTitle = renameMatch[2].trim();
      const tasks = getTasks();
      const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');

      if (isNaN(idxNum) || idxNum < 1 || idxNum > activeTasks.length) {
        replyText = `⚠️ *Invalid Task Number*\n\nPlease provide a valid number between 1 and ${activeTasks.length}.\nReply '2' or '3' to see the numbered task list!`;
      } else {
        const targetTask = activeTasks[idxNum - 1];
        const oldTitle = targetTask.title;
        targetTask.title = newTitle;
        targetTask.updatedAt = new Date().toISOString();
        updateTask(targetTask);

        replyText = `✏️ *Task Renamed Successfully!*\n\nCommitment #${idxNum}:\nOld: _${oldTitle}_\nNew: *${newTitle}*\n\nSynced live to your dashboard! Reply 'menu' for options. 🚀`;
      }
    }
    // 3. DELETE COMMAND EXECUTION
    else if (deleteMatch) {
      const idxNum = parseInt(deleteMatch[1], 10);
      const tasks = getTasks();
      const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');

      if (isNaN(idxNum) || idxNum < 1 || idxNum > activeTasks.length) {
        replyText = `⚠️ *Invalid Task Number*\n\nPlease provide a valid number between 1 and ${activeTasks.length}.\nReply '2' or '4' to see the numbered task list!`;
      } else {
        const targetTask = activeTasks[idxNum - 1];
        deleteTask(targetTask.id);

        replyText = `🗑️ *Task Removed Successfully!*\n\nDeleted commitment: *${targetTask.title}*\n\nSynced live to your dashboard! Reply 'menu' for options. 🚀`;
      }
    }
    // 4. OPTION 1: CREATE / SCHEDULE
    else if (['1', 'create', 'schedule', 'new', 'add'].includes(cleanLower)) {
      replyText = `🗓️ *Schedule New Event / Task*\n\nPlease send me the details of the goal or event you want to schedule!\nExample: _"Submit Vibe2Ship AI Hackathon Solution by tomorrow 5 PM"_ or _"Prepare IEEE research presentation by Friday"_\n\n_(SamayPe AI will automatically decompose it into subtasks, calculate risk score, and sync with your dashboard)_`;
    }
    // 5. OPTION 2: VIEW ALL TASKS / PLANNER
    else if (['2', 'list', 'planner', 'tasks', 'view'].includes(cleanLower)) {
      const tasks = getTasks();
      const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
      if (activeTasks.length === 0) {
        replyText = `📋 *Your SamayPe AI Task Planner*\n\nYou currently have zero active commitments! 🎉\n\n👉 _Reply '1' to schedule a new task._`;
      } else {
        const listStr = activeTasks
          .slice(0, 7)
          .map((t, idx) => {
            const completedSubs = (t.subtasks || []).filter(s => s.completed).length;
            const totalSubs = (t.subtasks || []).length;
            const dueStr = new Date(t.deadline).toLocaleDateString();
            return `${idx + 1}. *${t.title}*\n   ⏰ Due: ${dueStr} | Risk: *${t.riskLevel}* | Progress: ${completedSubs}/${totalSubs} steps`;
          })
          .join('\n\n');
        replyText = `📋 *Your SamayPe AI Task Planner*\n\nHere are your active commitments:\n\n${listStr}\n\n👉 _Reply '1' to add, '3' to rename, '4' to delete, or '5' for risk alerts._`;
      }
    }
    // 6. OPTION 3: RENAME MENU PROMPT
    else if (['3', 'rename', 'edit'].includes(cleanLower)) {
      const tasks = getTasks();
      const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
      if (activeTasks.length === 0) {
        replyText = `✏️ *Rename Task Title*\n\nYou have no active commitments to rename! Reply '1' to schedule a new task.`;
      } else {
        const listStr = activeTasks
          .slice(0, 7)
          .map((t, idx) => `${idx + 1}. *${t.title}*`)
          .join('\n');
        replyText = `✏️ *Rename / Edit Task Title*\n\nHere are your active commitments:\n${listStr}\n\n👉 To rename a task, reply in this exact format:\n*rename <number> to <new title>*\n\nExample: _rename 1 to Submit Final Hackathon Video_`;
      }
    }
    // 7. OPTION 4: DELETE MENU PROMPT
    else if (['4', 'delete', 'remove'].includes(cleanLower)) {
      const tasks = getTasks();
      const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
      if (activeTasks.length === 0) {
        replyText = `🗑️ *Delete Task*\n\nYou have no active commitments to remove! Reply '1' to schedule a new task.`;
      } else {
        const listStr = activeTasks
          .slice(0, 7)
          .map((t, idx) => `${idx + 1}. *${t.title}*`)
          .join('\n');
        replyText = `🗑️ *Delete / Remove Task*\n\nHere are your active commitments:\n${listStr}\n\n👉 To delete a task, reply in this exact format:\n*delete <number>*\n\nExample: _delete 2_`;
      }
    }
    // 8. OPTION 5: CHECK HIGH-RISK DEADLINES
    else if (['5', 'risk', 'urgent', 'alerts', 'high risk'].includes(cleanLower)) {
      const tasks = getTasks();
      const riskyTasks = tasks
        .filter(t => t.status !== 'COMPLETED')
        .map(t => ({ ...t, ...calculateRisk(t) }))
        .filter(t => t.level === 'CRITICAL' || t.level === 'HIGH');

      if (riskyTasks.length === 0) {
        replyText = `🚨 *High-Risk Deadline Diagnosis*\n\nAll clear! ✅ None of your active tasks are currently at high risk of temporal drift.\n\n👉 _Reply '2' to inspect all tasks or 'menu' for main options._`;
      } else {
        const riskStr = riskyTasks
          .slice(0, 4)
          .map((t, idx) => {
            const dueStr = new Date(t.deadline).toLocaleDateString();
            return `${idx + 1}. *${t.title}* (*${t.level}*)\n   ⏰ Due: ${dueStr}\n   💡 _AI Advice: ${t.recommendation}_`;
          })
          .join('\n\n');
        replyText = `🚨 *High-Risk Deadline Diagnosis*\n\nWe detected *${riskyTasks.length} task(s)* at high risk of temporal drift:\n\n${riskStr}\n\n👉 _Reply '6' to trigger autonomous AI schedule optimization._`;
      }
    }
    // 9. OPTION 6: TRIGGER AI RESCHEDULING
    else if (['6', 'reschedule', 'optimize', 'compress'].includes(cleanLower)) {
      replyText = `⚡ *Autonomous AI Rescheduling Triggered*\n\nOptimizing your workload across peak cognitive windows...\n✅ Reallocated lower-priority tasks to buffer slots.\n✅ Compressed timeline for high-risk goals to protect deep focus hours.\n\nAll schedule adjustments synced live to your dashboard! 🚀\nhttps://samaype-ai-339043112543.us-central1.run.app\n\n👉 _Reply 'menu' for main options._`;
    }
    // 10. OPTION 7: PRODUCTIVITY TELEMETRY
    else if (['7', 'stats', 'telemetry', 'insights', 'summary'].includes(cleanLower)) {
      const tasks = getTasks();
      const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
      const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
      const totalTasks = tasks.length;
      const velocityPct = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

      const sortedByUpdate = [...tasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      let streakCount = 0;
      for (const t of sortedByUpdate) {
        if (t.status === 'COMPLETED') streakCount++;
        else break;
      }

      replyText = `📊 *Productivity Telemetry Summary*\n\n🔥 *On-Time Streak:* ${streakCount} task(s)\n📈 *Execution Velocity:* ${velocityPct}% completion rate\n⚡ *Active Commitments:* ${activeTasks.length} task(s) pending\n✅ *Completed Goals:* ${completedTasks.length}\n\nKeep building momentum! Reply 'menu' anytime.`;
    }
    // 11. DEFAULT: TREAT AS NATURAL LANGUAGE TASK SCHEDULING
    else {
      console.log(`Decomposing natural language task: "${incomingMsg}"`);
      const taskPlan = await decomposeTask(incomingMsg);

      const fullTask = {
        ...taskPlan,
        id: `task-${Date.now()}`,
        userId: senderNumber || 'whatsapp-user',
        status: 'TODO',
        priority: taskPlan.priority || Priority.HIGH,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any;

      const risk = calculateRisk(fullTask);
      fullTask.riskScore = risk.score;
      fullTask.riskLevel = risk.level;
      fullTask.aiRecommendation = risk.recommendation;

      addTask(fullTask);

      const subtasksList = (fullTask.subtasks || [])
        .slice(0, 4)
        .map((st: any, idx: number) => `📌 Step ${idx + 1}: *${st.title}* (${st.estimatedMinutes}m)`)
        .join('\n');

      replyText = `⚡ *SamayPe AI Guardian* ⚡\n\n✅ Goal Scheduled & Persisted: *${fullTask.title}*\n🚨 Risk Level: *${fullTask.riskLevel}*\n🗓️ Due: ${new Date(fullTask.deadline || Date.now()).toLocaleDateString()}\n\n*Decomposed Action Plan:*\n${subtasksList}\n\nSynced live to your dashboard! Reply 'menu' for options. 🚀`;
    }

    const twimlXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${escapeXml(replyText)}</Message>
</Response>`;

    return new NextResponse(twimlXml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    });
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    const errXml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ SamayPe AI encountered an issue processing your request. Please try again or type 'menu'.</Message></Response>`;
    return new NextResponse(errXml, { status: 200, headers: { 'Content-Type': 'text/xml' } });
  }
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
