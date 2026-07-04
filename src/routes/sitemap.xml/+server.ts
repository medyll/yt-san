import { getVideos } from '$lib/server/youtube';
import { getAllSites } from '$lib/server/sites';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const sites = getAllSites();
	const origin = sites[0]?.site.url ?? '';

	const urls: string[] = [''];
	for (const site of sites) {
		const videos = await getVideos(site.id);
		urls.push(`/${site.id}`, `/${site.id}/videos`, `/${site.id}/about`);
		for (const v of videos) urls.push(`/${site.id}/videos/${v.slug}`);
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `\t<url><loc>${origin}${path}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
