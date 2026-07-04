import { error } from '@sveltejs/kit';
import {
	getRelatedByCategory,
	getRelatedByType,
	getVideoBySlug,
	getVideos
} from '$lib/server/youtube';
import { SITE_IDS } from '$lib/server/sites';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => {
	const entries: { site: string; slug: string }[] = [];
	for (const site of SITE_IDS) {
		const videos = await getVideos(site);
		for (const v of videos) entries.push({ site, slug: v.slug });
	}
	return entries;
};

export const load: PageServerLoad = async ({ params }) => {
	const video = await getVideoBySlug(params.site, params.slug);
	if (!video) error(404, 'Vidéo introuvable');
	const videos = await getVideos(params.site);
	return {
		video,
		relatedByCategory: getRelatedByCategory(video, videos),
		relatedByType: getRelatedByType(video, videos)
	};
};
