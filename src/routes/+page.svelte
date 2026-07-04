<script lang="ts">
	import { resolve } from '$app/paths';
	import Seo from '$lib/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo title="Chaînes YouTube" description="Sites vitrine des chaînes YouTube hébergées ici." />

<h1 class="page-title">Chaînes</h1>

<ul class="site-list">
	{#each data.sites as entry (entry.id)}
		<li>
			<a href={resolve('/[site]', { site: entry.id })} class="card">
				<h2>{entry.channel.name}</h2>
				<p>{entry.site.description}</p>
			</a>
		</li>
	{/each}
</ul>

<style>
	.page-title {
		margin-bottom: var(--space-6);
		font-size: 2rem;
	}

	.site-list {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		padding: 0;
		list-style: none;
	}

	.card {
		display: block;
		padding: var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		transition: border-color var(--transition);

		&:hover {
			border-color: var(--color-accent);
		}

		h2 {
			font-size: 1.1rem;
		}

		p {
			margin-top: var(--space-2);
			color: var(--color-text-dim);
		}
	}
</style>
