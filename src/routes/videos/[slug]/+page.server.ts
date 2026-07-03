import { error } from '@sveltejs/kit';
import { getVideoBySlug, getVideos } from '$lib/server/youtube';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => {
	const videos = await getVideos();
	return videos.map((v) => ({ slug: v.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const video = await getVideoBySlug(params.slug);
	if (!video) error(404, 'Vidéo introuvable');
	return { video };
};
