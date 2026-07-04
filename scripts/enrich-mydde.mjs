// One-shot helper: lists Mydde videos missing from sites/mydde/enrichment.json.
// Uses YouTube Data API v3 (2 calls max per run) — never invoked by the app itself.
// Run: node scripts/enrich-mydde.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function loadEnvKey() {
	const envPath = path.join(root, '.env');
	const raw = readFileSync(envPath, 'utf-8');
	const match = raw.match(/^YOUTUBE_API_KEY=(.+)$/m);
	if (!match || !match[1].trim()) {
		throw new Error('YOUTUBE_API_KEY not set in .env');
	}
	return match[1].trim();
}

function loadChannelId() {
	const configPath = path.join(root, 'sites/mydde/config.ts');
	const raw = readFileSync(configPath, 'utf-8');
	const match = raw.match(/id:\s*'([^']+)'/);
	if (!match) throw new Error('Could not find channel id in sites/mydde/config.ts');
	return match[1];
}

function loadEnrichedIds() {
	const enrichmentPath = path.join(root, 'sites/mydde/enrichment.json');
	const raw = readFileSync(enrichmentPath, 'utf-8');
	return new Set(Object.keys(JSON.parse(raw)));
}

const apiKey = loadEnvKey();
const channelId = loadChannelId();
const enrichedIds = loadEnrichedIds();

const channelRes = await fetch(
	`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
);
if (!channelRes.ok) {
	throw new Error(`channels API error: ${channelRes.status} ${channelRes.statusText}`);
}
const channelData = await channelRes.json();
const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
if (!uploadsPlaylistId) throw new Error('uploads playlist not found');

const playlistRes = await fetch(
	`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${apiKey}`
);
if (!playlistRes.ok) {
	throw new Error(`playlistItems API error: ${playlistRes.status} ${playlistRes.statusText}`);
}
const playlistData = await playlistRes.json();
const items = playlistData.items ?? [];

const missing = items
	.map((item) => ({
		id: item.snippet.resourceId.videoId,
		title: item.snippet.title,
		description: item.snippet.description
	}))
	.filter((v) => !enrichedIds.has(v.id));

if (missing.length === 0) {
	console.log('All videos already enriched.');
} else {
	console.log(`${missing.length} video(s) missing from enrichment.json:\n`);
	for (const v of missing) {
		console.log(`--- ${v.id} ---`);
		console.log(`Title: ${v.title}`);
		console.log(`Description: ${v.description.slice(0, 200)}${v.description.length > 200 ? '...' : ''}`);
		console.log();
	}
}

if (playlistData.nextPageToken) {
	console.log(
		`Note: channel has more than ${items.length} videos; run again with pagination if needed (kept to 1 page to minimize API calls).`
	);
}
