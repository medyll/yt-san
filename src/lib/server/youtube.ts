import { XMLParser } from 'fast-xml-parser';
import { getSite, type VideoEnrichment } from './sites';

export interface Video {
	id: string;
	slug: string;
	title: string;
	description: string;
	rawDescription: string;
	genre?: string;
	seoSubtitle?: string;
	category?: string;
	type?: string;
	featured: boolean;
	tags: string[];
	published: string;
	updated: string;
	thumbnail: string;
	url: string;
	author: string;
}

function slugify(title: string, id: string): string {
	const base = title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return `${base}-${id}`;
}

const cache = new Map<string, Video[]>();

async function fetchViaRss(
	site: NonNullable<ReturnType<typeof getSite>>,
	enrichmentData: Record<string, VideoEnrichment>
): Promise<Video[]> {
	const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${site.channel.id}`;

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

	return entries.map((entry: Record<string, unknown>) => {
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
			type: enriched?.type,
			featured: enriched?.featured ?? false,
			tags: enriched?.tags ?? [],
			published: String(entry.published),
			updated: String(entry.updated),
			thumbnail,
			url: `https://www.youtube.com/watch?v=${videoId}`,
			author: String((entry.author as { name?: string } | undefined)?.name ?? site.channel.name)
		} satisfies Video;
	});
}

export async function getVideos(siteId: string): Promise<Video[]> {
	const cached = cache.get(siteId);
	if (cached) return cached;

	const site = getSite(siteId);
	if (!site) throw new Error(`Unknown site: ${siteId}`);

	const enrichmentData = site.enrichment as Record<string, VideoEnrichment>;
	const videos = await fetchViaRss(site, enrichmentData);

	cache.set(siteId, videos);
	return videos;
}

export async function getVideoBySlug(siteId: string, slug: string): Promise<Video | undefined> {
	const videos = await getVideos(siteId);
	return videos.find((v) => v.slug === slug);
}

export interface VideoGroup {
	category: string;
	videos: Video[];
}

export function groupByCategory(videos: Video[], siteId: string): VideoGroup[] {
	const site = getSite(siteId);
	if (!site) throw new Error(`Unknown site: ${siteId}`);

	const groups = new Map<string, Video[]>();
	for (const video of videos) {
		const key = video.category ?? 'Autres';
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key)!.push(video);
	}

	const order = [...site.categoryOrder, 'Autres'];
	return order
		.filter((category) => groups.has(category))
		.map((category) => ({ category, videos: groups.get(category)! }));
}

export function getRelatedByCategory(video: Video, allVideos: Video[], limit = 6): Video[] {
	return allVideos
		.filter((v) => v.id !== video.id && v.category === video.category)
		.slice(0, limit);
}

export function getRelatedByType(video: Video, allVideos: Video[], limit = 6): Video[] {
	return allVideos.filter((v) => v.id !== video.id && v.type === video.type).slice(0, limit);
}
