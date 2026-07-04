import { XMLParser } from 'fast-xml-parser';
import { channel } from '$lib/config';
import enrichment from '$lib/data/enrichment.json';

export type VideoCategory =
	| 'Musique de jeu vidéo'
	| 'Concours de scoring caritatifs'
	| 'Rescores & ciné'
	| 'Collaborations'
	| 'Compositions originales'
	| 'Défis créatifs'
	| 'Improvisations';

export const CATEGORY_ORDER: VideoCategory[] = [
	'Musique de jeu vidéo',
	'Concours de scoring caritatifs',
	'Rescores & ciné',
	'Collaborations',
	'Compositions originales',
	'Défis créatifs',
	'Improvisations'
];

export interface VideoEnrichment {
	genre: string;
	seoSubtitle: string;
	cleanDescription: string;
	category: VideoCategory;
	featured: boolean;
	tags: string[];
}

export interface Video {
	id: string;
	slug: string;
	title: string;
	description: string;
	rawDescription: string;
	genre?: string;
	seoSubtitle?: string;
	category?: VideoCategory;
	featured: boolean;
	tags: string[];
	published: string;
	updated: string;
	thumbnail: string;
	url: string;
	author: string;
}

const enrichmentData = enrichment as Record<string, VideoEnrichment>;

const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`;

function slugify(title: string, id: string): string {
	const base = title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return `${base}-${id}`;
}

let cache: Video[] | null = null;

export async function getVideos(): Promise<Video[]> {
	if (cache) return cache;

	const res = await fetch(RSS_URL);
	if (!res.ok) {
		throw new Error(`Failed to fetch YouTube feed: ${res.status} ${res.statusText}`);
	}
	const xml = await res.text();

	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: '@_'
	});
	const feed = parser.parse(xml);

	const entries = feed.feed.entry ? [].concat(feed.feed.entry) : [];

	cache = entries.map((entry: Record<string, unknown>) => {
		const videoId = String(entry['yt:videoId']);
		const mediaGroup = entry['media:group'] as Record<string, unknown>;
		const thumbnail = (mediaGroup['media:thumbnail'] as Record<string, string>)['@_url'];
		const rawDescription = String(mediaGroup['media:description'] ?? '');
		const title = String(entry.title);
		const enriched = enrichmentData[videoId];

		return {
			id: videoId,
			slug: slugify(title, videoId),
			title,
			description: enriched?.cleanDescription ?? rawDescription,
			rawDescription,
			genre: enriched?.genre,
			seoSubtitle: enriched?.seoSubtitle,
			category: enriched?.category,
			featured: enriched?.featured ?? false,
			tags: enriched?.tags ?? [],
			published: String(entry.published),
			updated: String(entry.updated),
			thumbnail,
			url: `https://www.youtube.com/watch?v=${videoId}`,
			author: String((entry.author as { name?: string } | undefined)?.name ?? channel.name)
		} satisfies Video;
	});

	return cache;
}

export async function getVideoBySlug(slug: string): Promise<Video | undefined> {
	const videos = await getVideos();
	return videos.find((v) => v.slug === slug);
}

export interface VideoGroup {
	category: VideoCategory | 'Autres';
	videos: Video[];
}

export function groupByCategory(videos: Video[]): VideoGroup[] {
	const groups = new Map<VideoCategory | 'Autres', Video[]>();

	for (const video of videos) {
		const key = video.category ?? 'Autres';
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key)!.push(video);
	}

	const order = [...CATEGORY_ORDER, 'Autres' as const];
	return order
		.filter((category) => groups.has(category))
		.map((category) => ({ category, videos: groups.get(category)! }));
}

export function getRelatedVideos(video: Video, allVideos: Video[], limit = 6): Video[] {
	return allVideos.filter((v) => v.id !== video.id && v.category === video.category).slice(0, limit);
}
