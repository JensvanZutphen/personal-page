<script lang="ts">
	import { goto } from '$app/navigation';
	import { prefersReducedMotion } from 'svelte/motion';

	let { 
		href, 
		children, 
		class: className = '', 
		...restProps 
	} = $props();

	async function handleNavigate(event: MouseEvent) {
		if (prefersReducedMotion.current || !document.startViewTransition) {
			goto(href);
			return;
		}

		const x = event.clientX;
		const y = event.clientY;
		const endRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y)
		);

		document.documentElement.classList.add('is-ripple-navigating');
		const transition = document.startViewTransition(() => {
			document.documentElement.style.setProperty('--clip-x', `${x}px`);
			document.documentElement.style.setProperty('--clip-y', `${y}px`);
			document.documentElement.style.setProperty('--clip-radius', `${endRadius}px`);
			return goto(href);
		});

		try {
			await transition.finished;
		} finally {
			document.documentElement.classList.remove('is-ripple-navigating');
			document.documentElement.style.removeProperty('--clip-x');
			document.documentElement.style.removeProperty('--clip-y');
			document.documentElement.style.removeProperty('--clip-radius');
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={handleNavigate} class="navigation-ripple-trigger {className}" {...restProps}>
	{@render children()}
</div>

<style>
	.navigation-ripple-trigger {
		cursor: pointer;
		display: inline-block;
	}

	@keyframes reveal {
		from {
			clip-path: circle(0px at var(--clip-x) var(--clip-y));
		}
	}
</style> 