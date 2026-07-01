import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, password, name, isDemo = false } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const cleanEmail = email.toLowerCase().trim();

    // Judge / Demo Pro One-Click Login Flow
    if (isDemo || cleanEmail === 'pro@samaype.ai' || cleanEmail === 'judge@vibe2ship.ai') {
      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.create({
          id: 'demo-user',
          email: cleanEmail,
          name: name || 'SamayPe.AI Pro',
          isDemo: true,
          archetype: 'Hackathon Warrior',
          cognitiveWindow: 'Night Owl',
          whatsappNumber: '+14155238886'
        });
      }
      return NextResponse.json({
        success: true,
        user: {
          id: user.id || 'demo-user',
          email: user.email,
          name: user.name,
          isDemo: true,
          archetype: user.archetype || 'Hackathon Warrior',
          cognitiveWindow: user.cognitiveWindow || 'Night Owl',
          whatsappNumber: user.whatsappNumber || '+14155238886'
        }
      });
    }

    // Standard Sign In Flow
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email. Please switch to Sign Up.' }, { status: 401 });
    }

    // Verify Password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password && user.password !== hashedPassword && user.password !== password) {
      return NextResponse.json({ error: 'Invalid password. Please try again.' }, { status: 401 });
    }

    // If account had no password set previously, attach the new hashed password
    if (!user.password) {
      user.password = hashedPassword;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isDemo: user.isDemo,
        archetype: user.archetype || 'Hackathon Warrior',
        cognitiveWindow: user.cognitiveWindow || 'Night Owl',
        whatsappNumber: user.whatsappNumber || '+14155238886'
      }
    });
  } catch (error: any) {
    console.error('MongoDB Login API Error:', error);
    return NextResponse.json({ error: 'Database authentication failed' }, { status: 500 });
  }
}
