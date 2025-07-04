<script lang="ts">
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import BarChart3Icon from '@lucide/svelte/icons/bar-chart-3';
	import CommandIcon from '@lucide/svelte/icons/command';

	import type { ComponentProps } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import { page } from '$app/state';
	import DarkModeToggle from '$lib/components/custom/DarkModeToggle.svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	const { data: pageData } = $derived(page);

	const data = $derived({
		user: pageData.user ?? {
			name: 'Guest',
			email: 'guest@example.com',
			avatar: '/favicon.png'
		},
		navMain: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: BarChart3Icon,
				isActive: page.url.pathname.startsWith('/dashboard'),
				items: [
					{
						title: 'Overview',
						url: '/'
					}
				]
			},
			{
				title: 'Settings',
				url: '/settings',
				icon: SettingsIcon,
				isActive: page.url.pathname.startsWith('/settings'),
				items: [
					{
						title: 'User Settings',
						url: '/settings'
					}
				]
			}
		]
	});
</script>

<Sidebar.Root bind:ref {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="/" {...props}>
							<div
								class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<CommandIcon class="size-4" />
							</div>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-medium">SvelteKit Template</span>
								<span class="truncate text-xs">Superforms</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<div class="mt-auto flex justify-center">
			<DarkModeToggle />
		</div>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
</Sidebar.Root>
