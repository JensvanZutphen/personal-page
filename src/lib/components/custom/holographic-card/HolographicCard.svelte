<script lang="ts">
	import { Spring, prefersReducedMotion } from 'svelte/motion';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/**
		 * Base intensity of the holographic effect (0-1)
		 * @default 1
		 */
		intensity?: number;
		/**
		 * Disable the parallax tilt effect
		 * @default false
		 */
		disableParallax?: boolean;
		/**
		 * Add a subtle noise overlay for texture
		 * @default false
		 */
		noise?: boolean;
		/**
		 * An array of color strings (e.g., hex, rgb) to define the holographic palette.
		 * @default (Full rainbow spectrum)
		 */
		palette?: string[];
		/**
		 * The color of the top-most glass-like glare effect.
		 * @default 'rgba(255, 255, 255, 0.1)'
		 */
		glareColor?: string;
		/**
		 * Custom spring configuration for responsiveness
		 * @default { stiffness: 0.1, damping: 0.6 }
		 */
		springConfig?: { stiffness: number; damping: number };
		/**
		 * Additional CSS classes for the card
		 */
		class?: string;
		/**
		 * Content to render inside the card
		 */
		children?: any;
	}

	let {
		intensity = 0.9,
		disableParallax = false,
		noise = true,
		palette,
		glareColor = 'rgba(255, 255, 255, 0.15)',
		springConfig = { stiffness: 0.5, damping: 0.5 },
		class: className,
		children,
		...restProps
	}: Props = $props();

	const noiseStyle = `background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="10" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>');`;

	// Default full-spectrum palette if none is provided
	const activePalette =
		palette || [
			'#FFD700', // Gold shimmer
			'#FF38A8', // Hot pink highlight
			'#4A90E2', // Electric blue
			'#8E24AA', // Vibrant purple
			'#00E676'  // Neon green
		];

	let mouseX = $state(50);
	let mouseY = $state(50);
	let cardWrapper: HTMLElement;

	// Springs for smooth motion tracking
	const springMouseX = new Spring(50, springConfig);
	const springMouseY = new Spring(50, springConfig);

	const hologramSpring = new Spring(
		{ x: 50, y: 50, rotation: 0, intensity: 0 },
		{ stiffness: 0.05, damping: 0.6 }
	);

	function handleMouseMove(event: MouseEvent) {
		if (!cardWrapper || prefersReducedMotion.current) return;

		// Restore original springiness on interaction
		hologramSpring.stiffness = 0.05;
		hologramSpring.damping = 0.6;

		const rect = cardWrapper.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		springMouseX.target = x;
		springMouseY.target = y;

		hologramSpring.target = {
			x: x,
			y: y,
			rotation: (x - 50) * 0.8,
			intensity: (Math.abs(x - 50) + Math.abs(y - 50)) / 150
		};
	}

	function handleMouseLeave() {
		if (prefersReducedMotion.current) return;
		springMouseX.target = 50;
		springMouseY.target = 50;
		// A slightly faster, snappier return by temporarily increasing stiffness
		hologramSpring.stiffness = 0.1;
		hologramSpring.damping = 0.5;
		hologramSpring.target = { x: 50, y: 50, rotation: 0, intensity: 0 };
	}

	let parallaxTransform = $derived(
		!disableParallax
			? `perspective(1000px) rotateX(${(springMouseY.current - 50) * -0.1}deg) rotateY(${
					(springMouseX.current - 50) * 0.1
				}deg) translateZ(0)`
			: 'none'
	);

	// Dynamically generate gradient stops from the palette
	const paletteStops = $derived(
		activePalette
			.map((color, i) => `${color} ${((i + 1) / activePalette.length) * 100}%`)
			.join(', ')
	);

	let holographicEffect = $derived(`
    radial-gradient(
      circle at ${hologramSpring.current.x}% ${hologramSpring.current.y}%,
      ${activePalette[0]}33 0%,
      ${activePalette[1]}22 40%,
      transparent 70%
    ),
    linear-gradient(
      ${hologramSpring.current.rotation}deg,
      ${paletteStops}
    )
  `);

	let borderHighlight = $derived(`
    radial-gradient(
      400px circle at ${hologramSpring.current.x}% ${hologramSpring.current.y}%,
      ${activePalette[0]}ff 0%,
      transparent 50%
    )
  `);

	let glareEffect = $derived(`
    linear-gradient(
      ${hologramSpring.current.rotation + 45}deg,
      transparent 40%,
      ${glareColor} 50%,
      transparent 60%
    )
  `);
</script>

<div
	bind:this={cardWrapper}
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
	class={cn('relative', className)}
	style="transform: {parallaxTransform}; transform-style: preserve-3d;"
	{...restProps}
>
	<div
		class="bg-background/80 backdrop-blur-lg border shadow-lg relative overflow-hidden rounded-lg w-full h-full"
		style="transform-style: preserve-3d;"
	>
		<!-- Main Holographic Layer -->
		<div
			class="absolute inset-0 pointer-events-none"
			style="
        background: {holographicEffect};
        opacity: {hologramSpring.current.intensity * intensity};
        mix-blend-mode: soft-light;
      "
		></div>

		<!-- Glare Layer -->
		<div
			class="absolute inset-0 pointer-events-none"
			style="
        background: {glareEffect};
        opacity: {hologramSpring.current.intensity * 0.8 * intensity};
        mix-blend-mode: screen;
      "
		></div>

		<!-- Dynamic Border Highlight -->
		<div
			class="absolute inset-[-1px] rounded-lg pointer-events-none"
			style="
        background: {borderHighlight};
        opacity: {hologramSpring.current.intensity * intensity};
        mask: linear-gradient(white, white) content-box, linear-gradient(white, white);
        -webkit-mask: linear-gradient(white, white) content-box, linear-gradient(white, white);
        mask-composite: xor;
        -webkit-mask-composite: xor;
      "
		></div>

		<!-- Optional Noise Layer -->
		{#if noise}
			<div
				class="absolute inset-0 pointer-events-none opacity-[0.03]"
				style={noiseStyle}
			></div>
		{/if}

		<!-- Content wrapper with proper z-index -->
		<div class="relative z-10 w-full h-full">
			{@render children()}
		</div>
	</div>
</div> 