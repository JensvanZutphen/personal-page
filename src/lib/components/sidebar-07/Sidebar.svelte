<script lang="ts">
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { breadcrumbs } from "$lib/stores/breadcrumbs.svelte";

	let { children } = $props();
</script>

<Sidebar.Provider class="h-screen">
	<AppSidebar />
	<Sidebar.Inset class="h-full">
		<header
			class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#each breadcrumbs as crumb, index}
							<Breadcrumb.Item>
								{#if crumb.href}
									<Breadcrumb.Link href={crumb.href}>{crumb.title}</Breadcrumb.Link>
								{:else}
									<Breadcrumb.Page>{crumb.title}</Breadcrumb.Page>
								{/if}
							</Breadcrumb.Item>
							{#if index < breadcrumbs.length - 1}
								<Breadcrumb.Separator />
							{/if}
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex flex-1 flex-col overflow-auto">
			{@render children?.()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
