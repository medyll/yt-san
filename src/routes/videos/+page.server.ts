import { getVideos, groupByCategory } from '$lib/server/youtube';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const videos = await getVideos();
	return { groups: groupByCategory(videos) };
};
