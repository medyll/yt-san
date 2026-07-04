<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/Seo.svelte';
	import VideoCard from '$lib/VideoCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const siteConfig = $derived(page.data.siteConfig);
</script>

<Seo title="Vidéos" description={`Toutes les vidéos de la chaîne ${siteConfig.channel.name}.`} />

<h1 class="page-title">Vidéos</h1>

{#each data.groups as group (group.category)}
	<section class="category">
		<h2>{group.category}</h2>
		<div class="video-grid">
			{#each group.videos as video (video.id)}
				<VideoCard {video} siteId={siteConfig.id} large={video.featured} />
			{/each}
		</div>
	</section>
{/each}

<style>
	.page-title {
		margin-bottom: var(--space-6);
		font-size: 2rem;
	}

	.category {
		margin-bottom: var(--space-7);

		h2 {
			margin-bottom: var(--space-4);
			font-size: 1.2rem;
			color: var(--color-text-dim);
		}
	}
</style>
