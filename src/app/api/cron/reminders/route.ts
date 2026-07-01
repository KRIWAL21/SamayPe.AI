import { NextResponse } from 'next/server';
import { getTasks } from '@/lib/storage';
import { calculateRisk } from '@/lib/riskEngine';

// Twilio credentials from env
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
const USER_WHATSAPP_NUMBER = process.env.USER_WHATSAPP_NUMBER || '';

/**
 * Send a WhatsApp message via Twilio REST API
 */
async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !to) {
    console.warn('Twilio credentials or recipient number not configured. Skipping WhatsApp send.');
    return false;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  const formBody = new URLSearchParams({
    From: TWILIO_WHATSAPP_FROM,
    To: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
    Body: body,
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Twilio API error:', res.status, errText);
      return false;
    }

    console.log('✅ WhatsApp reminder sent successfully to', to);
    return true;
  } catch (error: any) {
    console.error('Failed to send WhatsApp message:', error.message);
    return false;
  }
}

/**
 * GET /api/cron/reminders
 * 
 * Triggered by Google Cloud Scheduler (or manual hit) to scan all tasks,
 * recalculate risk, and send proactive WhatsApp alerts for HIGH/CRITICAL tasks.
 */
export async function GET() {
  try {
    const tasks = await getTasks();
    const now = new Date();

    // Recalculate risk for all active tasks
    const riskyTasks = tasks
      .filter(t => t.status !== 'COMPLETED')
      .map(t => ({ ...t, ...calculateRisk(t) }))
      .filter(t => t.level === 'CRITICAL' || t.level === 'HIGH');

    if (riskyTasks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No high-risk tasks found. No reminders sent.',
        alerted: 0,
        checkedAt: now.toISOString(),
      });
    }

    // Build the reminder message
    const greeting = now.getHours() < 12 ? '🌅 Good morning' : now.getHours() < 17 ? '☀️ Good afternoon' : '🌙 Good evening';

    let message = `${greeting}, Creator!\n\n⚡ *SamayPe AI — Proactive Deadline Alert* ⚡\n\n`;
    message += `🚨 You have *${riskyTasks.length} task(s)* at HIGH or CRITICAL risk:\n\n`;

    riskyTasks.forEach((task, idx) => {
      const deadline = new Date(task.deadline);
      const hoursLeft = Math.max(0, (deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
      const completedSubs = (task.subtasks || []).filter((s: any) => s.completed).length;
      const totalSubs = (task.subtasks || []).length;

      message += `${idx + 1}. *${task.title}*\n`;
      message += `   ⏰ Due: ${deadline.toLocaleDateString()} (${hoursLeft.toFixed(1)}h left)\n`;
      message += `   📊 Risk: ${task.level} | Progress: ${completedSubs}/${totalSubs} subtasks\n`;
      message += `   💡 ${task.recommendation}\n\n`;
    });

    message += `Open your dashboard to take action now! 🚀\nhttps://samaype-ai-339043112543.us-central1.run.app`;

    // Send WhatsApp reminder
    let sent = false;
    if (USER_WHATSAPP_NUMBER) {
      sent = await sendWhatsAppMessage(USER_WHATSAPP_NUMBER, message);
    }

    return NextResponse.json({
      success: true,
      alerted: riskyTasks.length,
      messageSent: sent,
      checkedAt: now.toISOString(),
      preview: message,
    });
  } catch (error: any) {
    console.error('Cron reminder error:', error);
    return NextResponse.json({ error: 'Failed to process reminders', details: error.message }, { status: 500 });
  }
}
