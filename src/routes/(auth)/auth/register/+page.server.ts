import { fail, redirect } from '@sveltejs/kit';
import { superValidate, setMessage } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import * as auth from '$lib/server/auth';
import { prisma } from '$lib/server/db';
import { registerSchema } from '$lib/schemas';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	const form = await superValidate(zod(registerSchema));
	return { form };
};

export const actions: Actions = {
	register: async (event) => {
		console.log('=== REGISTER ACTION CALLED ===');

		const form = await superValidate(event, zod(registerSchema));
		if (!form.valid) {
			console.log('Form validation failed:', form.errors);
			return fail(400, { form });
		}

		const { username, password } = form.data;
		console.log(`Registration attempt for username: ${username}`);

		try {
			// Check if username already exists
			console.log('Checking if user already exists...');
			const existingUser = await prisma.user.findUnique({
				where: { username }
			});

			console.log(
				`User lookup result: ${existingUser ? 'FOUND - User exists!' : 'Not found - User available'}`
			);
			if (existingUser) {
				console.log(
					`Existing user details: ID=${existingUser.id}, Username=${existingUser.username}`
				);
			}

			if (existingUser) {
				console.log('Setting error message for duplicate username...');
				setMessage(form, 'Gebruikersnaam is al in gebruik. Kies een andere gebruikersnaam.');
				console.log('Error message set, returning fail(400)...');
				return fail(400, { form });
			}

			console.log('Username available, proceeding with user creation...');
			// Generate user ID and hash password
			const userId = auth.generateUserId();
			const passwordHash = await auth.hashPassword(password);

			// Create user in database
			console.log('Creating new user in database...');
			await prisma.user.create({
				data: {
					id: userId,
					username,
					passwordHash,
					role: 'USER',
					createdAt: new Date(),
					updatedAt: new Date()
				}
			});

			console.log(`New user registered successfully: ${username} (${userId})`);
		} catch (error: unknown) {
			console.error('=== REGISTRATION ERROR ===');
			console.error('Error details:', error);
			console.error('Error type:', typeof error);
			if (error && typeof error === 'object' && 'constructor' in error) {
				console.error('Error constructor:', error.constructor?.name);
			}
			console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');

			// Check if it's a database constraint error (e.g., duplicate username)
			if (error instanceof Error && error.message.includes('Unique constraint')) {
				console.log('Detected unique constraint violation, setting duplicate username error...');
				setMessage(form, 'Gebruikersnaam is al in gebruik. Kies een andere gebruikersnaam.');
				return fail(400, { form });
			}

			// Generic error for other failures
			console.log('Setting generic registration error...');
			setMessage(form, 'Registratie mislukt. Probeer het later opnieuw.');
			return fail(500, { form });
		}

		console.log('Registration successful, redirecting to login...');
		return redirect(302, '/auth/login?registered=true');
	}
};
