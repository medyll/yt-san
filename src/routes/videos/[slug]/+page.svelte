<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import VideoCard from '$lib/VideoCard.svelte';
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
		genre: video.genre,
		keywords: video.tags.join(', '),
		author: {
			'@type': 'Person',
			name: channel.name
		}
	});
</script>

<Seo
	title={video.title}
	description={(video.seoSubtitle ?? video.description).slice(0, 160)}
	image={video.thumbnail}
	type="video.other"
	keywords={video.tags}
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<article>
	{#if video.genre}
		<span class="genre">{video.genre}</span>
	{/if}
	<h1>{video.title}</h1>
	{#if video.seoSubtitle}
		<p class="subtitle">{video.seoSubtitle}</p>
	{/if}
	<div class="player">
		<iframe
			src={`https://www.youtube.com/embed/${video.id}`}
			title={video.title}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	</div>
	<p class="date">
		Publié le {new Date(video.published).toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})}
	</p>
	<p class="description">{video.description}</p>
	{#if video.tags.length > 0}
		<ul class="tags">
			{#each video.tags as tag (tag)}
				<li>#{tag}</li>
			{/each}
		</ul>
	{/if}
	<a href={video.url} target="_blank" rel="noopener noreferrer" class="external">
		Voir sur YouTube →
	</a>
</article>

{#if data.related.length > 0}
	<section class="related">
		<h2>Autres vidéos — {video.category}</h2>
		<div class="video-grid">
			{#each data.related as related (related.id)}
				<VideoCard video={related} />
			{/each}
		</div>
	</section>
{/if}

<style>
	article {
		.genre {
			display: inline-block;
			margin-bottom: var(--space-2);
			font-size: 0.75rem;
			font-weight: 600;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--color-accent);
		}

		h1 {
			margin-bottom: var(--space-1);
			font-size: 1.6rem;
		}

		.subtitle {
			margin-bottom: var(--space-4);
			color: var(--color-text-dim);
		}

		.player {
			aspect-ratio: 16 / 9;
			width: 100%;
			overflow: hidden;
			border: 1px solid var(--color-border);
			border-radius: var(--radius);

			iframe {
				width: 100%;
				height: 100%;
				border: none;
			}
		}

		.date {
			margin-top: var(--space-4);
			font-size: 0.85rem;
			color: var(--color-text-faint);
		}

		.description {
			margin-top: var(--space-4);
			white-space: pre-line;
			color: var(--color-text-dim);
		}

		.tags {
			display: flex;
			flex-wrap: wrap;
			gap: var(--space-2);
			margin-top: var(--space-4);
			padding: 0;
			list-style: none;

			li {
				border-radius: 999px;
				border: 1px solid var(--color-border);
				padding: var(--space-1) var(--space-3);
				font-size: 0.75rem;
				color: var(--color-text-dim);
			}
		}

		.external {
			display: inline-block;
			margin-top: var(--space-5);
			color: var(--color-accent);

			&:hover {
				color: var(--color-accent-hover);
			}
		}
	}

	.related {
		margin-top: var(--space-7);
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-border);

		h2 {
			margin-bottom: var(--space-4);
			font-size: 1.1rem;
			color: var(--color-text-dim);
		}
	}
</style>
