import { NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/gemini';
import { getTasks } from '@/lib/storage';
import { connectDB } from '@/lib/db';
import { ChatModel } from '@/lib/models/Chat';

export async function POST(req: Request) {
  try {
    const { message, userId = 'demo-user' } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const tasks = await getTasks(userId);
    const aiResponse = await chatWithAI(message, tasks);

    try {
      await connectDB();
      await ChatModel.create([
        { id: `msg-${Date.now()}-u`, userId, role: 'user', content: message },
        { id: `msg-${Date.now()}-a`, userId, role: 'assistant', content: aiResponse }
      ]);
    } catch (dbErr) {
      console.error('Failed to save chat to MongoDB:', dbErr);
    }

    return NextResponse.json({ success: true, reply: aiResponse });
  } catch (error: any) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI chat response' }, { status: 500 });
  }
}
