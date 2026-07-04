import { getVideos } from '$lib/server/youtube';
import { siteEntries } from '$lib/server/sites';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => siteEntries();

export const load: PageServerLoad = async ({ params }) => {
	const videos = await getVideos(params.site);
	return { videos: videos.slice(0, 8) };
};
