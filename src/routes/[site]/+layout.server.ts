import { error } from '@sveltejs/kit';
import { getSite } from '$lib/server/sites';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ params }) => {
	const siteConfig = getSite(params.site);
	if (!siteConfig) error(404, 'Site introuvable');
	return { siteConfig };
};
