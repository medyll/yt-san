# Notes de guidance — enrichissement IA du contenu vidéo

Ce fichier documente les décisions et instructions à suivre pour la partie
"enrichissement IA" du site (genre musical, sous-titre SEO, nettoyage de
description). À garder à jour si le comportement souhaité change.

## Ce qui a été mis en place

- `scripts/enrich-videos.mjs` : script Node à lancer manuellement, PAS dans le
  build/CI (coût API + pas besoin de ré-enrichir à chaque déploiement).
  - Va chercher le flux RSS de la chaîne, envoie chaque vidéo pas encore
    présente dans le cache à l'API Anthropic (modèle `claude-sonnet-5`).
  - Écrit le résultat dans `src/lib/data/enrichment.json` (committé dans le
    repo — c'est la source de vérité pour le build statique).
- `src/lib/server/youtube.ts` fusionne ce cache avec les données RSS brutes.
  Si une vidéo n'a pas d'entrée dans le cache, on retombe sur la description
  brute YouTube (pas de genre/sous-titre affiché).

## Comment relancer l'enrichissement

```
ANTHROPIC_API_KEY=sk-ant-... npm run enrich          # seulement les nouvelles vidéos
ANTHROPIC_API_KEY=sk-ant-... npm run enrich:force    # ré-enrichit tout (écrase le cache)
```

Après exécution : relire `src/lib/data/enrichment.json`, corriger à la main si
un genre ou sous-titre sonne faux, puis commit.

## Junk identifié dans les descriptions YouTube brutes (à filtrer)

Observé sur ce channel (`@leolebrun6301`) :
- Lien Instagram répété quasi systématiquement (`instagram.com/leo.lebrun.music`)
  + phrase "Check out my instagram".
- Boilerplate promotionnel sans contenu ("Full piece available on my Youtube
  Channel. Check it out !").
- Descriptions parfois vides ou quasi vides — le script doit alors générer
  1-2 phrases à partir du titre plutôt que de laisser vide.
- Crédits tiers (nom du mod/jeu, autre chaîne, `@untel`) : à GARDER, c'est du
  contenu réel, pas du junk — seulement les liens sociaux/personnels sont à
  retirer.

## Prompt actuel (résumé)

Le script demande au modèle 3 champs par vidéo : `genre` (2-4 mots, style
musical précis, pas générique), `seoSubtitle` (accroche courte, <70
caractères, pas clickbait), `cleanDescription` (description nettoyée, garde
le contenu informatif réel, enlève liens sociaux/boilerplate).

Si le style de sortie ne convient pas (trop générique, ton pas adapté...),
ajuster le prompt dans `scripts/enrich-videos.mjs` plutôt que de corriger
manuellement à chaque fois.

## Points ouverts / à trancher plus tard

- `site.url` dans `src/lib/config.ts` est encore un placeholder
  (`https://example.github.io`) — à fixer avant déploiement réel (impacte
  sitemap/canonical/OG).
- Le flux RSS ne remonte que les ~15 dernières vidéos, pas d'historique
  complet — si besoin du catalogue complet, il faudra passer par l'API
  YouTube Data v3 (clé API requise).
- Pas de validation automatique de la sortie JSON du modèle au-delà du
  parsing — si le modèle dérape sur un titre inhabituel, vérifier le cache
  généré avant de commit.
