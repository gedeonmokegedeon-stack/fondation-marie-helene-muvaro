# Installation et exploitation

## 1. Prérequis

| Outil      | Version requise                           | Remarque                                        |
| ---------- | ----------------------------------------- | ----------------------------------------------- |
| Node.js    | ≥ 22.12 (LTS 22 conseillé, voir `.nvmrc`) | `nvm use` lit `.nvmrc`                          |
| npm        | ≥ 10                                      | Livré avec Node                                 |
| PostgreSQL | 17                                        | Via Docker (recommandé) ou installation native  |
| Docker     | Récent                                    | Uniquement pour la base locale de développement |

Aucun achat de domaine, d'hébergement ou de service n'est nécessaire pour développer.

## 2. Installation

```bash
git clone https://github.com/gedeonmokegedeon-stack/fondation-marie-helene-muvaro.git
cd fondation-marie-helene-muvaro
npm ci                      # installe les dépendances + génère le client Prisma
cp .env.example .env        # puis renseigner les valeurs
```

> `.env` est ignoré par Git. Ne jamais y mettre de secret dans un fichier versionné,
> ne jamais le publier.

## 3. Base de données locale

### Option A — Docker (recommandée)

```bash
docker compose up -d        # PostgreSQL 17, identifiants de DÉVELOPPEMENT uniquement
```

La valeur `DATABASE_URL` par défaut de `.env.example` correspond à ce conteneur.

### Option B — PostgreSQL natif

Créer un rôle et une base, puis adapter `DATABASE_URL` dans `.env` :

```sql
CREATE ROLE fmhm LOGIN PASSWORD 'un-mot-de-passe-local';
CREATE DATABASE fmhm OWNER fmhm ENCODING 'UTF8';
```

## 4. Migrations et données initiales

```bash
npm run db:deploy           # applique les migrations existantes
npm run db:seed             # métadonnées techniques (idempotent, aucun contenu inventé)
npm run db:check            # vérifie la connexion et le schéma
```

Pour créer une nouvelle migration après modification de `prisma/schema.prisma` :

```bash
npm run db:migrate -- --name description_courte
```

## 5. Développement

```bash
npm run dev                 # http://localhost:3000
```

- Page d'accueil provisoire : `/`
- Sonde de santé (connexion DB réelle) : `/api/health`

## 6. Vérification qualité et build

```bash
npm run validate            # lint + typecheck + tests
npm run build               # build de production
npm start                   # serveur de production (après build)
```

## 7. Intégration continue

Le workflow `.github/workflows/ci.yml` exécute automatiquement, sur chaque push et
pull request : installation, validation Prisma, migrations sur une base PostgreSQL 17
éphémère, lint, typecheck, tests, vérification DB et build de production.

## 8. Dépannage

### Environnement réseau restreint (sandbox, proxy d'entreprise)

Prisma télécharge normalement son binaire natif `schema-engine` depuis
`binaries.prisma.sh`. Si ce domaine est inaccessible :

- `prisma generate` et `prisma validate` fonctionnent avec le moteur WASM embarqué ;
  pour neutraliser la vérification du binaire, définir :

  ```bash
  PRISMA_SCHEMA_ENGINE_BINARY=$(command -v true) npx prisma generate
  ```

- Les commandes `prisma migrate dev/deploy` exigent le binaire natif : les exécuter
  depuis un environnement ayant accès à `binaries.prisma.sh`, ou appliquer les
  fichiers SQL de `prisma/migrations/` avec l'outil de votre choix (ils sont standards).

### Le port 5432 est déjà utilisé

Adapter le port dans `docker-compose.yml` **et** dans `DATABASE_URL` (`.env`).

### Réinitialiser la base locale (développement uniquement)

```bash
docker compose down -v      # SUPPRIME les données locales
docker compose up -d
npm run db:deploy && npm run db:seed
```

## 9. Sauvegardes (exploitation)

En production, prévoir des sauvegardes chiffrées et testées de PostgreSQL
(`pg_dump` planifié + rotation, restauration vérifiée régulièrement). La procédure
détaillée sera formalisée dans le module « Sécurité et déploiement ».
