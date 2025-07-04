import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import * as rateLimit from '$lib/server/rate-limit';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register']; // Add any other public routes here

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		const { session, user } = await auth.validateSessionToken(sessionToken);
		// The validateSessionToken function in auth.ts already handles refreshing the session.
		// It also handles deleting the session from DB if expired.
		// We just need to ensure the cookie is updated if the session was refreshed, or deleted if invalid.

		if (session) {
			// If session exists and was potentially refreshed by validateSessionToken,
			// ensure the cookie reflects the latest expiry.
			// validateSessionToken returns the session object which includes the (potentially updated) expiresAt.
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} else {
			// If session is null (invalid or expired and deleted by validateSessionToken), delete the cookie.
			auth.deleteSessionTokenCookie(event);
		}
		event.locals.user = user;
		event.locals.session = session;
	}

	// Route protection
	if (!event.locals.user && !PUBLIC_ROUTES.includes(event.url.pathname)) {
		// Also check if the route starts with /api or other non-page prefixes if necessary
		if (!event.url.pathname.startsWith('/api') && !event.url.pathname.startsWith('/_app/')) {
			return redirect(303, '/auth/login');
		}
	}

	// If user is logged in and tries to access login/register, redirect to home
	if (event.locals.user && PUBLIC_ROUTES.includes(event.url.pathname)) {
		return redirect(303, '/');
	}

	const response = await resolve(event);

	// --- Beveiligingsheaders toevoegen ---
	// Content Security Policy (CSP): Voorkomt XSS, maar staat SvelteKit toe om inline styles te gebruiken
	response.headers.set(
		'Content-Security-Policy',
		[ // Let op: pas aan voor strengere productiebehoeften
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline'",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data:",
			"font-src 'self' data:",
			"connect-src 'self' ws: wss:",
			"frame-ancestors 'self'",
			"object-src 'none'"
		].join('; ')
	);

	// Clickjacking bescherming
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');

	// Voorkom MIME sniffing
	response.headers.set('X-Content-Type-Options', 'nosniff');

	// Referrer Policy: minimale lek van navigatie-informatie
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	// HSTS: alleen in productie, forceer HTTPS
	if (!import.meta.env.DEV) {
		response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
	}

	// Extra XSS bescherming voor oudere browsers
	response.headers.set('X-XSS-Protection', '1; mode=block');

	return response;
};
