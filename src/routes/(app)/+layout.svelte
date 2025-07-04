<script lang="ts">
	import '../../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Sidebar from '$lib/components/sidebar-07/Sidebar.svelte';
	import AnimatedGradient from '$lib/components/custom/AnimatedGradient.svelte';
	import { page } from '$app/state';
	import { Spring, prefersReducedMotion } from 'svelte/motion';
	import { IsTouchDevice } from '$lib/hooks/is-mobile.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
	let mouseX = $state(50);
	let mouseY = $state(50);
	let contentWrapper: HTMLElement;

	// Mobile/touch device detection
	const isTouchDevice = new IsTouchDevice();

	// Sidebar state management
	let sidebarOpen = $state(true);

	// Page transition state
	let currentRoute = $derived(page.route?.id);
	let previousRoute = $state('');
	let transitionKey = $state(0);
	let contentVisible = $state(true);
	let showInitialAnimation = $state(true);

	// Optimized springs for page transitions
	const offsetSpring = new Spring(0, { stiffness: 0.3, damping: 0.9 });
	const opacitySpring = new Spring(1, { stiffness: 0.35, damping: 0.85 });
	const blurSpring = new Spring(0, { stiffness: 0.2, damping: 0.95 });
	const saturationSpring = new Spring(1, { stiffness: 0.25, damping: 0.9 });

	// Handle route changes for animations
	$effect(() => {
		const newRoute = currentRoute;
		if (prefersReducedMotion.current) return;

		// Only transition on actual route changes (not initial load)
		if (previousRoute && previousRoute !== newRoute) {
			// Auto-collapse sidebar on mobile after navigation
			if (isTouchDevice.current) {
				setTimeout(() => {
					sidebarOpen = false;
				}, 100);
			}

			// Hide new content immediately
			contentVisible = false;
			offsetSpring.set(25);
			opacitySpring.set(0);
			blurSpring.set(12);
			saturationSpring.set(0.5);

			// Start exit animation
			offsetSpring.target = 8;
			opacitySpring.target = 0;
			blurSpring.target = 4;
			saturationSpring.target = 0.85;

			// Navigate after fade-out
			setTimeout(() => {
				transitionKey += 1;
				contentVisible = false;
				offsetSpring.set(25);
				opacitySpring.set(0);
				blurSpring.set(12);
				saturationSpring.set(0.5);

				// Show new content and animate in
				setTimeout(() => {
					contentVisible = true;
					showInitialAnimation = true;

					setTimeout(() => {
						offsetSpring.target = 0;
						opacitySpring.target = 1;
						blurSpring.target = 0;
						saturationSpring.target = 1;

						// Disable animation after initial load
						setTimeout(() => {
							showInitialAnimation = false;
						}, 1000);
					}, 5);
				}, 10);
			}, 2);
		}

		previousRoute = newRoute || '';
	});

	// Derived styles for page content - simplified to reduce glitching
	let dynamicStyles = $derived(`
		transform: translateY(${offsetSpring.current}px);
		opacity: ${opacitySpring.current};
		visibility: ${contentVisible ? 'visible' : 'hidden'};
	`);

	function handleMouseMove(event: MouseEvent) {
		// Skip mouse tracking on mobile devices
		if (isTouchDevice.current || !contentWrapper) return;
		
		const rect = contentWrapper.getBoundingClientRect();
		mouseX = ((event.clientX - rect.left) / rect.width) * 100;
		mouseY = ((event.clientY - rect.top) / rect.height) * 100;
	}
</script>

<ModeWatcher />

<Toaster />

<Sidebar>
	<div
		class="main-content-wrapper"
		bind:this={contentWrapper}
		onmousemove={!isTouchDevice.current ? handleMouseMove : undefined}
		role="presentation"
	>
		{#if !isTouchDevice.current}
			<AnimatedGradient {mouseX} {mouseY} />
		{:else}
			<!-- Simple static background for touch devices -->
			<div class="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
		{/if}

		<div class="content-scroll-container">
			{#key transitionKey}
				<div
					class="page-content"
					class:initial-load-animation={showInitialAnimation}
					style={dynamicStyles}
				>
					{@render children()}
				</div>
			{/key}
		</div>
	</div>
</Sidebar>

<style>
	.main-content-wrapper {
		position: relative;
		height: 100%;
		overflow: hidden;
	}

	.content-scroll-container {
		position: absolute;
		inset: 0;
		overflow-y: auto;
		overflow-x: hidden;
		z-index: 10;
		padding: 0 1rem;
		contain: layout style paint;
	}

	.page-content {
		width: 100%;
		min-height: 100%;
		padding: 1.5rem 0;
		isolation: isolate;
		position: relative;
		z-index: 1;
	}

	/* Simplified card animations - less intrusive */
	.initial-load-animation :global(.card),
	.initial-load-animation :global([data-card-root]) {
		animation: pageEntranceRise 0.4s ease-out forwards;
		opacity: 0;
		transform: translateY(8px);
	}

	/* Reduced staggering for smoother experience */
	.initial-load-animation :global(.card:nth-child(1)),
	.initial-load-animation :global([data-card-root]:nth-child(1)) {
		animation-delay: 0.05s;
	}

	.initial-load-animation :global(.card:nth-child(2)),
	.initial-load-animation :global([data-card-root]:nth-child(2)) {
		animation-delay: 0.1s;
	}

	.initial-load-animation :global(.card:nth-child(3)),
	.initial-load-animation :global([data-card-root]:nth-child(3)) {
		animation-delay: 0.15s;
	}

	@keyframes pageEntranceRise {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive padding */
	@media (min-width: 768px) {
		.content-scroll-container {
			padding: 0 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.content-scroll-container {
			padding: 0 2rem;
		}
	}
</style>
