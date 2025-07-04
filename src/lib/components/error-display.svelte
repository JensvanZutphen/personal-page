<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	// import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-svelte';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Home from '@lucide/svelte/icons/home';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	interface Props {
		title?: string;
		message?: string;
		status?: number;
		showBackButton?: boolean;
		showRefreshButton?: boolean;
		showHomeButton?: boolean;
		onBack?: () => void;
		onRefresh?: () => void;
		onHome?: () => void;
		technicalDetails?: string;
	}

	let {
		title = 'Something went wrong',
		message = 'An unexpected error occurred. Please try again or contact support if the problem persists.',
		status,
		showBackButton = false,
		showRefreshButton = true,
		showHomeButton = true,
		onBack,
		onRefresh,
		onHome,
		technicalDetails
	}: Props = $props();

	function handleRefresh() {
		if (onRefresh) {
			onRefresh();
		} else {
			window.location.reload();
		}
	}

	function handleGoHome() {
		if (onHome) {
			onHome();
		} else {
			window.location.href = '/dashboard';
		}
	}

	function handleGoBack() {
		if (onBack) {
			onBack();
		} else {
			window.history.back();
		}
	}
</script>

<div class="flex min-h-[400px] items-center justify-center p-4">
	<Card class="w-full max-w-md text-center">
		<CardHeader class="pb-4">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
				<AlertTriangle class="h-8 w-8 text-destructive" />
			</div>
			<CardTitle class="text-2xl font-semibold text-foreground">
				{title}
			</CardTitle>
			{#if status}
				<p class="text-lg font-medium text-muted-foreground">Error {status}</p>
			{/if}
		</CardHeader>
		<CardContent class="space-y-6">
			<p class="text-muted-foreground leading-relaxed">
				{message}
			</p>
			
			<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
				{#if showBackButton}
					<Button variant="outline" onclick={handleGoBack} class="flex items-center gap-2">
						<ArrowLeft class="h-4 w-4" />
						Go Back
					</Button>
				{/if}
				
				{#if showHomeButton}
					<Button onclick={handleGoHome} class="flex items-center gap-2">
						<Home class="h-4 w-4" />
						Go to Dashboard
					</Button>
				{/if}
				
				{#if showRefreshButton}
					<Button variant="outline" onclick={handleRefresh} class="flex items-center gap-2">
						<RefreshCw class="h-4 w-4" />
						Try Again
					</Button>
				{/if}
			</div>

			{#if technicalDetails}
				<details class="text-left">
					<summary class="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
						Technical Details
					</summary>
					<div class="mt-2 rounded-md bg-muted p-3 text-sm font-mono text-muted-foreground">
						{technicalDetails}
					</div>
				</details>
			{/if}
		</CardContent>
	</Card>
</div> 