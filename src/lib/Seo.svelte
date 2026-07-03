<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/config';

	let {
		title,
		description = site.description,
		image,
		type = 'website'
	}: {
		title: string;
		description?: string;
		image?: string;
		type?: 'website' | 'video.other';
	} = $props();

	const fullTitle = $derived(title === site.title ? title : `${title} · ${site.title}`);
	const canonical = $derived(`${site.url}${page.url.pathname}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}

	<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	{#if image}
		<meta name="twitter:image" content={image} />
	{/if}
</svelte:head>
