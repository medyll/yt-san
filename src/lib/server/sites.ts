export interface ChannelConfig {
	handle: string;
	id: string;
	name: string;
	url: string;
}

export interface SiteMeta {
	title: string;
	description: string;
	url: string;
}

export interface VideoEnrichment {
	genre: string;
	seoSubtitle: string;
	cleanDescription: string;
	category: string;
	type: string;
	featured: boolean;
	tags: string[];
}

export interface SiteEntry {
	id: string;
	channel: ChannelConfig;
	site: SiteMeta;
	categoryOrder: string[];
	typeOrder: string[];
	enrichment: Record<string, VideoEnrichment>;
}

interface SiteConfigModule {
	channel: ChannelConfig;
	site: SiteMeta;
	CATEGORY_ORDER: readonly string[];
	TYPE_ORDER: readonly string[];
}

const configModules = import.meta.glob<SiteConfigModule>('../../../sites/*/config.ts', {
	eager: true
});
const enrichmentModules = import.meta.glob<Record<string, VideoEnrichment>>(
	'../../../sites/*/enrichment.json',
	{ eager: true, import: 'default' }
);

function idFromPath(path: string): string {
	const match = path.match(/\/sites\/([^/]+)\//);
	if (!match) throw new Error(`Could not derive site id from path: ${path}`);
	return match[1];
}

const sites = new Map<string, SiteEntry>();

for (const [path, mod] of Object.entries(configModules)) {
	const id = idFromPath(path);
	const enrichmentPath = path.replace('config.ts', 'enrichment.json');
	sites.set(id, {
		id,
		channel: mod.channel,
		site: mod.site,
		categoryOrder: [...mod.CATEGORY_ORDER],
		typeOrder: [...mod.TYPE_ORDER],
		enrichment: enrichmentModules[enrichmentPath] ?? {}
	});
}

export const SITE_IDS = [...sites.keys()];

export function getSite(id: string): SiteEntry | undefined {
	return sites.get(id);
}

export function getAllSites(): SiteEntry[] {
	return [...sites.values()];
}

export function siteEntries(): { site: string }[] {
	return SITE_IDS.map((site) => ({ site }));
}
