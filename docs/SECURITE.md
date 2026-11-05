# Sécurité

## 1. Mesures en place (Module 0)

| Mesure             | Détail                                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| En-têtes HTTP      | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictive ; en production : `X-Frame-Options: DENY` et `Strict-Transport-Security` |
| Divulgation        | `poweredByHeader: false` ; la sonde `/api/health` ne renvoie aucun détail interne                                                                                                                |
| Environnement      | Validation Zod stricte (`src/lib/env.ts`), échec explicite, aucun secret journalisé                                                                                                              |
| Secrets            | `.env` et variantes ignorés par Git ; seul `.env.example` (valeurs de démonstration) est versionné                                                                                               |
| Dépendances        | Versions figées (`package-lock.json`), Dependabot hebdomadaire, CI systématique                                                                                                                  |
| Indexation         | `robots: noindex` tant que le lancement officiel n'est pas validé                                                                                                                                |
| Base de données    | Accès via ORM typé (requêtes paramétrées), identifiants de développement clairement séparés                                                                                                      |
| Contenu provisoire | Composant `ProvisionalNotice` ; aucune donnée inventée                                                                                                                                           |

## 2. Mesures prévues (modules ultérieurs)

### Authentification et sessions

- Mots de passe hachés avec **Argon2id** (jamais en clair, jamais réversibles).
- Sessions côté serveur, cookies `HttpOnly` / `Secure` / `SameSite`, rotation et
  expiration ; protection CSRF sur les mutations.
- Verrouillage progressif / limitation de débit sur la connexion.

### Rôles et permissions (RBAC)

- Rôles distincts (super-administration, administration, contenu, dons, lecture…).
- Vérification des permissions côté serveur pour chaque route et mutation admin.
- Journal d'audit horodaté des opérations administratives (qui, quoi, quand).

### Formulaires et API

- Validation **Zod** systématique côté serveur (ne jamais faire confiance au client).
- Limitation de débit, protection anti-automatisation sur les formulaires publics.
- Politique **CSP** avec nonces définie avec l'authentification.

### Fichiers téléversés

- Liste blanche de types MIME + vérification de signature, taille maximale,
  noms neutralisés, stockage hors racine publique, service via route contrôlée.

### Dons

- Aucun paiement réel sans autorisation ; confirmation vérifiée côté serveur
  (webhooks signés / API prestataire) avant tout statut « payé ».
- Aucune donnée sensible de carte bancaire stockée (délégation au prestataire).
- Reçus et historique liés à des identifiants internes, pas à des données de carte.

### Exploitation

- Sauvegardes PostgreSQL chiffrées, planifiées et **testées en restauration**.
- Gestion des secrets via le gestionnaire de l'hébergeur (jamais dans le dépôt).
- Journalisation structurée sans données personnelles superflues.
- Politique de conservation des données conforme à la politique de confidentialité.

## 3. Règles permanentes

1. Ne jamais publier de clés API, mots de passe ou fichiers `.env`.
2. Ne jamais simuler un paiement réel.
3. Ne jamais stocker de données sensibles de carte bancaire.
4. Ne jamais fusionner sans autorisation ; présenter les modifications avant fusion.
5. Signaler toute vulnérabilité découverte à l'équipe technique de la Fondation
   (canal officiel à définir — aucune adresse n'est inventée à ce stade).
