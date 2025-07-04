<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// This page should redirect immediately via the server load function
		// If we reach here, redirect manually as fallback
		setTimeout(() => {
			window.location.href = '/auth/login';
		}, 1000);
	});
</script>

<div class="flex min-h-svh items-center justify-center">
	<div class="text-center">
		<h1 class="text-foreground mb-4 text-2xl font-semibold">Logging out...</h1>
		<p class="text-muted-foreground">Please wait while we log you out.</p>
	</div>
</div>
