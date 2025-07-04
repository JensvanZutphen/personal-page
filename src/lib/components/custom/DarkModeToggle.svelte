<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode, mode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	async function handleClick(event: MouseEvent) {
		if (!document.startViewTransition) {
			toggleMode();
			return;
		}

		const x = event.clientX;
		const y = event.clientY;
		const endRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y)
		);

		await document.startViewTransition(() => {
			document.documentElement.style.setProperty('--clip-x', `${x}px`);
			document.documentElement.style.setProperty('--clip-y', `${y}px`);
			document.documentElement.style.setProperty('--clip-radius', `${endRadius}px`);
			toggleMode();
		}).finished;

		document.documentElement.style.removeProperty('--clip-x');
		document.documentElement.style.removeProperty('--clip-y');
		document.documentElement.style.removeProperty('--clip-radius');
	}
</script>

<Button
	onclick={handleClick}
	variant="ghost"
	size="icon"
	class="relative overflow-hidden"
	aria-label="Toggle theme"
>
	<div
		class="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out {mode.current === 'dark' ? 'rotate-0' : '-rotate-90 scale-0'}"
	>
		<MoonIcon class="h-[1.2rem] w-[1.2rem]" />
	</div>
	<div
		class="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out {mode.current === 'dark' ? 'rotate-90 scale-0' : 'rotate-0'}"
	>
		<SunIcon class="h-[1.2rem] w-[1.2rem]" />
	</div>
	<span class="sr-only">Toggle theme</span>
</Button>

<style>
	:root {
		--clip-x: 50%;
		--clip-y: 50%;
		--clip-radius: 0px;
	}

	::view-transition-old(root) {
		animation: none;
	}

	::view-transition-new(root) {
		animation: reveal 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		clip-path: circle(var(--clip-radius) at var(--clip-x) var(--clip-y));
	}

	@keyframes reveal {
		from {
			clip-path: circle(0px at var(--clip-x) var(--clip-y));
		}
	}
</style> 