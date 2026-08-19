import { NextResponse } from 'next/server';
import { logger, generateRequestId } from '@/lib/logger';

/**
 * POST /api/auth/logout
 * Clears the samay_token httpOnly cookie, effectively ending the session.
 */
export async function POST(req: Request) {
  const requestId = generateRequestId();
  const userId = req.headers.get('x-user-id') ?? 'unknown';

  logger.info('User logout', { requestId, userId, route: '/api/auth/logout' });

  const response = NextResponse.json({ success: true });

  response.cookies.set('samay_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // immediately expires
    path: '/',
  });

  return response;
}
