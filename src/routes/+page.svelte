<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import AnimatedGradient from '$lib/components/custom/AnimatedGradient.svelte';
	import RippleNavigate from '$lib/components/custom/RippleNavigate.svelte';
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import UsersIcon from '@lucide/svelte/icons/users';
	import BarChart3Icon from '@lucide/svelte/icons/bar-chart-3';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import DatabaseIcon from '@lucide/svelte/icons/database';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import DarkModeToggle from '$lib/components/custom/DarkModeToggle.svelte';
	import CheckSquareIcon from '@lucide/svelte/icons/check-square';

	let mouseX = $state(50);
	let mouseY = $state(50);
	let contentWrapper: HTMLElement;

	function handleMouseMove(event: MouseEvent) {
		if (!contentWrapper) return;

		const rect = contentWrapper.getBoundingClientRect();
		mouseX = ((event.clientX - rect.left) / rect.width) * 100;
		mouseY = ((event.clientY - rect.top) / rect.height) * 100;
	}
</script>

<div class="absolute top-20 left-4 z-50 flex justify-start p-4">
	<DarkModeToggle />
</div>
<div
	class="home-page relative min-h-screen overflow-hidden"
	bind:this={contentWrapper}
	onmousemove={handleMouseMove}
	role="presentation"
>
	<!-- Animated Background -->
	<AnimatedGradient {mouseX} {mouseY} />

	<!-- Content -->
	<div class="relative z-10">
		<!-- Navigation -->
		<nav class="flex items-center justify-between p-6 lg:px-10">
			<a href="/" class="flex items-center gap-2 text-2xl font-bold">
				<div
					class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg"
				>
					<img src="/favicon.png" alt="Sveltekit App" class="size-6 rounded-sm" />
				</div>
				Sveltekit App
			</a>
			<div class="flex items-center gap-4">
				<Button variant="ghost" href="/dashboard">Dashboard</Button>
				<RippleNavigate href="/dashboard" rippleColor="hsl(var(--primary))">
					<Button
						style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground));"
					>
						Naar App
					</Button>
				</RippleNavigate>
			</div>
		</nav>

		<!-- Hero Section -->
		<section class="px-6 py-20 text-center lg:px-10">
			<div class="mx-auto max-w-4xl">
				<Badge variant="secondary" class="mb-6">
					<ZapIcon class="mr-2 size-4" />
					Intern CRM Systeem
				</Badge>
				<h1 class="mb-6 text-4xl leading-tight font-bold lg:text-6xl">
					Sveltekit App Klant
					<span class="text-primary"> Beheer</span>
				</h1>
				<p class="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
					Ons interne CRM-systeem ontworpen om klantrelaties te stroomlijnen, interacties bij te
					houden en bedrijfsprocessen efficiënt te beheren.
				</p>
				<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<RippleNavigate href="/dashboard" rippleColor="hsl(var(--primary))">
						<Button size="lg" variant="outline" style="background-color: hsl(var(--primary));">
							<b class="text-primary">Dashboard Openen</b>
							<ArrowRightIcon class="ml-2 size-5" />
						</Button>
					</RippleNavigate>
				</div>
				<p class="text-muted-foreground mt-4 text-sm">Welkom terug!</p>
			</div>
		</section>

		<!-- Features Section -->
		<section class="px-6 py-16 lg:px-10">
			<div class="mx-auto max-w-6xl">
				<div class="mb-16 text-center">
					<Badge variant="outline" class="mb-4">Systeemfuncties</Badge>
					<h2 class="mb-4 text-3xl font-bold lg:text-4xl">Uitgebreide CRM Mogelijkheden</h2>
					<p class="text-muted-foreground mx-auto max-w-2xl text-lg">
						Speciaal gebouwd voor de behoeften van onze organisatie met krachtige tools om
						klantgegevens en bedrijfsprocessen te beheren.
					</p>
				</div>

				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card.Root class="bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
						<Card.Header class="pb-4">
							<div
								class="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<UsersIcon class="size-6" />
							</div>
							<Card.Title>Klantbeheer</Card.Title>
							<Card.Description>
								Gecentraliseerde klantendatabase met gedetailleerde contactinformatie,
								interactiegeschiedenis en relatietracking.
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<Card.Root class="bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
						<Card.Header class="pb-4">
							<div
								class="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<BarChart3Icon class="size-6" />
							</div>
							<Card.Title>Bedrijfsanalyse</Card.Title>
							<Card.Description>
								Uitgebreide rapportage en analyse om prestatiemetrics en bedrijfsinzichten bij te
								houden.
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<Card.Root class="bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
						<Card.Header class="pb-4">
							<div
								class="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<TrendingUpIcon class="size-6" />
							</div>
							<Card.Title>Procesmonitoring</Card.Title>
							<Card.Description>
								Bedrijfsprocessen monitoren en beheren, voortgang bijhouden en tijdige voltooiing
								van taken verzekeren.
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<Card.Root class="bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
						<Card.Header class="pb-4">
							<div
								class="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<DatabaseIcon class="size-6" />
							</div>
							<Card.Title>Gegevensbeheer</Card.Title>
							<Card.Description>
								Veilige gegevensopslag met backup- en herstelsystemen om bedrijfscontinuïteit te
								waarborgen.
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<Card.Root class="bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
						<Card.Header class="pb-4">
							<div
								class="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<ShieldCheckIcon class="size-6" />
							</div>
							<Card.Title>Toegangscontrole</Card.Title>
							<Card.Description>
								Op rollen gebaseerde rechten en beveiligingsfuncties om gevoelige bedrijfsinformatie
								te beschermen.
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<Card.Root class="bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
						<Card.Header class="pb-4">
							<div
								class="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<SettingsIcon class="size-6" />
							</div>
							<Card.Title>Aanpassing</Card.Title>
							<Card.Description>
								Configureerbare workflows en aangepaste velden toegesneden op onze specifieke
								bedrijfsvereisten.
							</Card.Description>
						</Card.Header>
					</Card.Root>
				</div>
			</div>
		</section>

		<!-- System Stats Section -->
		<section class="px-6 py-16 lg:px-10">
			<div class="mx-auto max-w-4xl">
				<div class="mb-16 text-center">
					<Badge variant="outline" class="mb-4">Systeemoverzicht</Badge>
					<h2 class="mb-4 text-3xl font-bold lg:text-4xl">Gebouwd voor Prestaties</h2>
					<p class="text-muted-foreground text-lg">
						Intern ontworpen en ontwikkeld om te voldoen aan onze specifieke operationele behoeften
					</p>
				</div>
			</div>
		</section>

		<!-- Footer -->
		<footer class="border-border/50 border-t px-6 py-12 lg:px-10">
			<div class="mx-auto max-w-6xl">
				<div class="flex flex-col items-center justify-between md:flex-row">
					<div class="mb-4 flex items-center gap-2 text-xl font-bold md:mb-0">
						<div
							class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
						>
							<img src="/favicon.png" alt="Sveltekit App" class="size-10" />
						</div>
						Sveltekit App
					</div>
					<p class="text-muted-foreground text-sm">© 2025 Gooskens Hout. Intern CRM Systeem.</p>
				</div>
			</div>
		</footer>
	</div>
</div>
