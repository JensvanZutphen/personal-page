<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';
	import HomeIcon from '@lucide/svelte/icons/home';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';

	interface Props {
		data?: {
			status?: number;
			error?: {
				message?: string;
			};
		};
	}

	let { data }: Props = $props();

	// Get error details from props
	let status = $state(data?.status || 500);
	let errorMessage = $state(data?.error?.message);

	// Error message mapping
	let errorTitle = $derived(getErrorTitle(status));
	let displayMessage = $derived(getErrorMessage(status, errorMessage));

	function getErrorTitle(status: number): string {
		switch (status) {
			case 404:
				return 'Page Not Found';
			case 403:
				return 'Access Forbidden';
			case 500:
				return 'Internal Server Error';
			case 503:
				return 'Service Unavailable';
			default:
				return 'Something went wrong';
		}
	}

	function getErrorMessage(status: number, message?: string): string {
		switch (status) {
			case 404:
				return 'The page you are looking for does not exist or has been moved.';
			case 403:
				return 'You do not have permission to access this resource.';
			case 500:
				return 'An unexpected error occurred on our servers. Please try again later.';
			case 503:
				return 'The service is temporarily unavailable. Please try again in a few minutes.';
			default:
				return (
					message ||
					'An unexpected error occurred. Please try again or contact support if the problem persists.'
				);
		}
	}

	function handleRefresh() {
		window.location.reload();
	}

	function handleGoHome() {
		window.location.href = '/dashboard';
	}
</script>

<div class="flex min-h-svh items-center justify-center p-4">
	<Card class="w-full max-w-md text-center">
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
				<p class="text-muted-foreground text-lg font-medium">Error {status}</p>
			{/if}
		</CardHeader>
		<CardContent class="space-y-6">
			<p class="text-muted-foreground leading-relaxed">
				{displayMessage}
			</p>

			<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
				<Button onclick={handleGoHome} class="flex items-center gap-2">
					<HomeIcon class="h-4 w-4" />
					Go to Dashboard
				</Button>
				<Button variant="outline" onclick={handleRefresh} class="flex items-center gap-2">
					<RefreshCwIcon class="h-4 w-4" />
					Try Again
				</Button>
			</div>

			{#if errorMessage && status !== 404 && status !== 403}
				<details class="text-left">
					<summary class="text-muted-foreground hover:text-foreground cursor-pointer text-sm">
						Technical Details
					</summary>
					<div class="bg-muted text-muted-foreground mt-2 rounded-md p-3 font-mono text-sm">
						{errorMessage}
					</div>
				</details>
			{/if}
		</CardContent>
	</Card>
</div>
