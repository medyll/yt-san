import { getVideos } from '$lib/server/youtube';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const videos = await getVideos();
	return { videos: videos.slice(0, 8) };
};
