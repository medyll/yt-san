export const channel = {
	handle: '@leolebrun6301',
	id: 'UC_v6KQ204_wpzGJGIuIiUCA',
	name: 'Leo Lebrun',
	url: 'https://www.youtube.com/@leolebrun6301'
};

export const site = {
	title: 'Leo Lebrun',
	description: `Site vitrine officiel de la chaîne YouTube ${channel.name}.`,
	// Set to your deployed origin (custom domain or https://<user>.github.io) for absolute SEO URLs.
	url: 'https://example.github.io'
};

// First classification axis: project context.
export const CATEGORY_ORDER = [
	'Musique de jeu vidéo',
	'Concours de scoring caritatifs',
	'Rescores & ciné',
	'Collaborations',
	'Compositions originales',
	'Défis créatifs',
	'Improvisations'
] as const;

// Second, orthogonal classification axis: sound format/instrumentation,
// independent of the project context captured by category.
export const TYPE_ORDER = ['Orchestral', 'Piano solo', 'Expérimental'] as const;
