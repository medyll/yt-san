<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import VideoCard from '$lib/VideoCard.svelte';
	import { channel } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo title="Vidéos" description={`Toutes les vidéos de la chaîne ${channel.name}.`} />

<h1 class="mb-6 text-3xl font-bold">Vidéos</h1>
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
	{#each data.videos as video (video.id)}
		<VideoCard {video} />
	{/each}
</div>
