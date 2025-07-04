<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { Button } from '$lib/components/ui/button';
	import { CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { HolographicCard } from '$lib/components/custom/holographic-card';
	import { fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { toast } from 'svelte-sonner';
	import { isTouchDevice } from '$lib/hooks/is-mobile.svelte';

	let { data } = $props<{ data: PageData }>();

	const { form, errors, enhance, message } = superForm(data.form, {
		taintedMessage: null
	});

	// Determine message type based on content
	let messageType = $derived(
		$message
			? $message.toLowerCase().includes('success') ||
				$message.toLowerCase().includes('welcome') ||
				$message.toLowerCase().includes('succesvol') ||
				$message.toLowerCase().includes('aangemaakt') ||
				$message.toLowerCase().includes('geregistreerd')
				? 'success'
				: 'error'
			: null
	);

	$effect(() => {
		if ($message) {
			if (messageType === 'success') {
				toast.success('Success', { description: $message });
			} else {
				toast.error('Error', { description: $message });
			}
		}
	});

	// Computed classes for message styling
	let messageClasses = $derived(
		messageType === 'success'
			? 'mb-4 relative overflow-hidden rounded-lg border backdrop-blur-sm bg-green-500/10 border-green-500/30'
			: messageType === 'error'
				? 'mb-4 relative overflow-hidden rounded-lg border backdrop-blur-sm bg-red-500/10 border-red-500/30'
				: 'mb-4 relative overflow-hidden rounded-lg border backdrop-blur-sm'
	);

	let gradientClasses = $derived(
		messageType === 'success'
			? 'absolute inset-0 opacity-20 bg-gradient-to-r from-green-400/20 to-emerald-400/20'
			: 'absolute inset-0 opacity-20 bg-gradient-to-r from-red-400/20 to-rose-400/20'
	);

	let textClasses = $derived(
		messageType === 'success'
			? 'text-sm font-medium flex-1 text-green-800 dark:text-green-200'
			: 'text-sm font-medium flex-1 text-red-800 dark:text-red-200'
	);

	// Input field classes with error states
	let usernameInputClasses = $derived(
		$errors.username
			? 'w-full rounded-md border border-red-500 bg-background/50 backdrop-blur-sm text-foreground shadow-lg hover:shadow-xl focus:shadow-2xl transform hover:-translate-y-0.5 focus:-translate-y-1 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-base px-3 py-2 transition-all duration-300'
			: 'w-full rounded-md border border-input bg-background/50 backdrop-blur-sm text-foreground shadow-lg hover:shadow-xl focus:shadow-2xl transform hover:-translate-y-0.5 focus:-translate-y-1 focus:border-primary focus:ring-2 focus:ring-primary/20 text-base px-3 py-2 transition-all duration-300'
	);

	let passwordInputClasses = $derived(
		$errors.password
			? 'w-full rounded-md border border-red-500 bg-background/50 backdrop-blur-sm text-foreground shadow-lg hover:shadow-xl focus:shadow-2xl transform hover:-translate-y-0.5 focus:-translate-y-1 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-base px-3 py-2 transition-all duration-300'
			: 'w-full rounded-md border border-input bg-background/50 backdrop-blur-sm text-foreground shadow-lg hover:shadow-xl focus:shadow-2xl transform hover:-translate-y-0.5 focus:-translate-y-1 focus:border-primary focus:ring-2 focus:ring-primary/20 text-base px-3 py-2 transition-all duration-300'
	);
</script>

<!-- Login form with holographic card -->
{#if !isTouchDevice.current}
	<HolographicCard class="w-full">
		<CardHeader class="space-y-4 pt-6 text-center">
			<div class="flex justify-center">
				<a href="##" class="text-foreground flex items-center gap-2 font-medium">
					<div
						class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md"
					>
						<GalleryVerticalEndIcon class="size-5" />
					</div>
					<span class="text-xl font-semibold">Sveltekit App</span>
				</a>
			</div>
			<CardTitle class="text-2xl font-bold">Welkom terug</CardTitle>
			<p class="text-muted-foreground">Meld je aan bij je account om door te gaan</p>
		</CardHeader>

		<CardContent>
			{#if $message}
				<div
					class={messageClasses}
					in:fly={{ y: -20, duration: 500, easing: cubicOut }}
					out:fly={{ y: -20, duration: 300, easing: cubicOut }}
				>
					<!-- Animated background gradient -->
					<div class={gradientClasses} in:scale={{ duration: 600, easing: cubicOut }}></div>

					<div class="relative flex items-center gap-3 p-4">
						<div class="flex-shrink-0" in:scale={{ duration: 400, delay: 200, easing: cubicOut }}>
							{#if messageType === 'success'}
								<CheckCircleIcon class="size-5 text-green-600 dark:text-green-400" />
							{:else}
								<AlertCircleIcon class="size-5 text-red-600 dark:text-red-400" />
							{/if}
						</div>

						<p class={textClasses} in:fly={{ x: 20, duration: 400, delay: 100, easing: cubicOut }}>
							{$message}
						</p>
					</div>
				</div>
			{/if}

			<form method="POST" action="?/login" use:enhance class="space-y-4">
				<div class="space-y-2">
					<label for="username" class="text-foreground text-sm font-medium">Gebruikersnaam</label>
					<input
						name="username"
						id="username"
						bind:value={$form.username}
						class={usernameInputClasses}
						type="text"
						placeholder="Voer je gebruikersnaam in"
						autocomplete="username"
						required
					/>
					{#if $errors.username}
						<p
							class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
							in:fly={{ y: -10, duration: 300, easing: cubicOut }}
						>
							<AlertCircleIcon class="size-4" />
							{$errors.username}
						</p>
					{/if}
				</div>

				<div class="space-y-2">
					<label for="password" class="text-foreground text-sm font-medium">Wachtwoord</label>
					<input
						type="password"
						name="password"
						id="password"
						bind:value={$form.password}
						class={passwordInputClasses}
						placeholder="Voer je wachtwoord in"
						autocomplete="current-password"
						required
					/>
					{#if $errors.password}
						<p
							class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
							in:fly={{ y: -10, duration: 300, easing: cubicOut }}
						>
							<AlertCircleIcon class="size-4" />
							{$errors.password}
						</p>
					{/if}
				</div>

				<div class="w-full">
					<Button type="submit" class="mt-6 w-full" size="lg">Aanmelden</Button>
				</div>
			</form>

			<div class="mt-6 text-center">
				<p class="text-muted-foreground text-sm">
					Nog geen account?
					<a
						href="/auth/register"
						class="text-primary hover:text-primary/90 font-medium underline underline-offset-4"
					>
						Maak er nu een aan
					</a>
				</p>
			</div>
		</CardContent>
	</HolographicCard>
{:else}
	<!-- Mobile version - same layout without holographic effects -->
	<div class="w-full bg-background/80 backdrop-blur-lg border shadow-lg relative overflow-hidden rounded-lg">
		<CardHeader class="space-y-4 pt-6 text-center">
			<div class="flex justify-center">
				<a href="##" class="text-foreground flex items-center gap-2 font-medium">
					<div
						class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md"
					>
						<GalleryVerticalEndIcon class="size-5" />
					</div>
					<span class="text-xl font-semibold">Sveltekit App</span>
				</a>
			</div>
			<CardTitle class="text-2xl font-bold">Welkom terug</CardTitle>
			<p class="text-muted-foreground">Meld je aan bij je account om door te gaan</p>
		</CardHeader>

		<CardContent>
			{#if $message}
				<div
					class={messageClasses}
					in:fly={{ y: -20, duration: 500, easing: cubicOut }}
					out:fly={{ y: -20, duration: 300, easing: cubicOut }}
				>
					<!-- Animated background gradient -->
					<div class={gradientClasses} in:scale={{ duration: 600, easing: cubicOut }}></div>

					<div class="relative flex items-center gap-3 p-4">
						<div class="flex-shrink-0" in:scale={{ duration: 400, delay: 200, easing: cubicOut }}>
							{#if messageType === 'success'}
								<CheckCircleIcon class="size-5 text-green-600 dark:text-green-400" />
							{:else}
								<AlertCircleIcon class="size-5 text-red-600 dark:text-red-400" />
							{/if}
						</div>

						<p class={textClasses} in:fly={{ x: 20, duration: 400, delay: 100, easing: cubicOut }}>
							{$message}
						</p>
					</div>
				</div>
			{/if}

			<form method="POST" action="?/login" use:enhance class="space-y-4">
				<div class="space-y-2">
					<label for="username" class="text-foreground text-sm font-medium">Gebruikersnaam</label>
					<input
						name="username"
						id="username"
						bind:value={$form.username}
						class={usernameInputClasses}
						type="text"
						placeholder="Voer je gebruikersnaam in"
						autocomplete="username"
						required
					/>
					{#if $errors.username}
						<p
							class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
							in:fly={{ y: -10, duration: 300, easing: cubicOut }}
						>
							<AlertCircleIcon class="size-4" />
							{$errors.username}
						</p>
					{/if}
				</div>

				<div class="space-y-2">
					<label for="password" class="text-foreground text-sm font-medium">Wachtwoord</label>
					<input
						type="password"
						name="password"
						id="password"
						bind:value={$form.password}
						class={passwordInputClasses}
						placeholder="Voer je wachtwoord in"
						autocomplete="current-password"
						required
					/>
					{#if $errors.password}
						<p
							class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
							in:fly={{ y: -10, duration: 300, easing: cubicOut }}
						>
							<AlertCircleIcon class="size-4" />
							{$errors.password}
						</p>
					{/if}
				</div>

				<div class="w-full">
					<Button type="submit" class="mt-6 w-full" size="lg">Aanmelden</Button>
				</div>
			</form>

			<div class="mt-6 text-center">
				<p class="text-muted-foreground text-sm">
					Nog geen account?
					<a
						href="/auth/register"
						class="text-primary hover:text-primary/90 font-medium underline underline-offset-4"
					>
						Maak er nu een aan
					</a>
				</p>
			</div>
		</CardContent>
	</div>
{/if}
