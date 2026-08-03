/**
 * JWT helpers using `jose` — a pure JS library that is fully compatible with
 * the Next.js Edge runtime (middleware) as well as the Node.js runtime (API routes).
 *
 * `jsonwebtoken` requires Node.js `crypto` and CANNOT be used in middleware.
 * `jose` uses the Web Crypto API which is available in both runtimes.
 */
import { SignJWT, jwtVerify } from 'jose';

const JWT_EXPIRY = '7d';

export interface JWTPayload {
  uid: string;
  email?: string;
  isDemo?: boolean;
}

/**
 * Encode the JWT_SECRET as a Uint8Array for jose (required by the Web Crypto API).
 * The secret is read at call-time so it picks up env vars in both Edge and Node runtimes.
 */
function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'samaype-dev-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

/**
 * Sign a JWT for the given user payload.
 * Returns a compact JWS string (e.g. "eyJ...").
 */
export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getSecret());
}

/**
 * Verify a JWT and return its payload, or null if invalid/expired.
 * Safe to call from both Edge middleware and Node.js API routes.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      uid: payload['uid'] as string,
      email: payload['email'] as string | undefined,
      isDemo: payload['isDemo'] as boolean | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Parse the samay_token cookie from a Cookie header string.
 */
export function getTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').find(c => c.trim().startsWith('samay_token='));
  return match ? match.split('=').slice(1).join('=').trim() : null;
}
