<script lang="ts">
	import { base } from '$app/paths';
	import type { Video } from '$lib/server/youtube';

	let { video, size = 'small' }: { video: Video; size?: 'large' | 'small' } = $props();
</script>

<a
	href="{base}/videos/{video.slug}"
	class="group block overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition hover:border-red-500 {size ===
	'large'
		? 'sm:col-span-2 sm:row-span-2'
		: ''}"
>
	<img
		src={video.thumbnail}
		alt={video.title}
		loading="lazy"
		class="aspect-video w-full object-cover"
	/>
	<div class="p-4">
		{#if video.genre}
			<span class="mb-1 inline-block text-xs font-medium tracking-wide text-red-500 uppercase">
				{video.genre}
			</span>
		{/if}
		<h3 class="line-clamp-2 font-semibold group-hover:text-red-500 {size === 'large' ? 'text-lg' : ''}">
			{video.title}
		</h3>
		{#if video.seoSubtitle}
			<p class="mt-1 line-clamp-2 text-sm text-neutral-400">{video.seoSubtitle}</p>
		{/if}
		<p class="mt-1 text-xs text-neutral-500">
			{new Date(video.published).toLocaleDateString('fr-FR', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			})}
		</p>
	</div>
</a>
