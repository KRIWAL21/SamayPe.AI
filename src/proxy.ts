import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getTokenFromCookieHeader } from '@/lib/auth';

/**
 * Next.js 16 Proxy (formerly "middleware") — runs before every matched request.
 *
 * In Next.js 16, the file convention changed from `middleware.ts` to `proxy.ts`
 * and the exported function from `middleware` to `proxy`.
 * Proxy now defaults to the Node.js runtime (not Edge).
 * See: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 *
 * Uses `jose` for JWT verification — Edge-compatible Web Crypto API, works in
 * both Node.js and Edge runtimes.
 *
 * Responsibilities:
 *  1. JWT verification on all /api/* routes except /api/auth/*
 *  2. Injects verified `x-user-id` header so route handlers never trust
 *     client-supplied userId values (closes IDOR vulnerability).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Allow auth routes and health check through without a token ────────────
  if (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/api/health'
  ) {
    return NextResponse.next();
  }

  // ── Only protect /api/* routes ─────────────────────────────────────────────
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // ── Extract and verify JWT from httpOnly cookie ────────────────────────────
  const cookieHeader = request.headers.get('cookie');
  const token = getTokenFromCookieHeader(cookieHeader);

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required. Please log in.' },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Session expired or invalid. Please log in again.' },
      { status: 401 }
    );
  }

  // ── Inject verified uid into request headers ───────────────────────────────
  // Route handlers read: request.headers.get('x-user-id')
  // This is the ONLY trusted source of userId in the application.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.uid);
  requestHeaders.set('x-user-email', payload.email ?? '');
  requestHeaders.set('x-user-is-demo', payload.isDemo ? 'true' : 'false');

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/api/:path*'],
};
