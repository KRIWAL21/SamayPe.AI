import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { signToken } from '@/lib/auth';
import { SignupSchema } from '@/lib/schemas';
import { logger, generateRequestId } from '@/lib/logger';

const BCRYPT_ROUNDS = 12;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function POST(req: Request) {
  const requestId = generateRequestId();

  try {
    // ── 1. Parse + Validate input with Zod ──────────────────────────────────
    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name, archetype, cognitiveWindow, whatsappNumber } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();

    await connectDB();

    // ── 2. Check for existing account ────────────────────────────────────────
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 400 }
      );
    }

    // ── 3. Hash password with bcrypt (12 rounds) ─────────────────────────────
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newUser = await User.create({
      id: userId,
      email: cleanEmail,
      password: hashedPassword,
      name: name || cleanEmail.split('@')[0] || 'Creator',
      isDemo: false,
      archetype: archetype || 'Hackathon Warrior',
      cognitiveWindow: cognitiveWindow || 'Night Owl',
      whatsappNumber: whatsappNumber || '+14155238886',
      phoneNumber: `+1-${Date.now()}-${Math.floor(Math.random() * 999999)}`,
    });

    // ── 4. Issue JWT and set it as an httpOnly cookie ─────────────────────────
    const token = await signToken({ uid: userId, email: cleanEmail, isDemo: false });

    logger.info('User signup successful', { requestId, userId, route: '/api/auth/signup' });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isDemo: newUser.isDemo,
        archetype: newUser.archetype,
        cognitiveWindow: newUser.cognitiveWindow,
        whatsappNumber: newUser.whatsappNumber,
      },
    });

    response.cookies.set('samay_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Signup API error', { requestId, route: '/api/auth/signup', error: msg });
    return NextResponse.json({ error: 'Failed to register account' }, { status: 500 });
  }
}
