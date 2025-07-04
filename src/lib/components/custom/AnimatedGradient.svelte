<script lang="ts">
	import { fade } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	let { mouseX = 50, mouseY = 50 } = $props<{ mouseX?: number; mouseY?: number }>();
	let mounted = $state(false);

	$effect(() => {
		mounted = true;
	});
</script>

<!-- Background Visual Effects Only -->
<div 
	class="background-layer absolute inset-0 z-0" 
	in:fade={{ duration: 800, easing: quintOut }}
	role="presentation"
>
	<div class="absolute inset-0 bg-gradient-radial opacity-70"></div>

	<div class="shape-container">
		<div class="shape shape-1"></div>
		<div class="shape shape-2"></div>
		<div class="shape shape-3"></div>
		<div class="shape shape-4"></div>
		<div class="shape shape-5"></div>
	</div>

	<div 
		class="grid-pattern"
		style="--mouse-x: {mouseX}; --mouse-y: {mouseY};"
	></div>
</div>

<style>
	.background-layer {
		background-color: var(--background);
		color: var(--foreground);
		overflow: hidden;
	}

	/* Particle Animation */
	/* .particles {
		position: absolute;
		inset: 0;
		pointer-events: none;
		width: 100%;
	}

	.particle {
		position: absolute;
		border-radius: 9999px;
		width: var(--size);
		height: var(--size);
		background-color: var(--primary);
		opacity: 0.8;
		animation: particles 12s linear infinite;
		animation-delay: var(--delay);
		filter: blur(0.5px);
		left: var(--x-pos, 50%);
		box-shadow: 0 0 10px var(--primary);
	} */

	@keyframes particles {
		0% {
			opacity: 0;
			top: 100%;
			transform: translateX(0) scale(0.5);
		}
		10% {
			opacity: 0.8;
		}
		90% {
			opacity: 0.6;
		}
		100% {
			opacity: 0;
			top: -10%;
			transform: translateX(20px) scale(1.2);
		}
	}

	/* Grid Pattern */
	.grid-pattern {
		position: absolute;
		inset: 0;
		opacity: calc(0.2 + (var(--mouse-x, 50) / 100) * 0.008);
		background-size: 30px 30px;
		background-image:
			linear-gradient(
				to right,
				var(--primary) 1px,
				transparent 1px
			),
			linear-gradient(
				to bottom,
				var(--primary) 1px,
				transparent 1px
			);
		mask-image: radial-gradient(
			ellipse 800px 600px at calc(var(--mouse-x, 50) * 1%) calc(var(--mouse-y, 50) * 1%),
			black 0%,
			rgba(0, 0, 0, 0.4) 30%,
			rgba(0, 0, 0, 0.2) 50%,
			rgba(0, 0, 0, 0.1) 70%,
			transparent 85%
		);
		transition: opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transform: translate(
			calc((var(--mouse-x, 50) - 50) * 0.003px), 
			calc((var(--mouse-y, 50) - 50) * 0.003px)
		);
	}

	/* Shape Styles */
	.shape-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		z-index: 0;
	}

	.shape {
		position: absolute;
		border-radius: 9999px;
		background-color: var(--primary);
		filter: blur(20px);
		animation: move 30s linear infinite;
		box-shadow: 
			0 0 50px var(--primary),
			inset 0 0 50px var(--primary);
	}

	.shape-1 {
		opacity: 0.08;
		width: 600px;
		height: 600px;
		top: -150px;
		left: -150px;
		animation: move 40s ease-in-out infinite;
		animation-delay: -5s;
	}

	.shape-2 {
		opacity: 0.08;
		width: 500px;
		height: 500px;
		bottom: -100px;
		right: -100px;
		animation: move2 45s ease-in-out infinite;
		animation-delay: -10s;
	}

	.shape-3 {
		opacity: 0.06;
		width: 400px;
		height: 400px;
		bottom: 50px;
		left: 25%;
		animation: move3 50s ease-in-out infinite;
		animation-delay: -15s;
	}

	.shape-4 {
		opacity: 0.05;
		width: 300px;
		height: 300px;
		top: 35%;
		left: 5%;
		animation: move 35s ease-in-out infinite;
		animation-delay: -20s;
		border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
	}

	.shape-5 {
		opacity: 0.05;
		width: 350px;
		height: 350px;
		top: 25%;
		right: 5%;
		animation: move2 38s ease-in-out infinite;
		animation-delay: -25s;
		border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
	}

	@keyframes move {
		0% {
			transform: translate(0, 0) rotate(0deg) scale(1);
		}
		25% {
			transform: translate(8%, 8%) rotate(90deg) scale(1.2);
		}
		50% {
			transform: translate(0, 15%) rotate(180deg) scale(1.1);
		}
		75% {
			transform: translate(-8%, 8%) rotate(270deg) scale(0.9);
		}
		100% {
			transform: translate(0, 0) rotate(360deg) scale(1);
		}
	}

	@keyframes move2 {
		0% {
			transform: translate(0, 0) rotate(0deg) scale(1);
		}
		33% {
			transform: translate(-10%, 5%) rotate(120deg) scale(1.3);
		}
		66% {
			transform: translate(10%, -5%) rotate(240deg) scale(0.8);
		}
		100% {
			transform: translate(0, 0) rotate(360deg) scale(1);
		}
	}

	@keyframes move3 {
		0% {
			transform: translate(0, 0) rotate(0deg) scale(1);
		}
		20% {
			transform: translate(5%, -12%) rotate(72deg) scale(0.8);
		}
		40% {
			transform: translate(12%, 0%) rotate(144deg) scale(1.2);
		}
		60% {
			transform: translate(0%, 12%) rotate(216deg) scale(1.1);
		}
		80% {
			transform: translate(-12%, 0%) rotate(288deg) scale(0.9);
		}
		100% {
			transform: translate(0, 0) rotate(360deg) scale(1);
		}
	}

	/* Background Gradient */
	.bg-gradient-radial {
		background: radial-gradient(
			circle at 50% 50%,
			var(--primary) 0%,
			transparent 80%
		);
		opacity: 0.03;
		animation: pulse-glow 8s ease-in-out infinite alternate;
	}

	@keyframes pulse-glow {
		0%,
		100% {
			opacity: 0.05;
			transform: scale(1);
		}
		50% {
			opacity: 0.08;
			transform: scale(1.3);
		}
	}

	:global(.dark) .shape-1,
	:global(.dark) .shape-2 {
		opacity: 0.12;
	}
	:global(.dark) .shape-3 {
		opacity: 0.1;
	}
	:global(.dark) .shape-4,
	:global(.dark) .shape-5 {
		opacity: 0.09;
	}

	:global(.dark) .grid-pattern {
		opacity: calc(0.5 + (var(--mouse-x, 50) / 100) * 0.01);
	}

	:global(.dark) .bg-gradient-radial {
		animation-name: pulse-glow-dark;
	}

	@keyframes pulse-glow-dark {
		0%,
		100% {
			opacity: 0.1;
			transform: scale(1);
		}
		50% {
			opacity: 0.15;
			transform: scale(1.3);
		}
	}
</style>