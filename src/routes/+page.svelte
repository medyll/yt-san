<script lang="ts">
	import { base } from '$app/paths';
	import Seo from '$lib/Seo.svelte';
	import VideoCard from '$lib/VideoCard.svelte';
	import { channel, site } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo title={site.title} description={site.description} />

<section class="hero">
	<h1>{channel.name}</h1>
	<p>{site.description}</p>
	<a href={channel.url} target="_blank" rel="noopener noreferrer" class="button">
		S'abonner sur YouTube
	</a>
</section>

<section>
	<div class="section-head">
		<h2>Dernières vidéos</h2>
		<a href="{base}/videos">Voir tout →</a>
	</div>
	<div class="video-grid">
		{#each data.videos as video (video.id)}
			<VideoCard {video} large={video.featured} />
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
