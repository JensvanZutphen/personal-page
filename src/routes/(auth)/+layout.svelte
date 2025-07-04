<script lang="ts">
	import '../../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import DarkModeToggle from '$lib/components/custom/DarkModeToggle.svelte';
	import AnimatedGradient from '$lib/components/custom/AnimatedGradient.svelte';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { quartOut, quartIn } from 'svelte/easing';
	import { IsTouchDevice } from '$lib/hooks/is-mobile.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { children } = $props();

	// Mobile/touch device detection
	const isTouchDevice = new IsTouchDevice();

	// Mouse tracking for static background
	let mouseX = $state(50);
	let mouseY = $state(50);
	let contentWrapper: HTMLElement;

	function handleMouseMove(event: MouseEvent) {
		// Skip mouse tracking on mobile devices
		if (isTouchDevice.current || !contentWrapper) return;

		const rect = contentWrapper.getBoundingClientRect();
		mouseX = ((event.clientX - rect.left) / rect.width) * 100;
		mouseY = ((event.clientY - rect.top) / rect.height) * 100;
	}

	// Track the current route using page state
	let currentRoute = $derived(page.route.id);

	// Determine transition direction based on route change
	let isRegisterPage = $derived(currentRoute?.includes('register'));
	let isLoginPage = $derived(currentRoute?.includes('login'));
</script>

<ModeWatcher />
<Toaster />

<!-- Auth layout without sidebar - clean background container -->
<main
	class="bg-background text-foreground relative min-h-screen overflow-hidden"
	bind:this={contentWrapper}
	onmousemove={!isTouchDevice.current ? handleMouseMove : undefined}
	role="presentation"
>
	<!-- Static animated background -->
	<div class="absolute inset-0 z-0">
		{#if !isTouchDevice.current}
			<AnimatedGradient {mouseX} {mouseY} />
		{:else}
			<!-- Simple static background for touch devices -->
			<div class="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
		{/if}
	</div>

	<!-- Dark mode toggle -->
	<div class="absolute top-4 left-4 z-50">
		<DarkModeToggle />
	</div>

	<!-- Content with card transitions only -->
	<div class="relative z-10 flex h-full min-h-screen w-full items-center justify-center p-6">
		{#key currentRoute}
			<div
				class="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
				in:fly|global={{
					x: isRegisterPage ? -400 : isLoginPage ? 400 : 0,
					duration: 600,
					delay: 250,
					easing: quartOut
				}}
				out:fly|global={{
					x: isRegisterPage ? 400 : isLoginPage ? -400 : 500,
					opacity: 0.3,
					duration: 500,
					easing: quartIn
				}}
			>
				{@render children()}
			</div>
		{/key}
	</div>
</main>
