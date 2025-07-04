import { fail, redirect } from '@sveltejs/kit';
import { superValidate, setMessage } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import * as auth from '$lib/server/auth';
import * as rateLimit from '$lib/server/rate-limit';
import { prisma } from '$lib/server/db';
import { loginSchema } from '$lib/schemas';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}

	const form = await superValidate(zod(loginSchema));

	// Check if user was redirected from successful registration
	const registered = event.url.searchParams.get('registered');
	if (registered === 'true') {
		setMessage(form, 'Account succesvol aangemaakt! Je kunt nu inloggen met je nieuwe account.');
	}

	return { form };
};

export const actions: Actions = {
	login: async (event) => {
		console.log('Login action called');

		// Check rate limiting first, before any processing
		const rateLimitStatus = rateLimit.isRateLimited(event.request);
		if (rateLimitStatus.isLimited) {
			console.log('Login attempt rate limited:', rateLimitStatus.reason);
			const form = await superValidate(event, zod(loginSchema));
			setMessage(form, rateLimitStatus.reason || 'Te veel inlogpogingen. Probeer het later opnieuw.');
			return fail(429, { form }); // 429 Too Many Requests
		}

		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) {
			console.log('Form validation failed:', form.errors);
			rateLimit.recordFailedAttempt(event.request);
			return fail(400, { form });
		}

		const { username, password } = form.data;
		console.log(`Login attempt for username: ${username}`);

		try {
			// Look up user by username
			const existingUser = await prisma.user.findUnique({
				where: { username },
				select: {
					id: true,
					username: true,
					passwordHash: true,
					isActive: true,
					lastLogin: true
				}
			});

			console.log(`User lookup result: ${existingUser ? 'Found' : 'Not found'}`);

			// Check if user exists and is active first
			if (!existingUser || !existingUser.isActive) {
				console.log('User not found or inactive');
				rateLimit.recordFailedAttempt(event.request);
				// Use generic error message to prevent username enumeration
				setMessage(
					form,
					'Ongeldige gebruikersnaam of wachtwoord. Controleer je gegevens en probeer opnieuw.'
				);
				return fail(400, { form });
			}

			// Only verify password if user exists and is active
			console.log('Verifying password...');
			const isValidPassword = await auth.verifyPassword(existingUser.passwordHash, password);
			console.log(`Password verification result: ${isValidPassword}`);

			if (!isValidPassword) {
				console.log('Invalid password');
				rateLimit.recordFailedAttempt(event.request);
				setMessage(
					form,
					'Ongeldige gebruikersnaam of wachtwoord. Controleer je gegevens en probeer opnieuw.'
				);
				return fail(400, { form });
			}

			// Update last login timestamp
			console.log('Updating last login...');
			await prisma.user.update({
				where: { id: existingUser.id },
				data: { lastLogin: new Date() }
			});

			// Create new session
			console.log('Creating session...');
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, existingUser.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			// Record successful login (clears rate limiting for this IP)
			rateLimit.recordSuccessfulAttempt(event.request);
			console.log(`User logged in successfully: ${existingUser.username} (${existingUser.id})`);
		} catch (error) {
			console.error('Login error:', error);
			rateLimit.recordFailedAttempt(event.request);

			// Don't reveal specific error details to prevent information leakage
			setMessage(form, 'Inloggen mislukt. Probeer het later opnieuw.');
			return fail(500, { form });
		}

		console.log('Redirecting to home page...');
		return redirect(302, '/');
	}
};
