<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import AnimatedGradient from '$lib/components/custom/AnimatedGradient.svelte';
	import RippleNavigate from '$lib/components/custom/RippleNavigate.svelte';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import DarkModeToggle from '$lib/components/custom/DarkModeToggle.svelte';

	import CodeIcon from '@lucide/svelte/icons/code';
	import ServerIcon from '@lucide/svelte/icons/server';
	import PenToolIcon from '@lucide/svelte/icons/pen-tool';
	import TerminalSquareIcon from '@lucide/svelte/icons/terminal-square';
	import HardDriveIcon from '@lucide/svelte/icons/hard-drive';
	import UsersIcon from '@lucide/svelte/icons/users';
	import FileDownIcon from '@lucide/svelte/icons/file-down';
	import MailIcon from '@lucide/svelte/icons/mail';
	import GithubIcon from '@lucide/svelte/icons/github';
	import LinkedinIcon from '@lucide/svelte/icons/linkedin';

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
					<img src="/favicon.ico" alt="Jens van Zutphen" class="size-6 rounded-sm" />
				</div>
				Jens van Zutphen
			</a>
			<div class="flex items-center gap-4">
				<Button variant="ghost" href="#projects">Projects</Button>
				<RippleNavigate href="#contact" rippleColor="hsl(var(--primary))">
					<Button
						style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground));"
					>
						Contact
					</Button>
				</RippleNavigate>
			</div>
		</nav>

		<!-- Hero Section -->
		<section class="px-6 py-20 text-center lg:px-10">
			<div class="mx-auto max-w-4xl">
				<Badge variant="secondary" class="mb-6">
					Software Engineer & DevOps Enthusiast
				</Badge>
				<h1 class="mb-6 text-4xl font-bold leading-tight lg:text-6xl">
					Hi, I'm Jens van Zutphen
					<br />
					<span class="text-primary">I build applications for the web.</span>
				</h1>
				<p class="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
					I'm a passionate software engineer with a love for creating beautiful, practical
					applications, pipelines, and DevOps. I also self-host most of my own services!
				</p>
				<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<RippleNavigate href="/cv.pdf" rippleColor="hsl(var(--primary))">
						<Button size="lg" variant="outline" style="background-color: hsl(var(--primary));">
							<b class="text-primary">Download CV</b>
							<FileDownIcon class="ml-2 size-5" />
						</Button>
					</RippleNavigate>
					<Button size="lg" href="#contact">
						Contact Me
						<MailIcon class="ml-2 size-5" />
					</Button>
				</div>
				<p class="text-muted-foreground mt-4 text-sm">
					Based in Nuland, Noord-Brabant, The Netherlands.
				</p>
			</div>
		</section>

		<!-- Expertise Section -->
		<section id="expertise" class="px-6 py-16 lg:px-10">
			<div class="mx-auto max-w-6xl">
				<div class="mb-16 text-center">
					<Badge variant="outline" class="mb-4">My Skills</Badge>
					<h2 class="mb-4 text-3xl font-bold lg:text-4xl">My Expertise</h2>
					<p class="text-muted-foreground mx-auto max-w-2xl text-lg">
						With 2 years of experience in SvelteKit, I also specialize in backend technologies and
						DevOps.
					</p>
				</div>

				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
					<Card.Root class="bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
						<Card.Header class="pb-4">
							<div
								class="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<CodeIcon class="size-6" />
							</div>
							<Card.Title>Full-Stack Development</Card.Title>
							<Card.Description>
								Building responsive and performant applications with SvelteKit and Node.js.
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<Card.Root class="bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
						<Card.Header class="pb-4">
							<div
								class="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<ServerIcon class="size-6" />
							</div>
							<Card.Title>Backend & Languages</Card.Title>
							<Card.Description>
								Experienced in building robust services with Go (Golang) and C#.
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<Card.Root class="bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
						<Card.Header class="pb-4">
							<div
								class="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<TerminalSquareIcon class="size-6" />
							</div>
							<Card.Title>DevOps & Automation</Card.Title>
							<Card.Description>
								Proficient with Docker, Kubernetes, FluxCD, Azure DevOps and GitHub Pipelines.
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<Card.Root class="bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
						<Card.Header class="pb-4">
							<div
								class="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<HardDriveIcon class="size-6" />
							</div>
							<Card.Title>Self-Hosting</Card.Title>
							<Card.Description>
								Passionate about self-hosting services, giving me deep infrastructure knowledge.
							</Card.Description>
						</Card.Header>
					</Card.Root>
				</div>
			</div>
		</section>

		<!-- Projects Section -->
		<section id="projects" class="px-6 py-16 lg:px-10">
			<div class="mx-auto max-w-6xl">
				<div class="mb-16 text-center">
					<Badge variant="outline" class="mb-4">My Work</Badge>
					<h2 class="mb-4 text-3xl font-bold lg:text-4xl">Featured Projects</h2>
					<p class="text-muted-foreground text-lg">
						Here are some of the projects I'm proud of.
					</p>
				</div>

				<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<!-- Project 1 -->
					<Card.Root class="bg-card/80 overflow-hidden backdrop-blur-sm transition-shadow hover:shadow-lg">
						<img
							src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2070&auto=format&fit=crop"
							alt="Project 1"
							class="h-48 w-full object-cover"
						/>
						<Card.Header>
							<Card.Title>Project One</Card.Title>
							<Card.Description>
								A brief description of the project, its purpose, and the technologies used.
							</Card.Description>
						</Card.Header>
						<Card.Content class="flex gap-2">
							<Button variant="outline" href="#">
								<GithubIcon class="mr-2 size-4" /> Code</Button
							>
							<Button href="#">Live Demo <ArrowRightIcon class="ml-2 size-4" /></Button>
						</Card.Content>
					</Card.Root>

					<!-- Project 2 -->
					<Card.Root class="bg-card/80 overflow-hidden backdrop-blur-sm transition-shadow hover:shadow-lg">
						<img
							src="https://images.unsplash.com/photo-1517694712202-1428bc38aa5a?q=80&w=2070&auto=format&fit=crop"
							alt="Project 2"
							class="h-48 w-full object-cover"
						/>
						<Card.Header>
							<Card.Title>Project Two</Card.Title>
							<Card.Description>
								A brief description of the project, its purpose, and the technologies used.
							</Card.Description>
						</Card.Header>
						<Card.Content class="flex gap-2">
							<Button variant="outline" href="#">
								<GithubIcon class="mr-2 size-4" /> Code</Button
							>
							<Button href="#">Live Demo <ArrowRightIcon class="ml-2 size-4" /></Button>
						</Card.Content>
					</Card.Root>

					<!-- Project 3 -->
					<Card.Root class="bg-card/80 overflow-hidden backdrop-blur-sm transition-shadow hover:shadow-lg">
						<img
							src="https://images.unsplash.com/photo-1534972195531-271f69fd5114?q=80&w=2070&auto=format&fit=crop"
							alt="Project 3"
							class="h-48 w-full object-cover"
						/>
						<Card.Header>
							<Card.Title>Project Three</Card.Title>
							<Card.Description>
								A brief description of the project, its purpose, and the technologies used.
							</Card.Description>
						</Card.Header>
						<Card.Content class="flex gap-2">
							<Button variant="outline" href="#">
								<GithubIcon class="mr-2 size-4" /> Code</Button
							>
							<Button href="#">Live Demo <ArrowRightIcon class="ml-2 size-4" /></Button>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</section>

		<!-- Contact Section -->
		<section id="contact" class="px-6 py-16 lg:px-10">
			<div class="mx-auto max-w-4xl text-center">
				<Badge variant="outline" class="mb-4">Get in Touch</Badge>
				<h2 class="mb-4 text-3xl font-bold lg:text-4xl">Let's Connect</h2>
				<p class="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
					Have a project in mind or just want to say hi? My inbox is always open.
				</p>
				<a href="mailto:jensvanzutphen4@gmail.com">
					<Button size="lg">
						jensvanzutphen4@gmail.com
						<MailIcon class="ml-2 size-5" />
					</Button>
				</a>
			</div>
		</section>

		<!-- Footer -->
		<footer class="border-border/50 border-t px-6 py-12 lg:px-10">
			<div class="mx-auto max-w-6xl">
				<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
					<div class="flex items-center gap-2 text-xl font-bold">
						<div
							class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
						>
							<img src="/favicon.ico" alt="Jens van Zutphen" class="size-4" />
						</div>
						Jens van Zutphen
					</div>
					<div class="flex gap-4">
						<a
							href="https://github.com/JensvanZutphen"
							class="text-muted-foreground hover:text-foreground"
						>
							<GithubIcon class="size-6" />
						</a>
						<a href="#" class="text-muted-foreground hover:text-foreground">
							<LinkedinIcon class="size-6" />
						</a>
					</div>
					<p class="text-muted-foreground text-sm">© 2024 Jens van Zutphen. All Rights Reserved.</p>
				</div>
			</div>
		</footer>
	</div>
</div>
