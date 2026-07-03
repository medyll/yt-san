<script lang="ts">
	import { base } from '$app/paths';
	import type { Video } from '$lib/server/youtube';

	let { video, size = 'small' }: { video: Video; size?: 'large' | 'small' } = $props();

	const dateLabel = $derived(
		new Date(video.published).toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);
</script>

{#if size === 'large'}
	<a
		href="{base}/videos/{video.slug}"
		class="group block overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition hover:border-red-500 sm:col-span-2 sm:row-span-2"
	>
		<div
			role="img"
			aria-label={video.title}
			class="aspect-video w-full bg-neutral-800 bg-cover bg-center"
			style:background-image="url('{video.thumbnail}')"
		></div>
		<div class="p-4">
			{#if video.genre}
				<span class="mb-1 inline-block text-xs font-medium tracking-wide text-red-500 uppercase">
					{video.genre}
				</span>
			{/if}
			<h3 class="line-clamp-2 text-lg font-semibold group-hover:text-red-500">{video.title}</h3>
			{#if video.seoSubtitle}
				<p class="mt-1 line-clamp-2 text-sm text-neutral-400">{video.seoSubtitle}</p>
			{/if}
			<p class="mt-1 text-xs text-neutral-500">{dateLabel}</p>
		</div>
	</a>
{:else}
	<!--
		Rows subgrid onto the shared category grid: every "small" card in the
		same visual row adopts the tallest sibling's height per row (image,
		genre, title, subtitle, date), so mismatched text lengths/line-wraps
		no longer stagger the cards vertically.
	-->
	<a
		href="{base}/videos/{video.slug}"
		class="group row-span-5 grid grid-rows-subgrid overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition hover:border-red-500"
	>
		<div
			role="img"
			aria-label={video.title}
			class="aspect-video w-full bg-neutral-800 bg-cover bg-center"
			style:background-image="url('{video.thumbnail}')"
		></div>
		<span class="px-4 pt-3 text-xs font-medium tracking-wide text-red-500 uppercase">
			{video.genre ?? ''}
		</span>
		<h3 class="line-clamp-2 px-4 font-semibold group-hover:text-red-500">{video.title}</h3>
		<p class="line-clamp-2 px-4 text-sm text-neutral-400">{video.seoSubtitle ?? ''}</p>
		<p class="px-4 pb-4 text-xs text-neutral-500">{dateLabel}</p>
	</a>
{/if}
