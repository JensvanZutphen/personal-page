<script lang="ts">
	import '../app.css';
	import { fade } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';

	let { children } = $props();
</script>

<!-- Home layout with smooth entrance -->
<div
	in:fade={{
		duration: 800,
		delay: 400,
		easing: quartOut
	}}
>
	{@render children()}
</div>
