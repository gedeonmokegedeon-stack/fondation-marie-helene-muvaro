# Journal des décisions techniques

Format : chaque décision indique le contexte, le choix et la justification.
Les décisions validées par la Fondation ne peuvent être modifiées sans autorisation.

## Décisions validées par la Fondation (référence)

- **Identité** : bleu marine `#142A46`, or `#B18A42`, blanc `#FFFFFF`, ivoire `#E9E6DF` ;
  slogan « Solidarité · Dignité · Espoir ».
- **Développement progressif** : modules livrés et validés un par un.
- **Règles de contenu et de paiement** : voir README (aucune invention, aucun paiement
  simulé, aucune donnée de carte stockée).

## ADR-001 — Next.js 16.4.5 (App Router)

Dernière version stable au 05/11/2026. App Router + React Server Components :
performance, SEO, et base saine pour l'administration. Turbopack par défaut.

## ADR-002 — TypeScript 5.9.3 (et non 7.x)

TypeScript 7 (compilateur natif) est publié, mais l'écosystème de lint
(`typescript-eslint` exige `< 6.1`) et certains outils ne le supportent pas encore.
5.9.3 est la version stable la plus récente pleinement compatible. Migration à
réévaluer quand l'écosystème suivra.

## ADR-003 — Prisma 7.10.1 + `@prisma/adapter-pg` (et non 8 RC)

Le tag `latest` du CLI Prisma pointe vers une version candidate (8.0.0-rc) : écartée
par principe de stabilité. 7.10.1 est la dernière version stable de la lignée 7
(architecture sans moteur de requête Rust, adaptateurs de pilote officiels).
Client généré en TypeScript dans `src/generated/prisma` (ignoré par Git, régénéré
à l'installation via `postinstall`).

## ADR-004 — Tailwind CSS 4.3.4

Version stable actuelle ; configuration par CSS (`@theme`), jetons d'identité
officiels centralisés. PostCSS via `@tailwindcss/postcss`.

## ADR-005 — PostgreSQL 17

Version majeure stable, support long terme, image Docker `postgres:17-alpine`
pour le développement et la CI. Encodage UTF-8 exigé.

## ADR-006 — ESLint 9.39.x (et non 10.x)

ESLint 10 est publié, mais les plugins embarqués par `eslint-config-next` 16.4.5
(`eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`) déclarent
encore une compatibilité `^9` maximum. Choix de la cohérence de l'écosystème ;
l'avertissement de dépréciation d'ESLint 9 est connu et sera résolu par mise à jour
de `eslint-config-next` (surveillé via Dependabot).

## ADR-007 — Vitest 5 + Testing Library (jsdom)

Vitest 5.1 (stable, compatible Node 22.12+) : rapide, configuration alignée sur Vite.
Environnement `node` par défaut ; `jsdom` déclaré par fichier pour les composants.
Playwright sera ajouté pour le bout en bout dans les modules fonctionnels.

## ADR-008 — Polices système au Module 0

Aucune police externe téléchargée (ni build dépendant du réseau). La typographie
officielle sera choisie au Module 1 et auto-hébergée via `next/font/local`.

## ADR-009 — i18n préparée, non branchée

Locales `fr` (défaut) / `en` (prévu), dictionnaires avec test de parité des clés.
Le routage `/[locale]` et la bibliothèque associée seront validés au Module 1 pour
éviter une refonte ultérieure.

## ADR-010 — Schéma de données minimal au Module 0

Seule la table technique `system_metadata` est créée, pour valider la chaîne
migrations → client → requêtes sans préempter la conception du modèle métier
(authentification, dons, contenus…), qui sera validée module par module.

## ADR-011 — Environnement sandbox Arena (spécifique, sans effet sur le dépôt)

Le sandbox n'a pas accès à `binaries.prisma.sh` (binaire natif `schema-engine`).
Dans cet environnement uniquement :

- `prisma generate` / `validate` : moteur WASM embarqué, vérification du binaire
  neutralisée par `PRISMA_SCHEMA_ENGINE_BINARY=$(command -v true)` ;
- PostgreSQL 17.11 réel fourni par le paquet npm `embedded-postgres` (hors dépôt) ;
- migration initiale appliquée par script SQL avec enregistrement conforme dans
  `_prisma_migrations` (checksum SHA-256 du fichier).

Les fichiers de migration du dépôt sont strictement standard : `prisma migrate
deploy` fonctionne normalement dans tout environnement ayant accès au domaine Prisma
(poste développeur, CI GitHub Actions).
