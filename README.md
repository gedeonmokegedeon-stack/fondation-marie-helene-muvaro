# Fondation Marie-Hélène Muvaro

**Solidarité · Dignité · Espoir**

Plateforme institutionnelle de la Fondation Marie-Hélène Muvaro, organisation humanitaire
basée à Kinshasa, en République démocratique du Congo.

> **État du projet : Module 0 — Fondations techniques (terminé, en attente de validation).**
> Le site public et l'administration seront développés progressivement, module par module,
> après autorisation explicite. Voir [docs/ROADMAP.md](docs/ROADMAP.md).

## Pile technique

| Composant       | Choix                                      |
| --------------- | ------------------------------------------ |
| Framework       | Next.js 16 (App Router, Turbopack)         |
| Langage         | TypeScript 5.9 (strict)                    |
| Styles          | Tailwind CSS 4                             |
| Base de données | PostgreSQL 17                              |
| ORM             | Prisma 7 (adaptateur `@prisma/adapter-pg`) |
| Validation      | Zod 4                                      |
| Tests           | Vitest 5 + Testing Library                 |
| Qualité         | ESLint 9 (config Next) + Prettier 3        |
| CI              | GitHub Actions                             |

Justification détaillée des versions : [docs/DECISIONS.md](docs/DECISIONS.md).

## Démarrage rapide

Prérequis : **Node.js ≥ 22.12**, **npm**, **Docker** (ou un PostgreSQL 17 local).

```bash
# 1. Installer les dépendances (génère aussi le client Prisma)
npm ci

# 2. Configurer l'environnement (fichier ignoré par Git, jamais commité)
cp .env.example .env

# 3. Démarrer PostgreSQL en local (développement uniquement)
docker compose up -d

# 4. Appliquer les migrations et le seed initial
npm run db:deploy
npm run db:seed

# 5. Vérifier la connexion puis lancer le serveur de développement
npm run db:check
npm run dev
```

Le site est servi sur `http://localhost:3000` ; la sonde de santé est disponible sur
`/api/health`. Guide complet : [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Scripts disponibles

| Script                | Rôle                                             |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Serveur de développement (Turbopack)             |
| `npm run build`       | Build de production                              |
| `npm start`           | Serveur de production (après build)              |
| `npm run lint`        | Analyse ESLint                                   |
| `npm run typecheck`   | Vérification TypeScript stricte                  |
| `npm test`            | Tests automatisés (Vitest)                       |
| `npm run validate`    | lint + typecheck + tests                         |
| `npm run format`      | Formatage Prettier                               |
| `npm run db:generate` | Régénérer le client Prisma                       |
| `npm run db:migrate`  | Créer/appliquer une migration (développement)    |
| `npm run db:deploy`   | Appliquer les migrations (production/CI)         |
| `npm run db:seed`     | Seed initial (métadonnées techniques uniquement) |
| `npm run db:studio`   | Explorateur de données Prisma Studio             |
| `npm run db:check`    | Vérifier la connexion PostgreSQL (lecture seule) |

## Structure du dépôt

```
prisma/            Schéma, migrations SQL, seed
scripts/           Scripts techniques (vérification DB…)
src/app/           Routes Next.js App Router (pages, API)
src/components/    Composants réutilisables
src/i18n/          Préparation fr / en (dictionnaires, configuration)
src/lib/           Environnement validé, client Prisma, identité, utilitaires
src/generated/     Client Prisma généré (ignoré par Git)
docs/              Installation, architecture, sécurité, feuille de route, décisions
.github/           CI, Dependabot, modèle de pull request
```

## Règles du projet (impératives)

- **Aucun contenu inventé** : ni réalisations, ni chiffres, ni partenaires, ni témoignages,
  ni coordonnées. Tout contenu non validé est identifié comme provisoire.
- **Identité officielle** : bleu marine `#142A46`, or `#B18A42`, blanc `#FFFFFF`,
  ivoire `#E9E6DF` ; slogan « Solidarité · Dignité · Espoir ». Aucune modification
  sans autorisation.
- **Aucun paiement réel simulé** : un don ne sera marqué « payé » qu'après confirmation
  vérifiée du prestataire. Aucune donnée de carte bancaire n'est stockée.
- **Aucun secret publié** : `.env` est ignoré par Git ; seul `.env.example` (sans secret)
  est versionné.
- **Git** : travail sur branche de développement, commits clairs, aucune modification
  directe de `main`, aucune fusion sans autorisation.

## Documentation

- [Installation et exploitation](docs/INSTALLATION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Sécurité](docs/SECURITE.md)
- [Feuille de route des modules](docs/ROADMAP.md)
- [Journal des décisions techniques](docs/DECISIONS.md)
