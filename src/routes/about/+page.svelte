<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import { channel } from '$lib/config';
</script>

<Seo title="À propos" description={`À propos de la chaîne YouTube ${channel.name}.`} />

<h1>À propos</h1>
<p>
	{channel.name} est une chaîne YouTube. Retrouvez toutes les vidéos et l'actualité de la chaîne
	sur ce site.
</p>
<a href={channel.url} target="_blank" rel="noopener noreferrer" class="button"> Voir la chaîne sur YouTube </a>

<style>
	h1 {
		margin-bottom: var(--space-4);
		font-size: 2rem;
	}

	p {
		color: var(--color-text-dim);
	}

	.button {
		margin-top: var(--space-5);
	}
</style>
