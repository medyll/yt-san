export const channel = {
	handle: '@Mydde2',
	id: 'UCGBkCOsHnpzpPF9834vrScg',
	name: 'Mydde',
	url: 'https://www.youtube.com/@Mydde2'
};

export const site = {
	title: 'Mydde',
	description: `Site vitrine officiel de la chaîne YouTube ${channel.name}.`,
	// Set to your deployed origin (custom domain or https://<user>.github.io) for absolute SEO URLs.
	url: 'https://example.github.io'
};

// First classification axis: project context.
export const CATEGORY_ORDER = [
	'Chansons',
	'Clips',
	'Fils du Mékong',
	'Textes & performances',
	'Teasers & essais'
] as const;

// Second, orthogonal classification axis: sound format/style,
// independent of the project context captured by category.
export const TYPE_ORDER = ['Chanson acoustique', 'Rock', 'Spoken word / absurde'] as const;
