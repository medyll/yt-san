<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import { channel } from '$lib/config';
</script>

<Seo title="À propos" description={`À propos de la chaîne YouTube ${channel.name}.`} />

<h1 class="mb-4 text-3xl font-bold">À propos</h1>
<p class="text-neutral-300">
	{channel.name} est une chaîne YouTube. Retrouvez toutes les vidéos et l'actualité de la chaîne
	sur ce site.
</p>
<a
	href={channel.url}
	target="_blank"
	rel="noopener noreferrer"
	class="mt-6 inline-block rounded-md bg-red-600 px-5 py-2 font-semibold hover:bg-red-500"
>
	Voir la chaîne sur YouTube
</a>
