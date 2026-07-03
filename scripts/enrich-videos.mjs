// Enriches raw YouTube RSS video data with AI-generated metadata (genre/style,
// SEO subtitle, cleaned description) and caches the result to
// src/lib/data/enrichment.json so the site build never needs network+LLM access.
//
// Usage: ANTHROPIC_API_KEY=sk-ant-... node scripts/enrich-videos.mjs [--force]
//
// Only videos missing from the cache (or all videos with --force) are sent to
// the model. Re-run whenever new videos appear on the channel.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const CHANNEL_ID = 'UC_v6KQ204_wpzGJGIuIiUCA';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const CACHE_PATH = path.resolve('src/lib/data/enrichment.json');
const MODEL = 'claude-sonnet-5';

const FORCE = process.argv.includes('--force');

function parseFeed(xml) {
	const entries = xml.split('<entry>').slice(1);
	return entries.map((e) => {
		const id = (e.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/) || [])[1];
		const title = (e.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
		const description = (e.match(/<media:description>([\s\S]*?)<\/media:description>/) || [])[1] ?? '';
		return { id, title, description };
	});
}

async function loadCache() {
	try {
		return JSON.parse(await readFile(CACHE_PATH, 'utf8'));
	} catch {
		return {};
	}
}

async function enrichOne(video) {
	const apiKey = process.env.ANTHROPIC_API_KEY;
	if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

	const prompt = `Tu enrichis les métadonnées d'une vidéo YouTube de compositions musicales pour un site vitrine.

Titre: ${video.title}
Description brute (YouTube):
"""
${video.description}
"""

La description brute contient souvent du bruit (liens réseaux sociaux, mentions "check out my instagram", répétitions de boilerplate). Nettoie-la.

Réponds UNIQUEMENT avec un objet JSON (pas de markdown, pas de texte autour) avec ces clés:
- "genre": string courte (2-4 mots max), le style musical dominant (ex: "orchestral épique", "piano mélancolique", "musique de film"). Déduis-le du titre/description, sois précis et spécifique à la pièce.
- "seoSubtitle": string courte (max 70 caractères), un sous-titre accrocheur pour SEO/vignette, qui donne envie de cliquer, sans clickbait mensonger.
- "cleanDescription": la description nettoyée en français ou dans la langue d'origine du texte, sans liens de réseaux sociaux ni boilerplate promotionnel, en gardant le contenu informatif réel (contexte de composition, projet associé, anecdotes). Si la description brute est vide ou uniquement du boilerplate, écris une description de 1-2 phrases basée sur le titre.`;

	const res = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01'
		},
		body: JSON.stringify({
			model: MODEL,
			max_tokens: 500,
			messages: [{ role: 'user', content: prompt }]
		})
	});

	if (!res.ok) {
		throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
	}

	const data = await res.json();
	const text = data.content?.[0]?.text ?? '{}';
	const jsonMatch = text.match(/\{[\s\S]*\}/);
	if (!jsonMatch) throw new Error(`No JSON in model response for "${video.title}": ${text}`);
	return JSON.parse(jsonMatch[0]);
}

async function main() {
	const res = await fetch(RSS_URL);
	if (!res.ok) throw new Error(`Failed to fetch RSS feed: ${res.status}`);
	const videos = parseFeed(await res.text());

	const cache = await loadCache();
	let updated = 0;

	for (const video of videos) {
		if (!FORCE && cache[video.id]) continue;
		console.log(`Enriching: ${video.title}`);
		cache[video.id] = await enrichOne(video);
		updated++;
	}

	await mkdir(path.dirname(CACHE_PATH), { recursive: true });
	await writeFile(CACHE_PATH, JSON.stringify(cache, null, '\t') + '\n');
	console.log(`Done. ${updated} video(s) enriched, ${Object.keys(cache).length} total in cache.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
