# Rapport de test final — Fondation Marie-Hélène Muvaro

**Date :** 5 novembre 2026 · **Branche :** `arena/d39603bc-fondation-marie-helene-muvaro` · **PR #1 : draft, non fusionnée**

Aucune donnée existante supprimée. Aucun déploiement public. Aucune dépense engagée. `main` intacte.

---

## 1. Ouvrir et utiliser le site

| Élément                    | Valeur                                                 |
| -------------------------- | ------------------------------------------------------ |
| Adresse locale             | **http://localhost:3000**                              |
| Aperçu dans Arena          | panneau **LIVE PREVIEW** du site (port 3000)           |
| Création du premier compte | **http://localhost:3000/installation**                 |
| Connexion administration   | **http://localhost:3000/admin/connexion**              |
| État actuel                | `initialized: false`: l'installation vous est réservée |

### Créer votre compte administrateur (aucun mot de passe prédéfini)

1. Ouvrez `/installation`.
2. Renseignez **votre nom**, **votre adresse e-mail** et **votre mot de passe**
   (12 caractères minimum, avec au moins une lettre et un chiffre).
3. Validez : le compte **super-administrateur** est créé et vous êtes connecté.
4. La page `/installation` se **verrouille définitivement** : plus aucun compte ne peut
   être créé par ce chemin. Les comptes suivants se créent depuis
   _Administration → Utilisateurs_.

En développement, aucun jeton n'est demandé. **En production**, un jeton
`ADMIN_SETUP_TOKEN` (défini dans `.env` du serveur) est exigé : c'est volontaire, pour
qu'un visiteur ne puisse pas s'emparer du site avant vous.

> Aucun identifiant ne m'a été communiqué et aucun mot de passe n'a été créé sur la base
> du site. Les comptes de test ont été créés uniquement dans des bases jetables séparées.

---

## 2. Méthode de test

Le site n'a pas été reconstruit. Les correctifs ont été appliqués module par module.

- **Navigateur réel** : Chromium piloté par Playwright, en **ordinateur 1440×900** et en
  **téléphone 390×844** (émulation iPhone, tactile) : clics, saisies, téléversements,
  captures d'écran, erreurs JavaScript, débordements horizontaux, images cassées.
- **Conditions de production** : clone neuf du dépôt → `npm ci` → génération Prisma →
  `next build` → serveur **standalone** lancé comme l'image Docker, sur des **bases
  PostgreSQL vierges** successives, avec `NODE_ENV=production`.
- **Vérification en base** : chaque enregistrement contrôlé par requête SQL directe.
- Les données de test (projets, partenaires, rapports « test ») vivent dans des bases
  isolées ; **la base du site est restée vide et propre**.

---

## 3. Résultats

| Bloc de contrôle                                                      | Résultat                                                                     |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Pages publiques — 16 routes × 2 appareils (32 chargements)            | **32/32** — HTTP 200, 1 titre H1, 0 débordement, 0 image cassée, 0 erreur JS |
| Navigation (menu mobile, fermeture, Échap, menus déroulants bureau)   | **7/7**                                                                      |
| Liens internes du site                                                | **14/14** — aucun lien cassé                                                 |
| Installation, connexion, protections, permissions, rôles              | **73/73**                                                                    |
| Contenus, médias, formulaires, dons, audit (avec vérification SQL)    | **72/72**                                                                    |
| Sessions, en-têtes, limitation de débit, admin mobile, liens admin    | **51/51**                                                                    |
| Docker — validation statique du Dockerfile et des compose             | **25/25**                                                                    |
| Installation propre VPS (clone → build → migrations → seed → serveur) | **réussie**                                                                  |
| `lint` · `typecheck` · `tests` · `build` · `db:check` · `format`      | **tous verts** (49 tests unitaires)                                          |
| CI GitHub Actions (push + PR)                                         | **verte**                                                                    |

---

## 4. Défauts trouvés et corrigés

### 4.1 Menu mobile inutilisable — critique

Le menu s'ouvrait (bouton passant à « ✕ ») mais **restait invisible et ses liens étaient
incliquables** sur téléphone. Le `backdrop-filter` du `<header>` créait un bloc contenant
qui écrasait le panneau `position: fixed` à environ 1 px de haut.
→ Panneau déplacé hors du header, plein écran. Test de non-régression ajouté.

### 4.2 Image Docker impossible à construire — critique

`.dockerignore` exclut `.env` et le Dockerfile ne passe aucun argument de build ; or le
layout racine exigeait `DATABASE_URL` dès le chargement du module. **`next build`
échouait dans l'image**, donc aucune installation VPS n'était possible.
→ Métadonnées calculées à la demande, lecture directe de `process.env` sans exiger la
base. Vérifié : build réussi **sans aucune variable d'environnement**. Effet de bord
positif : l'URL publique et l'indexation sont désormais modifiables **sans reconstruire
l'image**.

### 4.3 Fuite de l'empreinte du mot de passe — sécurité

La création d'un utilisateur renvoyait le **hash Argon2** dans la réponse JSON.
→ Empreinte retirée de la réponse (liste et modification l'étaient déjà).

### 4.4 `DATABASE_URL` pointant sur `localhost` en production

Le modèle `.env.example` faisait pointer l'application vers `localhost`, qui désigne le
conteneur lui-même : la connexion à la base aurait échoué sur le VPS.
→ `DATABASE_URL` dérivée automatiquement vers le service Docker `db`, nouveau modèle
`.env.production.example`, documentation corrigée.

### 4.5 Rapport publié sans PDF : erreur 500 générique

L'administrateur voyait « Une erreur interne est survenue » sans comprendre.
→ Erreur **422** avec le message « Un rapport publié doit être associé à un document PDF. »

### 4.6 Fiche de détail d'un don incomplète

Le **statut** (Intention / Confirmé) était absent, les libellés étaient les noms techniques
de la base (`donorName`, `providerReference`) et les valeurs brutes (`ONE_TIME`).
→ Statut affiché en premier, libellés français, valeurs traduites, champs techniques masqués.

### 4.7 Mention d'illustration masquée

La mention « image d'illustration générée » était partiellement cachée par la carte
« Kinshasa, RDC ». → Mention déplacée en haut du visuel, entièrement lisible.

### 4.8 Documentation des rôles inexacte

Elle attribuait « Paramètres » au rôle ADMIN alors que le code le réserve au
super-administrateur. → Documentation alignée sur la matrice réelle (moindre privilège),
et menu ADMIN re-vérifié en navigateur.

**Commits :** `7536da4` (menu mobile, mention) · `efc74a2` (sécurité, 422, fiches) ·
`0d2858b` (build Docker, `DATABASE_URL`, modèles `.env`).

---

## 5. Fonctionnalités réellement testées

**Site public** — les 12 pages et leurs variantes, en ordinateur et téléphone : accueil,
à propos, vision/mission/valeurs, domaines, projets (liste + détail), actualités et
événements (filtres compris), partenaires, bénévolat, don, rapports, contact, mentions
légales, confidentialité, conditions des dons, page 404, `sitemap.xml`, `robots.txt`.

**Installation et comptes** — création du premier super-administrateur depuis l'interface,
refus sans jeton en production, refus d'un mot de passe faible, verrouillage définitif,
seconde installation refusée, connexion, déconnexion, mauvais mot de passe refusé sans
divulguer l'existence du compte.

**Sécurité** — cookie de session `HttpOnly` + `Secure` + `SameSite=Lax` ; expiration après
30 min d'inactivité et 8 h en absolu ; révocation des sessions au changement de mot de
passe et à la désactivation ; compte désactivé refusé ; pages et API d'administration
fermées sans session (401/307) ; requête cross-origin refusée (403) ; type de contenu non
JSON refusé (415) ; corps surdimensionné refusé (413) ; **blocage après tentatives de
connexion répétées (429)** ; dernier super-administrateur protégé ; en-têtes `nosniff`,
`X-Frame-Options: DENY`, HSTS, `Referrer-Policy`, `Permissions-Policy`, `X-Powered-By` absent.

**Rôles** — les 7 rôles vérifiés un par un : menu latéral conforme, accès direct aux pages
interdites refusé, **escalade vers super-administrateur refusée (403)**.

**Contenus (avec contrôle SQL)** — projet créé depuis l'interface, brouillon invisible du
public, publication, apparition dans la liste et page détaillée, image de couverture
affichée, modification répercutée, archivage retirant la page **sans suppression en base** ;
actualité et événement avec dates, filtres corrects, événement sans date refusé ;
partenaire publié avec lien sortant protégé ; rapport refusé sans PDF, publié avec PDF,
téléchargeable par le public.

**Médias** — PNG téléversé depuis l'interface, **converti en WebP**, **EXIF retiré**, écrit
dans le volume privé hors racine publique, servi correctement ; PDF conservé intact et
servi en pièce jointe ; fichier texte et PDF déguisé en PNG **refusés (415)** ; traversal
de chemin refusé ; document privé non lié inaccessible au public mais lisible par
l'administration ; image privée liée à un contenu publié accessible.

**Formulaires** — message de contact et candidature de bénévole enregistrés en base avec
consentement, confirmation affichée, **pot de miel bloquant le robot sans écriture en
base**, suivi admin (statut, note) modifiable et persisté.

**Dons** — intention enregistrée (`FMHM-…`), statut **INTENT**, aucun `confirmedAt`, aucune
référence prestataire, aucun reçu, **aucun événement de paiement**, aucun champ de carte
bancaire, avertissement visible, **confirmation manuelle impossible (403)**, aucune
passerelle activée.

**Exploitation** — journal d'audit alimenté (`BOOTSTRAP_ADMIN`, `LOGIN`, `LOGOUT`, `CREATE`,
`UPDATE`, `UPLOAD`) sans mot de passe ; paramètres répercutés sur le site public ;
recherche et pagination admin ; les 13 liens du menu admin répondent ; administration
utilisable sur téléphone ; `noindex` tant que `PUBLIC_INDEXING=0`.

---

## 6. Docker et installation VPS

**Testé réellement** : clone neuf → `npm ci --ignore-scripts` → génération du client →
`next build` **sans aucune variable d'environnement** (condition exacte de l'image) →
migrations sur base vierge → seed → assemblage du layout `standalone` (`public`,
`.next/standalone`, `.next/static`) → lancement `node server.js` en `NODE_ENV=production`
avec volume de stockage séparé. **Toute la batterie de tests ci-dessus a été exécutée
contre cette instance.** Les 25 contrôles statiques du Dockerfile et des compose passent.

**Non exécuté — limite d'environnement, pas du projet** : `docker build` et
`docker compose up` eux-mêmes. Docker est absent du bac à sable et **Docker Hub est
injoignable** depuis cet environnement (`registry-1.docker.io` : échec de connexion), donc
`node:22-alpine` et `postgres:17-alpine` ne peuvent pas être téléchargés. Les binaires
`docker`/`hadolint` ne sont pas téléchargeables non plus (les fichiers de release GitHub
redirigent vers un domaine bloqué).

Conséquence honnête : **la chaîne applicative est validée de bout en bout ; la construction
de l'image reste à confirmer sur le VPS** par `docker compose -f docker-compose.prod.yml up -d --build`.
Le workflow CI exécute par ailleurs `prisma migrate deploy` sur une base PostgreSQL 17
vierge à chaque push, ce qui valide l'étape de migration de l'image.

---

## 7. Défauts restants et limites

Aucun défaut bloquant connu. Points restants, par nature :

1. **Construction de l'image Docker non exécutée ici** (voir §6) — à confirmer sur le VPS.
2. **`PATCH` d'administration attend l'objet complet** : une mise à jour partielle par API
   renvoie 422. L'interface envoie toujours l'objet complet, donc aucun impact utilisateur ;
   à savoir pour une future intégration externe.
3. **Paiements non intégrés** — M-Pesa, Airtel Money, Orange Money et international
   affichés « non activé ». Aucune passerelle ne peut être activée sans contrat,
   secrets et autorisation explicite.
4. **Contenus officiels manquants** — historique, gouvernance, domaines validés, projets,
   partenaires, rapports, coordonnées. Les pages affichent des états vides honnêtes et des
   mentions « contenu provisoire ». Aucun chiffre ni réalisation inventés.
5. **HTTPS obligatoire en production** — les cookies `Secure` ne sont transmis qu'en
   HTTPS ; un reverse proxy TLS est requis (documenté).
6. **CSP stricte et tests E2E dans la CI** non ajoutés ; la suite navigateur de ce contrôle
   est hors dépôt pour ne pas alourdir la CI.
7. **Version anglaise** non développée (architecture i18n préparée).
8. **Sauvegarde `pg_dump` native** documentée mais non exécutée ici (le PostgreSQL du bac à
   sable n'embarque pas `pg_dump`) ; une restauration logique avait été démontrée
   lors de l'audit précédent.

---

## 8. Coût d'hébergement estimé (objectif ≤ 25 USD/mois)

Aucune dépense engagée. Estimations issues de l'audit de coûts précédent, à reconfirmmer
chez le fournisseur au moment de la commande.

### Option A — recommandée : ≈ 6 à 8 USD/mois

| Poste                                             | Estimation       |
| ------------------------------------------------- | ---------------- |
| VPS 2 vCPU / 4 Go / 40 Go (Hetzner CX22, ~4,49 €) | ≈ 5 $/mois       |
| Sauvegardes hors serveur (objet, quelques Go)     | ≈ 0,10–1 $/mois  |
| Domaine `.org` (~11–12 $/an, amorti)              | ≈ 1 $/mois       |
| TLS Let's Encrypt, PostgreSQL conteneurisé        | 0 $              |
| **Total**                                         | **≈ 6–8 $/mois** |

### Option B — confort : ≈ 11 à 12 USD/mois

Option A + boîte de stockage 1 To (~3,80 €) + snapshots automatiques (+20 % du VPS).

**À éviter sous ce budget** : VPS 4 Go chez DigitalOcean/Vultr (~24 $) plus le domaine
atteint le plafond ; une base PostgreSQL managée approcherait ou dépasserait 25 $ à elle
seule. D'où PostgreSQL conteneurisé sur le même VPS.

**Hors budget de fonctionnement** : frais par transaction des prestataires de paiement,
à négocier lors de l'intégration réelle.

---

## 9. Prochaines étapes proposées

1. Vous ouvrez `/installation` et créez votre compte — le site est utilisable immédiatement.
2. Vous saisissez les contenus officiels depuis l'administration (textes, projets,
   partenaires, rapports PDF, coordonnées).
3. Vous décidez de l'hébergement ; je préparerai alors la mise en production
   (reverse proxy TLS, sauvegardes, `PUBLIC_INDEXING`) **après votre autorisation**.
4. Intégration des paiements seulement après contrat, secrets et accord explicite.

**Interdits respectés** : `main` non modifiée, PR #1 non fusionnée, aucun déploiement
public, aucune dépense, aucune donnée existante supprimée.
