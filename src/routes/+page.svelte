<script lang="ts">
	import { base } from '$app/paths';
	import Seo from '$lib/Seo.svelte';
	import VideoCard from '$lib/VideoCard.svelte';
	import { channel, site } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo title={site.title} description={site.description} />

<section class="mb-12 text-center">
	<h1 class="text-4xl font-bold tracking-tight">{channel.name}</h1>
	<p class="mt-3 text-neutral-400">{site.description}</p>
	<a
		href={channel.url}
		target="_blank"
		rel="noopener noreferrer"
		class="mt-6 inline-block rounded-md bg-red-600 px-5 py-2 font-semibold hover:bg-red-500"
	>
		S'abonner sur YouTube
	</a>
</section>

<section>
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-bold">Dernières vidéos</h2>
		<a href="{base}/videos" class="text-sm text-red-500 hover:underline">Voir tout</a>
	</div>
	{#if data.featured.length > 0}
		<div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
			{#each data.featured as video (video.id)}
				<VideoCard {video} size="large" />
			{/each}
		</div>
	{/if}

	{#if data.standard.length > 0}
		<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
			{#each data.standard as video (video.id)}
				<VideoCard {video} size="small" />
			{/each}
		</div>
	{/if}
</section>
