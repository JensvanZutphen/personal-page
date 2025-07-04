import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) {
		return redirect(302, '/auth/login');
	}

	try {
		// Invalidate the session in the database
		await auth.invalidateSession(event.locals.session.id);
		console.log(`User logged out: session ${event.locals.session.id} invalidated`);
	} catch (error) {
		console.error('Error invalidating session during logout:', error);
		// Continue with logout even if session invalidation fails
	}

	// Always delete the session cookie, even if database cleanup failed
	auth.deleteSessionTokenCookie(event);

	return redirect(302, '/auth/login');
};
