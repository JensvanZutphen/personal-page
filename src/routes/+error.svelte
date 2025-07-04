<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';
	import HomeIcon from '@lucide/svelte/icons/home';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import AnimatedGradient from '$lib/components/custom/AnimatedGradient.svelte';

	interface Props {
		data?: {
			status?: number;
			error?: {
				message?: string;
			};
		};
	}

	let { data }: Props = $props();

	// Get error details safely
	let status = $state(data?.status || 500);
	let errorMessage = $state(data?.error?.message);

	// Error message mapping in Dutch
	let errorTitle = $derived(getErrorTitle(status));
	let displayMessage = $derived(getErrorMessage(status, errorMessage));

	function getErrorTitle(status: number): string {
		switch (status) {
			case 404:
				return 'Pagina Niet Gevonden';
			case 403:
				return 'Toegang Geweigerd';
			case 500:
				return 'Server Fout';
			case 503:
				return 'Service Niet Beschikbaar';
			default:
				return 'Er is iets misgegaan';
		}
	}

	function getErrorMessage(status: number, message?: string): string {
		switch (status) {
			case 404:
				return 'De pagina die u zoekt bestaat niet of is verplaatst.';
			case 403:
				return 'U heeft geen toestemming om deze pagina te bekijken.';
			case 500:
				return 'Er is een onverwachte fout opgetreden op onze servers. Probeer het later opnieuw.';
			case 503:
				return 'De service is tijdelijk niet beschikbaar. Probeer het over een paar minuten opnieuw.';
			default:
				return (
					message ||
					'Er is een onverwachte fout opgetreden. Probeer het opnieuw of neem contact op met de ondersteuning.'
				);
		}
	}

	function handleRefresh() {
		window.location.reload();
	}

	function handleGoHome() {
		window.location.href = '/';
	}

	// Mouse tracking for animated gradient
	let mouseX = $state(50);
	let mouseY = $state(50);

	function handleMouseMove(event: MouseEvent) {
		if (typeof window !== 'undefined') {
			mouseX = (event.clientX / window.innerWidth) * 100;
			mouseY = (event.clientY / window.innerHeight) * 100;
		}
	}
</script>

<svelte:window on:mousemove={handleMouseMove} />

<div class="relative flex min-h-svh items-center justify-center overflow-hidden p-4">
	<!-- Animated Background -->
	<AnimatedGradient {mouseX} {mouseY} />

	<!-- Error Content -->
	<div class="relative z-10">
		<Card class="bg-background/80 border-border/50 w-full max-w-md text-center backdrop-blur-sm">
			<CardHeader class="pb-4">
				<div
					class="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
				>
					<AlertTriangleIcon class="text-destructive h-8 w-8" />
				</div>
				<CardTitle class="text-foreground text-2xl font-semibold">
					{errorTitle}
				</CardTitle>
				{#if status}
					<p class="text-muted-foreground text-lg font-medium">Fout {status}</p>
				{/if}
			</CardHeader>
			<CardContent class="space-y-6">
				<p class="text-muted-foreground leading-relaxed">
					{displayMessage}
				</p>

				<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button onclick={handleGoHome} class="flex items-center gap-2">
						<HomeIcon class="h-4 w-4" />
						Naar Startpagina
					</Button>
					<Button variant="outline" onclick={handleRefresh} class="flex items-center gap-2">
						<RefreshCwIcon class="h-4 w-4" />
						Opnieuw Proberen
					</Button>
				</div>

				{#if errorMessage && status !== 404 && status !== 403}
					<details class="text-left">
						<summary class="text-muted-foreground hover:text-foreground cursor-pointer text-sm">
							Technische Details
						</summary>
						<div class="bg-muted/80 text-muted-foreground mt-2 rounded-md p-3 font-mono text-sm">
							{errorMessage}
						</div>
					</details>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
