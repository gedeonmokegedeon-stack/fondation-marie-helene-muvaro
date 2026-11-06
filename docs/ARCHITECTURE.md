# Architecture — Module 0

## 1. Vue d'ensemble

Application web monolithique modulaire basée sur **Next.js 16 (App Router)**, rendue
côté serveur par défaut (React Server Components), avec **PostgreSQL 17** comme unique
source de données et **Prisma 7** comme couche d'accès typée.

```
Navigateur
   │  HTTPS
   ▼
Next.js (App Router)
   ├── Pages publiques (RSC, statiques quand possible)
   ├── API routes (/api/health, …)
   ├── Espace d'administration (module ultérieur, protégé)
   ▼
Couche serveur (src/lib)
   ├── env.ts      → validation Zod de l'environnement
   ├── db.ts       → client Prisma singleton paresseux
   ▼
PostgreSQL 17 (via @prisma/adapter-pg)
```

## 2. Arborescence

```
prisma/
  schema.prisma          Source de vérité du modèle de données
  migrations/            Migrations SQL versionnées (standard Prisma)
  seed.ts                Seed minimal, idempotent, sans contenu inventé
prisma.config.ts         Configuration CLI Prisma 7 (dotenv, seed, migrations)
scripts/check-db.ts      Diagnostic de connexion (lecture seule)
src/
  app/                   Routes (App Router)
    layout.tsx           Layout racine (lang fr, métadonnées, noindex en construction)
    page.tsx             Accueil PROVISOIRE (Module 0)
    globals.css          Tailwind 4 + jetons d'identité officiels (@theme)
    icon.svg             Favicon provisoire
    api/health/route.ts  Sonde de santé (DB réelle, aucune fuite d'information)
  components/ui/         Composants réutilisables (ProvisionalNotice…)
  i18n/                  Configuration fr/en + dictionnaires (routage à venir)
  lib/                   env.ts, db.ts, brand.ts, utils.ts
  generated/prisma/      Client Prisma généré — IGNORÉ par Git, régénéré à l'installation
  test/                  Setup Vitest
```

## 3. Principes structurants

### 3.1 Données

- **Prisma 7** avec l'adaptateur officiel `@prisma/adapter-pg` (architecture sans moteur
  de requête Rust : compilateur de requêtes + pilote `pg`).
- Client **paresseux** (`getPrisma()`) : aucun appel DB au build ; les routes qui
  dépendent de la base sont dynamiques (`force-dynamic`).
- Schéma volontairement minimal au Module 0 (`SystemMetadata`) pour valider la chaîne
  complète. Le modèle métier complet (utilisateurs, rôles, contenus, projets, dons,
  audit…) sera conçu et validé dans les modules dédiés.
- Migrations SQL versionnées ; jamais de modification manuelle du schéma en production.

### 3.2 Environnement

- `src/lib/env.ts` valide les variables serveur avec **Zod** (échec explicite, aucune
  valeur secrète journalisée). Les variables des modules futurs (auth, paiements)
  seront ajoutées avec leurs règles.
- `.env.example` documente chaque variable ; `.env` n'est jamais versionné.

### 3.3 Internationalisation (préparation)

- `src/i18n/config.ts` : locales `['fr', 'en']`, défaut `fr`.
- Dictionnaires `src/i18n/messages/{fr,en}.json` avec test de parité des clés.
- Le routage localisé (`/[locale]/…`) sera branché au **Module 1** ; l'architecture
  retenue est un segment de langue dans l'URL avec dictionnaires par langue, ce qui
  permet d'ajouter l'anglais sans refonte. Le choix de la bibliothèque (p. ex.
  `next-intl`) sera soumis à validation au Module 1.

### 3.4 Identité

- `src/lib/brand.ts` est la source de vérité (nom, slogan, couleurs) — protégée par
  des tests garde-fous. Jetons CSS correspondants dans `globals.css` (`@theme`).
- Polices système au Module 0 (aucun téléchargement externe) ; la typographie
  officielle sera définie au Module 1 et auto-hébergée (`next/font/local`).

### 3.5 Sécurité (socle)

Voir [SECURITE.md](SECURITE.md). En bref : en-têtes de sécurité, `poweredByHeader`
désactivé, validation stricte des entrées à venir, secrets hors dépôt, journalisation
admin et RBAC prévus dans les modules dédiés.

### 3.6 Dons (architecture prévue — non implémentée)

- Table `donations` + adaptateurs par prestataire (M-Pesa, Airtel Money, Orange Money,
  international) derrière une interface commune.
- Statut d'un don : `en attente → confirmé par le prestataire → reçu émis`. Un don
  n'est **jamais** marqué payé sans vérification serveur de la confirmation
  (webhook signé / API du prestataire). Aucune donnée de carte n'est stockée.
- Aucune activation réelle sans autorisation explicite.

### 3.7 Administration (prévue — non implémentée)

- Groupe de routes `/admin` protégé par authentification + RBAC (rôles distincts :
  administration, contenu, dons, lecture…).
- Journal d'audit des opérations sensibles ; validation Zod de toutes les mutations ;
  téléversements contrôlés (type, taille, stockage hors racine publique).

## 4. Tests

- **Vitest 5** : unitaires (environnement `node`) et composants (`jsdom` + Testing
  Library, déclaré par fichier).
- 22 tests au Module 0 : environnement, identité (garde-fous), utilitaires, i18n
  (parité des clés), composant `ProvisionalNotice`.
- À venir : tests d'intégration DB, tests de bout en bout (Playwright) dans les
  modules fonctionnels.

## 5. CI/CD

GitHub Actions (`.github/workflows/ci.yml`) : `npm ci` → `prisma validate` →
`migrate deploy` (PostgreSQL 17 éphémère) → lint → typecheck → tests → `db:check` →
build. Dependabot surveille npm et les actions GitHub chaque semaine.

## 6. Versions retenues

Voir [DECISIONS.md](DECISIONS.md) pour le détail et les justifications (notamment
TypeScript 5.9 plutôt que 7, ESLint 9 plutôt que 10, Prisma 7 stable plutôt que 8 RC).
