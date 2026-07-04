import { siteEntries } from '$lib/server/sites';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => siteEntries();
