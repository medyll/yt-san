<script lang="ts">
	import '../layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const siteConfig = $derived(data.siteConfig);
	const site = $derived(siteConfig.id);

	const navLinks = $derived([
		{ href: resolve('/[site]', { site }), label: 'Accueil' },
		{ href: resolve('/[site]/videos', { site }), label: 'Vidéos' },
		{ href: resolve('/[site]/about', { site }), label: 'À propos' }
	]);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="page">
	<header class="site-header">
		<nav>
			<a href={navLinks[0].href} class="brand">{siteConfig.site.title}</a>
			<ul>
				{#each navLinks as link (link.href)}
					<li>
						<a href={link.href} class:active={page.url.pathname === link.href}>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="site-footer">
		<p>
			© {new Date().getFullYear()}
			{siteConfig.channel.name} ·
			<a href={siteConfig.channel.url} target="_blank" rel="noopener noreferrer">Chaîne YouTube</a>
		</p>
	</footer>
</div>

<style>
	.page {
		display: flex;
		min-height: 100svh;
		flex-direction: column;
	}

	.site-header {
		border-bottom: 1px solid var(--color-border);

		nav {
			display: flex;
			max-width: var(--max-width);
			margin-inline: auto;
			align-items: center;
			justify-content: space-between;
			padding: var(--space-4) var(--space-5);
		}

		.brand {
			font-family: var(--font-display);
			font-size: 1.1rem;
			font-weight: 600;
			letter-spacing: 0.02em;
		}

		ul {
			display: flex;
			gap: var(--space-5);
			list-style: none;
			margin: 0;
			padding: 0;
			font-size: 0.9rem;
		}

		a {
			color: var(--color-text-dim);
			transition: color var(--transition);

			&:hover {
				color: var(--color-accent);
			}

			&.active {
				color: var(--color-accent);
			}
		}
	}

	main {
		flex: 1;
		width: 100%;
		max-width: var(--max-width);
		margin-inline: auto;
		padding: var(--space-6) var(--space-5);
	}

	.site-footer {
		border-top: 1px solid var(--color-border);
		padding: var(--space-5);
		text-align: center;
		font-size: 0.85rem;
		color: var(--color-text-faint);

		a {
			transition: color var(--transition);

			&:hover {
				color: var(--color-accent);
			}
		}
	}
</style>
