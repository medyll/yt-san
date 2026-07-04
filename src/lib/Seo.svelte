<script lang="ts">
	import { page } from '$app/state';

	let {
		title,
		description,
		image,
		type = 'website',
		keywords
	}: {
		title: string;
		description?: string;
		image?: string;
		type?: 'website' | 'video.other';
		keywords?: string[];
	} = $props();

	const site = $derived(
		page.data.siteConfig?.site as { title: string; description: string; url: string } | undefined
	);
	const resolvedDescription = $derived(description ?? site?.description ?? '');
	const fullTitle = $derived(site && title !== site.title ? `${title} · ${site.title}` : title);
	const canonical = $derived(`${site?.url ?? ''}${page.url.pathname}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={resolvedDescription} />
	{#if keywords && keywords.length > 0}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={resolvedDescription} />
	<meta property="og:url" content={canonical} />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}

	<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={resolvedDescription} />
	{#if image}
		<meta name="twitter:image" content={image} />
	{/if}
</svelte:head>
