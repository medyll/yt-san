<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import VideoCard from '$lib/VideoCard.svelte';
	import { channel } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo title="Vidéos" description={`Toutes les vidéos de la chaîne ${channel.name}.`} />

<h1 class="page-title">Vidéos</h1>

{#each data.groups as group (group.category)}
	<section class="category">
		<h2>{group.category}</h2>
		<div class="video-grid">
			{#each group.videos as video (video.id)}
				<VideoCard {video} large={video.featured} />
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
