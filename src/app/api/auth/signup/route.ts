import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, password, name, archetype, cognitiveWindow, whatsappNumber } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 400 });
    }

    // Hash password with SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newUser = await User.create({
      id: userId,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name || email.split('@')[0] || 'Creator',
      isDemo: false,
      archetype: archetype || 'Hackathon Warrior',
      cognitiveWindow: cognitiveWindow || 'Night Owl',
      whatsappNumber: whatsappNumber || '+14155238886'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isDemo: newUser.isDemo,
        archetype: newUser.archetype,
        cognitiveWindow: newUser.cognitiveWindow,
        whatsappNumber: newUser.whatsappNumber
      }
    });
  } catch (error: any) {
    console.error('MongoDB Signup API Error:', error);
    return NextResponse.json({ error: 'Failed to register account on MongoDB Cloud' }, { status: 500 });
  }
}
