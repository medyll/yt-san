import { XMLParser } from 'fast-xml-parser';
import { channel } from '$lib/config';
import enrichment from '$lib/data/enrichment.json';

export interface VideoEnrichment {
	genre: string;
	seoSubtitle: string;
	cleanDescription: string;
}

export interface Video {
	id: string;
	slug: string;
	title: string;
	description: string;
	rawDescription: string;
	genre?: string;
	seoSubtitle?: string;
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
			published: String(entry.published),
			updated: String(entry.updated),
			thumbnail,
			url: `https://www.youtube.com/watch?v=${videoId}`,
			author: String(entry.author?.name ?? channel.name)
		} satisfies Video;
	});

	return cache;
}

export async function getVideoBySlug(slug: string): Promise<Video | undefined> {
	const videos = await getVideos();
	return videos.find((v) => v.slug === slug);
}
