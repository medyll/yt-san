import { getAllSites } from '$lib/server/sites';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const origin = getAllSites()[0]?.site.url ?? '';
	const body = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
	return new Response(body, {
		headers: { 'Content-Type': 'text/plain' }
	});
};
