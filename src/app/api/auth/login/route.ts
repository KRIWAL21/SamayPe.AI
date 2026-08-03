import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { signToken } from '@/lib/auth';
import { LoginSchema } from '@/lib/schemas';
import { logger, generateRequestId } from '@/lib/logger';

const BCRYPT_ROUNDS = 12;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Detect whether a stored hash is a legacy SHA-256 hex string (64 chars, hex only)
 * vs. a bcrypt hash (starts with $2a$ / $2b$).
 */
function isLegacySha256(hash: string): boolean {
  return /^[0-9a-f]{64}$/.test(hash);
}

export async function POST(req: Request) {
  const requestId = generateRequestId();

  try {
    // ── 1. Parse + validate with Zod ─────────────────────────────────────────
    const body = await req.json();

    // Demo / judge one-click flow bypasses password validation
    const isDemo = body.isDemo === true;
    const cleanEmail = (body.email ?? '').toLowerCase().trim();

    // Allow demo login without strict password validation
    if (!isDemo) {
      const parsed = LoginSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Validation failed', fields: parsed.error.flatten().fieldErrors },
          { status: 400 }
        );
      }
    }

    if (!cleanEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    // ── 2. Demo / Judge one-click login ──────────────────────────────────────
    if (isDemo || cleanEmail === 'pro@samaype.ai' || cleanEmail === 'judge@vibe2ship.ai') {
      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.create({
          id: 'demo-user',
          email: cleanEmail,
          name: body.name || 'SamayPe.AI Pro',
          isDemo: true,
          archetype: 'Hackathon Warrior',
          cognitiveWindow: 'Night Owl',
          whatsappNumber: '+14155238886',
          phoneNumber: `+1-${Date.now()}-${Math.floor(Math.random() * 999999)}`,
        });
      }

      const demoUserId = user.id || 'demo-user';
      const token = await signToken({ uid: demoUserId, email: cleanEmail, isDemo: true });

      logger.info('Demo login', { requestId, userId: demoUserId, route: '/api/auth/login' });

      const response = NextResponse.json({
        success: true,
        user: {
          id: demoUserId,
          email: user.email,
          name: user.name,
          isDemo: true,
          archetype: user.archetype || 'Hackathon Warrior',
          cognitiveWindow: user.cognitiveWindow || 'Night Owl',
          whatsappNumber: user.whatsappNumber || '+14155238886',
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
    }

    // ── 3. Standard login ────────────────────────────────────────────────────
    const { password } = body as { password: string };
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please switch to Sign Up.' },
        { status: 401 }
      );
    }

    // ── 4. Password verification with SHA-256 → bcrypt migration ─────────────
    let passwordValid = false;

    if (user.password) {
      if (isLegacySha256(user.password)) {
        // Legacy SHA-256 hash — verify with SHA-256 first
        const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
        if (sha256Hash === user.password) {
          passwordValid = true;
          // ── Migrate to bcrypt on successful login ──
          user.password = await bcrypt.hash(password, BCRYPT_ROUNDS);
          await user.save();
          logger.info('Migrated password from SHA-256 to bcrypt', {
            requestId,
            userId: user.id,
            route: '/api/auth/login',
          });
        }
      } else {
        // Modern bcrypt hash
        passwordValid = await bcrypt.compare(password, user.password);
      }
    } else {
      // Account had no password (e.g. demo account being given a password for first time)
      const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
      user.password = hashedPassword;
      await user.save();
      passwordValid = true;
    }

    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid password. Please try again.' }, { status: 401 });
    }

    // ── 5. Issue JWT cookie ───────────────────────────────────────────────────
    const token = await signToken({ uid: user.id, email: cleanEmail, isDemo: false });

    logger.info('Login successful', { requestId, userId: user.id, route: '/api/auth/login' });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isDemo: user.isDemo,
        archetype: user.archetype || 'Hackathon Warrior',
        cognitiveWindow: user.cognitiveWindow || 'Night Owl',
        whatsappNumber: user.whatsappNumber || '+14155238886',
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
    logger.error('Login API error', { requestId, route: '/api/auth/login', error: msg });
    return NextResponse.json({ error: 'Database authentication failed' }, { status: 500 });
  }
}
