# Notes de guidance — yt-san

Ce fichier documente les décisions et instructions à suivre. À garder à jour
si le comportement souhaité change.

## Stack CSS : pas de Tailwind

Tailwind a été retiré du projet (était trop contraignant pour un design
custom, et rendait la mise en forme "insipide" — palette générique
gris/rouge). Remplacé par du CSS nested natif :

- `src/lib/styles/tokens.css` — variables CSS (`--color-*`, `--space-*`,
  `--font-*`, `--radius`...). Toute nouvelle couleur/espacement doit passer
  par une variable ici, pas une valeur en dur dans un composant.
- `src/routes/layout.css` — reset + styles de base (body, headings, liens) +
  quelques classes utilitaires partagées (`.video-grid`, `.button`,
  `.line-clamp-2`) réutilisées par plusieurs pages.
- Chaque composant Svelte a son propre `<style>` avec nesting CSS natif
  (`&:hover`, sélecteurs imbriqués) — pas de classes utilitaires, pas de
  build step CSS supplémentaire.
- Grille vidéos : `.video-grid` = `display:grid; grid-auto-flow:dense` +
  `minmax(220px,1fr)`. Une carte "featured" a juste `grid-column:span 2;
  grid-row:span 2` (classe `.large` dans `VideoCard.svelte`) — le
  `dense` packing comble automatiquement les trous avec les cartes
  standard, pas besoin de subgrid ni de grilles séparées (ancienne
  approche abandonnée, elle cassait dès qu'on mélangeait tailles).

## Fiches vidéo : vidéos liées en bas de page

`/videos/[slug]` affiche en pied de page une section "Autres vidéos —
{catégorie}" avec jusqu'à 6 vidéos de la même catégorie (hors vidéo
courante) via `getRelatedVideos()` dans `src/lib/server/youtube.ts`.

## Comment ça marche (important)

**Pas de script/API appelée en autonome.** L'utilisateur n'a pas de clé API
Claude. L'enrichissement est fait à la main, par Claude directement dans une
session de travail :

1. Récupérer le flux RSS de la chaîne (`https://www.youtube.com/feeds/videos.xml?channel_id=UC_v6KQ204_wpzGJGIuIiUCA`).
2. Pour chaque vidéo pas encore dans `src/lib/data/enrichment.json`, rédiger
   à la main : `genre`, `seoSubtitle`, `cleanDescription` (voir format
   ci-dessous).
3. Écrire/compléter `src/lib/data/enrichment.json` directement (Write/Edit),
   committer.

`src/lib/server/youtube.ts` fusionne ce cache avec les données RSS brutes. Si
une vidéo n'a pas d'entrée dans le cache, on retombe sur la description brute
YouTube (pas de genre/sous-titre affiché) — donc penser à relancer ce process
à chaque nouvelle vidéo publiée sur la chaîne.

## Format d'une entrée `enrichment.json`

```json
"<videoId>": {
  "genre": "2-4 mots, style musical précis (pas générique)",
  "seoSubtitle": "accroche courte, < 70 caractères, pas clickbait",
  "cleanDescription": "description nettoyée, contenu réel gardé",
  "category": "une des 6 catégories ci-dessous",
  "featured": true|false
}
```

### Catégories (`category`)

Liste fermée, définie dans `CATEGORY_ORDER` (`src/lib/server/youtube.ts`) —
l'ordre de cette liste est aussi l'ordre d'affichage des sections sur
`/videos`. Ajouter une nouvelle catégorie seulement si aucune des 6
existantes ne convient vraiment, et mettre à jour `CATEGORY_ORDER` +
`VideoCategory` en même temps que le JSON :

1. **Musique de jeu vidéo** — OST/thème composé pour un jeu ou mod.
2. **Rescores & ciné** — rescore de trailer/doc/court-métrage existant,
   concours de scoring (ScoreRelief...).
3. **Collaborations** — coécrit avec un autre artiste crédité.
4. **Compositions originales** — pièce solo, pas de contrainte de concours/
   défi, pas un rescore.
5. **Défis créatifs** — défi lancé par un tiers avec contraintes explicites
   (thème imposé, instrument imposé, tempo...).
6. **Improvisations** — improvisation courte, pas de production soignée.

### Critère `featured` (grande vignette 2x2 vs standard)

`featured: true` = pièce "portfolio", qui démontre un niveau ou une
diversification professionnelle intéressante pour Léo Lebrun compositeur :
OST officielle d'un jeu/mod, rescore d'une IP connue ou d'un concours avec
partenaire notable (orchestre, fondation), collaboration créditée avec un
autre artiste, composition originale aboutie qui montre une palette
différente (ex: romantique vs épique habituel).

`featured: false` = contenu plus mineur ou répétitif : improvisations,
défis créatifs courts, extraits/teasers d'une pièce déjà postée en entier,
rescores solo sans partenariat notable.

C'est un jugement qualitatif, pas une formule — si le catalogue grossit et
que la moitié des vidéos finit `featured: true`, resserrer le critère (le
but est un effet de hiérarchie visuelle, pas un simple bonus systématique).

## Junk identifié dans les descriptions YouTube brutes (à filtrer)

Observé sur ce channel (`@leolebrun6301`) :
- Lien Instagram répété quasi systématiquement (`instagram.com/leo.lebrun.music`)
  + phrase "Check out my instagram".
- Liens Soundcloud/Facebook en pied de description, répétés à l'identique sur
  presque toutes les vidéos.
- Boilerplate promotionnel sans contenu ("Full piece available on my Youtube
  Channel. Check it out !").
- Descriptions parfois vides ou quasi vides — écrire alors 1-2 phrases basées
  sur le titre plutôt que de laisser vide.
- Crédits tiers (nom du mod/jeu, autre chaîne, `@untel`, contexte du concours/
  défi) : à GARDER, c'est du contenu réel, pas du junk — seulement les liens
  sociaux/personnels et le boilerplate promo sont à retirer.

## Points ouverts / à trancher plus tard

- `site.url` dans `src/lib/config.ts` est encore un placeholder
  (`https://example.github.io`) — à fixer avant déploiement réel (impacte
  sitemap/canonical/OG).
- Le flux RSS ne remonte que les ~15 dernières vidéos, pas d'historique
  complet — si besoin du catalogue complet, il faudra passer par l'API
  YouTube Data v3 (clé API requise).
- Pas de validation automatique du contenu enrichi — relire à l'œil avant
  commit si le genre/sous-titre sonne faux pour une vidéo particulière.
