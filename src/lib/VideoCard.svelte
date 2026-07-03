<script lang="ts">
	import { base } from '$app/paths';
	import type { Video } from '$lib/server/youtube';

	let { video }: { video: Video } = $props();
</script>

<a
	href="{base}/videos/{video.slug}"
	class="group block overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition hover:border-red-500"
>
	<img
		src={video.thumbnail}
		alt={video.title}
		loading="lazy"
		class="aspect-video w-full object-cover"
	/>
	<div class="p-4">
		<h3 class="line-clamp-2 font-semibold group-hover:text-red-500">{video.title}</h3>
		<p class="mt-1 text-xs text-neutral-500">
			{new Date(video.published).toLocaleDateString('fr-FR', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			})}
		</p>
	</div>
</a>
