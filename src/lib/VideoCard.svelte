<script lang="ts">
	import { base } from '$app/paths';
	import type { Video } from '$lib/server/youtube';

	let { video, large = false }: { video: Video; large?: boolean } = $props();

	const dateLabel = $derived(
		new Date(video.published).toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);
</script>

<a href="{base}/videos/{video.slug}" class="card" class:large>
	<img src={video.thumbnail} alt={video.title} loading="lazy" class="thumb" />
	<div class="body">
		{#if video.genre}
			<span class="genre">{video.genre}</span>
		{/if}
		<h3 class="line-clamp-2">{video.title}</h3>
		{#if video.seoSubtitle}
			<p class="subtitle line-clamp-2">{video.seoSubtitle}</p>
		{/if}
		<p class="date">{dateLabel}</p>
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-surface);
		transition:
			border-color var(--transition),
			transform var(--transition);

		&:hover {
			border-color: var(--color-accent);
			transform: translateY(-2px);

			.thumb {
				transform: scale(1.03);
			}

			h3 {
				color: var(--color-accent);
			}
		}
	}

	.card.large {
		grid-column: span 2;
		grid-row: span 2;

		.thumb {
			flex: 1;
			min-height: 12rem;
		}

		h3 {
			font-size: 1.15rem;
		}
	}

	.thumb {
		aspect-ratio: 16 / 9;
		width: 100%;
		object-fit: cover;
		background: var(--color-surface-hover);
		transition: transform 400ms ease;
	}

	.body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
	}

	.genre {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	h3 {
		font-size: 1rem;
		font-weight: 600;
		transition: color var(--transition);
	}

	.subtitle {
		font-size: 0.85rem;
		color: var(--color-text-dim);
	}

	.date {
		margin-top: auto;
		padding-top: var(--space-2);
		font-size: 0.75rem;
		color: var(--color-text-faint);
	}
</style>
