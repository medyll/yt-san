<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { channel, site } from '$lib/config';

	let { children } = $props();

	const navLinks = [
		{ href: `${base}/`, label: 'Accueil' },
		{ href: `${base}/videos`, label: 'Vidéos' },
		{ href: `${base}/about`, label: 'À propos' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
	<header class="border-b border-neutral-800">
		<nav class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<a href="{base}/" class="text-lg font-bold tracking-tight">{site.title}</a>
			<ul class="flex gap-6 text-sm">
				{#each navLinks as link (link.href)}
					<li>
						<a
							href={link.href}
							class="hover:text-red-500 {page.url.pathname === link.href
								? 'text-red-500'
								: 'text-neutral-300'}"
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<main class="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
		{@render children()}
	</main>

	<footer class="border-t border-neutral-800 py-6 text-center text-sm text-neutral-500">
		<p>
			© {new Date().getFullYear()} {channel.name} ·
			<a href={channel.url} target="_blank" rel="noopener noreferrer" class="hover:text-red-500">
				Chaîne YouTube
			</a>
		</p>
	</footer>
</div>
