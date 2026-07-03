import { getVideos } from '$lib/server/youtube';
import { site } from '$lib/config';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const videos = await getVideos();

	const staticUrls = ['', '/videos', '/about'];
	const videoUrls = videos.map((v) => `/videos/${v.slug}`);
	const urls = [...staticUrls, ...videoUrls];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `\t<url><loc>${site.url}${path}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
