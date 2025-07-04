import type { RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { User, Session, User_role } from '@prisma/client'; // Prisma-generated types
import { nanoid } from 'nanoid'; // For generating session tokens and user IDs
import { dev } from '$app/environment';
// Import Node.js crypto for secure password hashing with scrypt
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SESSION_DURATION_MS = DAY_IN_MS * 30; // 30 days

export const sessionCookieName = 'auth-session';

// Scrypt parameters for secure password hashing
const SCRYPT_PARAMS = {
	N: 16384,  // CPU/memory cost parameter (2^14)
	r: 8,      // Block size parameter
	p: 1,      // Parallelization parameter
	keyLen: 64 // Key length in bytes
};

export function generateSessionToken() {
	return nanoid(32); // Generate a 32-character session token
}

export function generateUserId() {
	return nanoid(21); // Generate a 21-character user ID
}

// Secure password hashing using Node.js built-in scrypt
export async function hashPassword(password: string): Promise<string> {
	try {
		// Generate a random 32-byte salt
		const salt = randomBytes(32);
		
		// Use scryptSync for password hashing with secure parameters
		const derivedKey = scryptSync(password, salt, SCRYPT_PARAMS.keyLen, {
			N: SCRYPT_PARAMS.N,
			r: SCRYPT_PARAMS.r,
			p: SCRYPT_PARAMS.p
		});
		
		// Combine salt and derived key and encode as base64
		const combined = Buffer.concat([salt, derivedKey]);
		return combined.toString('base64');
	} catch (error) {
		console.error('Password hashing failed:', error);
		throw new Error('Failed to hash password');
	}
}

// Secure password verification using Node.js built-in scrypt
export async function verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
	try {
		// Input validation
		if (!hashedPassword || !plainPassword) {
			console.error('Password verification failed: Missing required parameters');
			return false;
		}

		// Decode the base64 hash
		const combined = Buffer.from(hashedPassword, 'base64');
		
		// Validate minimum hash length (32 bytes salt + 64 bytes key = 96 bytes minimum)
		if (combined.length < 96) {
			console.error('Password verification failed: Invalid hash format - insufficient length');
			return false;
		}
		
		// Extract salt (first 32 bytes) and stored key (remaining bytes)
		const salt = combined.subarray(0, 32);
		const storedKey = combined.subarray(32);
		
		// Derive key from plain password using the same salt and parameters
		const derivedKey = scryptSync(plainPassword, salt, SCRYPT_PARAMS.keyLen, {
			N: SCRYPT_PARAMS.N,
			r: SCRYPT_PARAMS.r,
			p: SCRYPT_PARAMS.p
		});
		
		// Validate that both buffers have the same length before comparison
		if (storedKey.length !== derivedKey.length) {
			console.error('Password verification failed: Key length mismatch');
			return false;
		}
		
		// Use timing-safe comparison to prevent timing attacks
		return timingSafeEqual(storedKey, derivedKey);
	} catch (error) {
		console.error('Password verification failed:', error);
		// Return false instead of throwing to prevent timing attacks
		return false;
	}
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
	const session = await prisma.session.create({
		data: {
			id: token, // Using the token itself as session ID for simplicity with Prisma
			userId,
			expiresAt
		}
	});
	return session;
}

export async function validateSessionToken(token: string): Promise<{ session: Session; user: User } | { session: null; user: null }> {
	try {
		const session = await prisma.session.findUnique({
			where: { id: token },
			include: { user: true }
		});

		if (!session) {
			return { session: null, user: null };
		}

		const now = new Date();
		const sessionExpiry = new Date(session.expiresAt);

		if (now >= sessionExpiry) {
			// Session expired, delete it
			await prisma.session.delete({ where: { id: token } });
			return { session: null, user: null };
		}

		// Check if session should be refreshed (if less than 15 days remaining)
		const sessionRefreshThreshold = 15 * DAY_IN_MS;
		const timeUntilExpiry = sessionExpiry.getTime() - now.getTime();

		if (timeUntilExpiry < sessionRefreshThreshold) {
			// Refresh session
			const newExpiresAt = new Date(now.getTime() + SESSION_DURATION_MS);
			const refreshedSession = await prisma.session.update({
				where: { id: token },
				data: { expiresAt: newExpiresAt },
				include: { user: true }
			});
			return { session: refreshedSession, user: { ...refreshedSession.user, role: refreshedSession.user.role as User_role } };
		}

		return { session, user: { ...session.user, role: session.user.role as User_role } };
	} catch (error) {
		console.error('Session validation failed:', error);
		return { session: null, user: null };
	}
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set(sessionCookieName, token, {
		path: '/',
		expires: expiresAt,
		httpOnly: true,
		secure: !dev, // Use secure cookies in production
		sameSite: 'lax' // CSRF protection
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set(sessionCookieName, '', {
		path: '/',
		maxAge: 0,
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax'
	});
}

export async function invalidateSession(sessionId: string): Promise<void> {
	try {
		await prisma.session.delete({ where: { id: sessionId } });
	} catch (error) {
		console.error('Failed to invalidate session:', error);
		// Don't throw error as this might be called during cleanup
	}
}

// Enhanced function to invalidate all user sessions (useful for security incidents)
export async function invalidateAllUserSessions(userId: string): Promise<void> {
	try {
		await prisma.session.deleteMany({ where: { userId } });
	} catch (error) {
		console.error('Failed to invalidate all user sessions:', error);
		throw new Error('Failed to invalidate sessions');
	}
}

// Function to clean up expired sessions (can be called periodically)
export async function cleanupExpiredSessions(): Promise<void> {
	try {
		const now = new Date();
		const deletedSessions = await prisma.session.deleteMany({
			where: {
				expiresAt: {
					lt: now
				}
			}
		});
		console.log(`Cleaned up ${deletedSessions.count} expired sessions`);
	} catch (error) {
		console.error('Failed to cleanup expired sessions:', error);
	}
}
