<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import { channel } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const video = $derived(data.video);

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'VideoObject',
		name: video.title,
		description: video.description,
		thumbnailUrl: video.thumbnail,
		uploadDate: video.published,
		embedUrl: `https://www.youtube.com/embed/${video.id}`,
		author: {
			'@type': 'Person',
			name: channel.name
		}
	});
</script>

<Seo title={video.title} description={video.description.slice(0, 160)} image={video.thumbnail} type="video.other" />

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<article>
	<h1 class="mb-4 text-2xl font-bold">{video.title}</h1>
	<div class="aspect-video w-full overflow-hidden rounded-lg border border-neutral-800">
		<iframe
			class="h-full w-full"
			src={`https://www.youtube.com/embed/${video.id}`}
			title={video.title}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	</div>
	<p class="mt-4 text-sm text-neutral-500">
		Publié le {new Date(video.published).toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})}
	</p>
	<p class="mt-4 whitespace-pre-line text-neutral-300">{video.description}</p>
	<a href={video.url} target="_blank" rel="noopener noreferrer" class="mt-6 inline-block text-red-500 hover:underline">
		Voir sur YouTube →
	</a>
</article>
