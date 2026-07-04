import { getAllSites } from '$lib/server/sites';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return { sites: getAllSites().map(({ id, channel, site }) => ({ id, channel, site })) };
};
