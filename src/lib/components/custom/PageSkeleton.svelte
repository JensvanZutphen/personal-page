<script lang="ts">
	type SectionType = {
		title?: boolean;
		content: 'cards' | 'table' | 'list' | 'form';
		items?: number;
	};

	type SkeletonConfig = {
		header?: boolean;
		statsCards?: number;
		sections?: SectionType[];
	};

	interface Props {
		show?: boolean;
		type?: 'dashboard' | 'table' | 'cards' | 'form' | 'marketing' | 'custom';
		customConfig?: SkeletonConfig;
	}

	let { show = false, type = 'dashboard', customConfig }: Props = $props();

	// Predefined skeleton configurations
	const configs: Record<string, SkeletonConfig> = {
		dashboard: {
			header: true,
			statsCards: 4,
			sections: [
				{ title: true, content: 'cards', items: 6 },
				{ title: true, content: 'table', items: 8 }
			]
		},
		marketing: {
			header: true,
			statsCards: 4,
			sections: [
				{ title: true, content: 'cards', items: 4 },
				{ title: true, content: 'table', items: 6 },
				{ title: true, content: 'table', items: 5 },
				{ title: true, content: 'list', items: 4 }
			]
		},
		table: {
			header: true,
			statsCards: 0,
			sections: [
				{ title: true, content: 'table', items: 10 }
			]
		},
		cards: {
			header: true,
			statsCards: 0,
			sections: [
				{ title: true, content: 'cards', items: 8 }
			]
		},
		form: {
			header: true,
			statsCards: 0,
			sections: [
				{ title: true, content: 'form', items: 6 }
			]
		},
		custom: customConfig || { header: true, statsCards: 0, sections: [] }
	};

	let config = $derived(configs[type] || configs.dashboard);
</script>

{#if show}
	<div class="page-skeleton space-y-8" role="status" aria-label="Loading page content">
		<!-- Header skeleton -->
		{#if config.header}
			<div class="skeleton-header"></div>
		{/if}
		
		<!-- Stats cards skeleton with realistic content -->
		{#if config.statsCards && config.statsCards > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each Array(config.statsCards) as _, i}
					<div class="skeleton-card min-h-32">
						<div class="skeleton-stats-content">
							<div class="skeleton-stats-title skeleton-animate" style="animation-delay: {i * 0.1}s"></div>
							<div class="skeleton-stats-number skeleton-animate" style="animation-delay: {i * 0.1 + 0.05}s"></div>
							<div class="skeleton-stats-subtitle skeleton-animate" style="animation-delay: {i * 0.1 + 0.1}s"></div>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Dynamic sections with enhanced layouts -->
		{#if config.sections}
			{#each config.sections as section, sectionIndex}
				<div class="space-y-6">
					<!-- Section title -->
					{#if section.title}
						<div class="skeleton-header" style="animation-delay: {sectionIndex * 0.2}s"></div>
					{/if}
					
					<!-- Section content based on type -->
					{#if section.content === 'cards'}
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{#each Array(section.items || 6) as _, i}
								<div class="skeleton-card min-h-40" style="animation-delay: {sectionIndex * 0.2 + i * 0.05}s">
									<div class="space-y-3">
										<div class="skeleton-animate h-5 w-3/4"></div>
										<div class="skeleton-animate h-4 w-full"></div>
										<div class="skeleton-animate h-4 w-5/6"></div>
										<div class="flex justify-between items-center mt-4">
											<div class="skeleton-animate h-4 w-1/3"></div>
											<div class="skeleton-animate h-6 w-16 rounded-full"></div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else if section.content === 'table'}
						<div class="space-y-3">
							<!-- Enhanced table header -->
							<div class="skeleton-table-header skeleton-animate" style="animation-delay: {sectionIndex * 0.2}s"></div>
							<!-- Table rows with staggered animation -->
							{#each Array(section.items || 5) as _, i}
								<div 
									class="skeleton-table-row skeleton-animate" 
									style="animation-delay: {sectionIndex * 0.2 + (i + 1) * 0.05}s; --delay: {(i + 1) * 0.05}s"
								></div>
							{/each}
						</div>
					{:else if section.content === 'list'}
						<div class="space-y-4">
							{#each Array(section.items || 4) as _, i}
								<div class="skeleton-card min-h-20" style="animation-delay: {sectionIndex * 0.2 + i * 0.1}s">
									<div class="flex items-center space-x-4">
										<div class="skeleton-animate h-12 w-12 rounded-full flex-shrink-0"></div>
										<div class="flex-1 space-y-2">
											<div class="skeleton-animate h-4 w-3/4"></div>
											<div class="skeleton-animate h-3 w-1/2"></div>
										</div>
										<div class="skeleton-animate h-8 w-20 rounded-full"></div>
									</div>
								</div>
							{/each}
						</div>
					{:else if section.content === 'form'}
						<div class="skeleton-card min-h-80" style="animation-delay: {sectionIndex * 0.2}s">
							<div class="space-y-6">
								{#each Array(section.items || 4) as _, i}
									<div class="space-y-2">
										<div class="skeleton-animate h-4 w-24" style="animation-delay: {sectionIndex * 0.2 + i * 0.1}s"></div>
										<div class="skeleton-animate h-11 w-full" style="animation-delay: {sectionIndex * 0.2 + i * 0.1 + 0.05}s"></div>
									</div>
								{/each}
								<div class="flex justify-end pt-4">
									<div class="skeleton-animate h-11 w-32 rounded-lg" style="animation-delay: {sectionIndex * 0.2 + 0.3}s"></div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
{/if}

<style>
	.page-skeleton {
		/* Ensure skeleton has proper positioning and visibility */
		position: relative;
		z-index: 1;
		width: 100%;
		min-height: 200px;
		padding: 1.5rem 0;
		animation: skeleton-fade-in 0.3s ease-out;
		/* Add smooth fade-out when disappearing */
		transition:
			opacity 0.3s ease-out,
			transform 0.3s ease-out;
	}

	.skeleton-animate {
		/* Use app.css color variables with fallbacks for visibility */
		background: linear-gradient(
			110deg,
			var(--muted) 8%,
			var(--card) 18%,
			var(--muted) 33%
		);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		border-radius: 0.75rem;
		width: 100%;
		display: block;
		border: 1px solid var(--border);
		position: relative;
		overflow: hidden;
	}

	.skeleton-animate::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, oklch(0 0 0 / 0.05), transparent);
		animation: skeleton-shine 2.5s ease-in-out infinite;
	}

	:global(.dark) .skeleton-animate::before {
		background: linear-gradient(90deg, transparent, oklch(1 0 0 / 0.1), transparent);
	}

	/* Enhanced header skeleton */
	.skeleton-header {
		height: 2.5rem;
		background-color: var(--muted);
		border-radius: 0.5rem;
		margin-bottom: 0.5rem;
		border: 1px solid var(--border);
		animation: skeleton-shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		overflow: hidden;
		position: relative;
	}

	/* Card skeletons with guaranteed visibility */
	.skeleton-card {
		background-color: var(--card);
		border: 1px solid var(--border);
		border-radius: 1rem;
		padding: 1.5rem;
		overflow: hidden;
		position: relative;
	}

	/* Table skeletons */
	.skeleton-table-header {
		height: 3rem;
		background-color: var(--muted);
		border-radius: 0.5rem;
		margin-bottom: 0.5rem;
		border: 1px solid var(--border);
		animation: skeleton-shimmer 1.5s cubic-bezier(0.4, 0.2, 0.2, 1) infinite;
	}

	.skeleton-table-row {
		height: 3rem;
		background-color: var(--card);
		border-radius: 0.375rem;
		border: 1px solid var(--border);
		animation: skeleton-shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		animation-delay: var(--delay, 0s);
	}

	/* Stats card content with visible colors */
	.skeleton-stats-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.skeleton-stats-title,
	.skeleton-stats-number,
	.skeleton-stats-subtitle {
		background-color: var(--muted);
		border-radius: 0.25rem;
		animation: skeleton-shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}

	.skeleton-stats-title {
		height: 1rem;
		width: 60%;
	}

	.skeleton-stats-number {
		height: 2rem;
		width: 40%;
		animation-delay: 0.1s;
	}

	.skeleton-stats-subtitle {
		height: 0.75rem;
		width: 70%;
		animation-delay: 0.2s;
	}

	/* Animations */
	@keyframes skeleton-fade-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes skeleton-shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	@keyframes skeleton-shine {
		0% {
			left: -100%;
		}
		100% {
			left: 100%;
		}
	}

	/* Responsive improvements */
	@media (max-width: 768px) {
		.page-skeleton {
			padding: 1rem 0;
		}
	}
</style> 