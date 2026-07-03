<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import VideoCard from '$lib/VideoCard.svelte';
	import { channel } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo title="Vidéos" description={`Toutes les vidéos de la chaîne ${channel.name}.`} />

<h1 class="mb-8 text-3xl font-bold">Vidéos</h1>

{#each data.groups as group (group.category)}
	<section class="mb-12">
		<h2 class="mb-4 text-xl font-bold text-neutral-200">{group.category}</h2>
		<div class="grid grid-flow-row-dense grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
			{#each group.videos as video (video.id)}
				<VideoCard {video} size={video.featured ? 'large' : 'small'} />
			{/each}
		</div>
	</section>
{/each}
