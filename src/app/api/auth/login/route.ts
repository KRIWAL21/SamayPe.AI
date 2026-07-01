import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const { email, password, name, isDemo = false } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    // Check if user exists in MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user in MongoDB
      const userId = isDemo ? 'demo-user' : `user-${Date.now()}`;
      user = await User.create({
        id: userId,
        email,
        name: name || email.split('@')[0] || 'Creator',
        isDemo,
        archetype: 'Hackathon Warrior',
        cognitiveWindow: 'Night Owl',
        whatsappNumber: '+14155238886'
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isDemo: user.isDemo,
        archetype: user.archetype,
        cognitiveWindow: user.cognitiveWindow,
        whatsappNumber: user.whatsappNumber
      }
    });
  } catch (error: any) {
    console.error('MongoDB Login API Error:', error);
    return NextResponse.json({ error: 'Database authentication failed' }, { status: 500 });
  }
}
