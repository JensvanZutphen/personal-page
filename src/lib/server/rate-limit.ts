import { dev } from '$app/environment';

interface RateLimitAttempt {
	count: number;
	firstAttempt: number;
	lastAttempt: number;
	blockedUntil?: number;
}

// In-memory store for rate limiting (in production, consider Redis)
const loginAttempts = new Map<string, RateLimitAttempt>();

// Rate limiting configuration - generous limits
const RATE_LIMIT_CONFIG = {
	// Allow 10 attempts per 15 minutes (generous for legitimate users)
	maxAttempts: 10,
	windowMs: 15 * 60 * 1000, // 15 minutes
	
	// After max attempts, block for 30 minutes (reasonable recovery time)
	blockDurationMs: 30 * 60 * 1000, // 30 minutes
	
	// Cleanup old entries every hour
	cleanupIntervalMs: 60 * 60 * 1000 // 1 hour
};

// Local addresses that should be excluded from rate limiting
const LOCAL_ADDRESSES = [
	'127.0.0.1',      // IPv4 localhost
	'::1',            // IPv6 localhost
	'::ffff:127.0.0.1', // IPv6-mapped IPv4 localhost
	'localhost',
	// Add common local network ranges
	/^192\.168\./,    // Private network 192.168.x.x
	/^10\./,          // Private network 10.x.x.x
	/^172\.1[6-9]\./,  // Private network 172.16.x.x
	/^172\.2[0-9]\./,  // Private network 172.20-29.x.x
	/^172\.3[0-1]\./,  // Private network 172.30-31.x.x
];

/**
 * Check if an IP address is local/private and should be excluded from rate limiting
 */
function isLocalAddress(ip: string): boolean {
	if (!ip) return false;
	
	return LOCAL_ADDRESSES.some(addr => {
		if (typeof addr === 'string') {
			return ip === addr;
		} else {
			// It's a RegExp
			return addr.test(ip);
		}
	});
}

/**
 * Get the real IP address from the request
 */
function getRealIpAddress(request: Request, headers: Record<string, string | undefined>): string {
	// Try various headers that proxies might set
	const possibleIps = [
		headers['x-forwarded-for']?.split(',')[0]?.trim(),
		headers['x-real-ip'],
		headers['cf-connecting-ip'], // Cloudflare
		headers['x-client-ip'],
		headers['x-forwarded'],
		headers['forwarded-for'],
		headers['forwarded']
	].filter(Boolean);
	
	// Return the first valid IP, fallback to a placeholder
	return possibleIps[0] || 'unknown';
}

/**
 * Clean up old rate limit entries to prevent memory leaks
 */
function cleanupOldEntries(): void {
	const now = Date.now();
	const cutoff = now - RATE_LIMIT_CONFIG.windowMs;
	
	for (const [ip, attempt] of loginAttempts.entries()) {
		// Remove entries that are outside the window and not currently blocked
		if (attempt.lastAttempt < cutoff && (!attempt.blockedUntil || attempt.blockedUntil < now)) {
			loginAttempts.delete(ip);
		}
	}
}

/**
 * Check if an IP address is currently rate limited
 */
export function isRateLimited(request: Request): { 
	isLimited: boolean; 
	remainingAttempts?: number; 
	resetTime?: number;
	reason?: string;
} {
	const headers = Object.fromEntries(request.headers.entries());
	const ip = getRealIpAddress(request, headers);
	
	// Skip rate limiting for local addresses
	if (isLocalAddress(ip)) {
		return { 
			isLimited: false, 
			reason: 'Local address excluded from rate limiting' 
		};
	}
	
	// Skip rate limiting in development mode for convenience
	if (dev) {
		return { 
			isLimited: false, 
			reason: 'Development mode - rate limiting disabled' 
		};
	}
	
	const now = Date.now();
	const attempt = loginAttempts.get(ip);
	
	if (!attempt) {
		// First attempt from this IP
		return { 
			isLimited: false, 
			remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts - 1 
		};
	}
	
	// Check if currently blocked
	if (attempt.blockedUntil && now < attempt.blockedUntil) {
		return {
			isLimited: true,
			resetTime: attempt.blockedUntil,
			reason: 'IP address temporarily blocked due to too many failed attempts'
		};
	}
	
	// Check if we're outside the rate limit window
	if (now - attempt.firstAttempt > RATE_LIMIT_CONFIG.windowMs) {
		// Reset the attempt counter
		return { 
			isLimited: false, 
			remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts - 1 
		};
	}
	
	// Check if we've exceeded the max attempts in the current window
	if (attempt.count >= RATE_LIMIT_CONFIG.maxAttempts) {
		// Block the IP
		attempt.blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs;
		return {
			isLimited: true,
			resetTime: attempt.blockedUntil,
			reason: `Too many failed login attempts. Try again after ${RATE_LIMIT_CONFIG.blockDurationMs / (60 * 1000)} minutes.`
		};
	}
	
	// Not rate limited yet
	return { 
		isLimited: false, 
		remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts - attempt.count 
	};
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(request: Request): void {
	const headers = Object.fromEntries(request.headers.entries());
	const ip = getRealIpAddress(request, headers);
	
	// Skip recording for local addresses and dev mode
	if (isLocalAddress(ip) || dev) {
		return;
	}
	
	const now = Date.now();
	const existing = loginAttempts.get(ip);
	
	if (!existing || now - existing.firstAttempt > RATE_LIMIT_CONFIG.windowMs) {
		// First attempt in a new window
		loginAttempts.set(ip, {
			count: 1,
			firstAttempt: now,
			lastAttempt: now
		});
	} else {
		// Increment existing attempt
		existing.count++;
		existing.lastAttempt = now;
	}
	
	// Cleanup old entries periodically
	if (Math.random() < 0.01) { // 1% chance to run cleanup
		cleanupOldEntries();
	}
}

/**
 * Record a successful login (resets the rate limit for this IP)
 */
export function recordSuccessfulAttempt(request: Request): void {
	const headers = Object.fromEntries(request.headers.entries());
	const ip = getRealIpAddress(request, headers);
	
	// Remove any existing rate limit data for this IP after successful login
	loginAttempts.delete(ip);
}

/**
 * Get current rate limit status for an IP (useful for debugging)
 */
export function getRateLimitStatus(request: Request): {
	ip: string;
	isLocal: boolean;
	attempts?: RateLimitAttempt;
	config: typeof RATE_LIMIT_CONFIG;
} {
	const headers = Object.fromEntries(request.headers.entries());
	const ip = getRealIpAddress(request, headers);
	
	return {
		ip,
		isLocal: isLocalAddress(ip),
		attempts: loginAttempts.get(ip),
		config: RATE_LIMIT_CONFIG
	};
} 