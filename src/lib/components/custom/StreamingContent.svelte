<script lang="ts">
	import { fade, type TransitionConfig } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import PageSkeleton from './PageSkeleton.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/** The streaming promise from +page.server.ts */
		promise: Promise<any> | undefined | null;
		/** Skeleton type to show while loading */
		skeletonType?: 'dashboard' | 'table' | 'cards' | 'form' | 'marketing' | 'custom';
		/** Custom skeleton configuration */
		customSkeletonConfig?: any;
		/** The content to render when data is available */
		children: Snippet<[any]>;
		/** A slot for custom error messages */
		error?: Snippet<[{ error: any }]>;
	}

	let {
		promise,
		skeletonType = 'dashboard',
		customSkeletonConfig,
		children,
		error
	}: Props = $props();

	type State =
		| { status: 'pending'; data: null; error: null }
		| { status: 'success'; data: any; error: null }
		| { status: 'error'; data: null; error: any };

	let state: State = $state({ status: 'pending', data: null, error: null });

	// Custom transition to replicate the old animation
	function fadeAndSlide(
		node: Element,
		params?: { delay?: number; duration?: number; y?: number }
	): TransitionConfig {
		const { delay = 0, duration = 400, y = 12 } = params ?? {};
		return {
			delay,
			duration,
			easing: cubicOut,
			css: (t) => `
        opacity: ${t};
        transform: translateY(${y * (1 - t)}px);
      `
		};
	}

	$effect(() => {
		// A unique symbol for this promise instance to prevent race conditions
		const promiseInstance = promise;

		if (promiseInstance && typeof promiseInstance.then === 'function') {
			state = { status: 'pending', data: null, error: null };
			promiseInstance
				.then((result: any) => {
					// Only update state if this is still the current promise
					if (promise === promiseInstance) {
						state = { status: 'success', data: result, error: null };
					}
				})
				.catch((err: any) => {
					if (promise === promiseInstance) {
						console.error('Streaming data error:', err);
						state = { status: 'error', data: null, error: err };
					}
				});
		} else {
			// If no promise is provided, we are not in a loading state.
			state = { status: 'success', data: null, error: null };
		}
	});
</script>

{#if state.status === 'pending'}
	<div in:fadeAndSlide>
		<PageSkeleton type={skeletonType} customConfig={customSkeletonConfig} show={true} />
	</div>
{:else if state.status === 'success'}
	{#if state.data}
		<div in:fadeAndSlide>
			{@render children(state.data)}
		</div>
	{/if}
{:else if state.status === 'error'}
	<div transition:fade={{ duration: 150 }}>
		{#if error}
			{@render error({ error: state.error })}
		{:else}
			<!-- Default error UI if no slot is provided -->
			<div
				class="rounded-lg border bg-destructive/10 p-6 text-center text-destructive border-destructive/50"
			>
				<h3 class="font-semibold text-lg">Kon data niet laden</h3>
				<p class="mt-2 text-sm text-destructive/90">
					Er is iets misgegaan bij het ophalen van de gegevens. Probeer het later opnieuw.
				</p>
			</div>
		{/if}
	</div>
{/if}

<!-- 
  The old staggered animation for cards has been removed from this component.
  It made the component dependent on the structure of its children.
  For a more robust and reusable component, this type of orchestration should be
  handled by the parent view that uses StreamingContent.
--> 