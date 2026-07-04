<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Seo from '$lib/Seo.svelte';
	import VideoCard from '$lib/VideoCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const siteConfig = $derived(page.data.siteConfig);
</script>

<Seo title={siteConfig.site.title} description={siteConfig.site.description} />

<section class="hero">
	<h1>{siteConfig.channel.name}</h1>
	<p>{siteConfig.site.description}</p>
	<a href={siteConfig.channel.url} target="_blank" rel="noopener noreferrer" class="button">
		S'abonner sur YouTube
	</a>
</section>

<section>
	<div class="section-head">
		<h2>Dernières vidéos</h2>
		<a href={resolve('/[site]/videos', { site: siteConfig.id })}>Voir tout →</a>
	</div>
	<div class="video-grid">
		{#each data.videos as video (video.id)}
			<VideoCard {video} siteId={siteConfig.id} large={video.featured} />
		{/each}
	</div>
</section>

<style>
	.hero {
		margin-bottom: var(--space-7);
		text-align: center;

		h1 {
			font-size: 2.5rem;
		}

		p {
			margin-top: var(--space-3);
			color: var(--color-text-dim);
		}

		.button {
			margin-top: var(--space-5);
		}
	}

	.section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: var(--space-4);

		h2 {
			font-size: 1.3rem;
		}

		a {
			font-size: 0.85rem;
			color: var(--color-accent);

			&:hover {
				color: var(--color-accent-hover);
			}
		}
	}
</style>
