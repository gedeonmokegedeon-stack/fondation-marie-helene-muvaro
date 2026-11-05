# Feuille de route

Développement autorisé module par module sur la branche de travail. Chaque grande étape
est vérifiée (lint, typecheck, tests, build) et fait l'objet d'un commit et d'un compte
rendu. Aucune fusion dans `main`, dépense ou déploiement public sans autorisation.

| Module                               | Contenu                                                                    | État                                             |
| ------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------ |
| **0 — Fondations techniques**        | Architecture, Next.js, TS, Tailwind, PostgreSQL, Prisma, CI, tests de base | Terminé                                          |
| **1 — Identité visuelle**            | Charte navy/or/ivoire, accueil, navigation responsive, composants          | Terminé                                          |
| **2 — Authentification**             | Sessions sécurisées, Argon2id, installation unique, rôles et permissions   | Terminé                                          |
| **3 — Administration**               | Tableau de bord, CRUD contenus, médias, paramètres, journal d'audit        | Terminé                                          |
| **4 — Contenus institutionnels**     | Pages publiques + pages CMS + mentions/confidentialité/conditions dons     | Terminé (contenus officiels à fournir)           |
| **5 — Projets et actions**           | Liste/détail projets, phases, médias, états vides honnêtes                 | Terminé (aucun projet inventé)                   |
| **6 — Actualités et événements**     | Liste/détail, filtre actualités/événements, dates                          | Terminé                                          |
| **7 — Partenaires et bénévoles**     | Annuaire partenaires validés, formulaire bénévolat, suivi admin            | Terminé                                          |
| **8 — Dons**                         | Intentions de don, architecture adaptateurs, garde-fous de confirmation    | Préparation terminée — aucune passerelle activée |
| **9 — Rapports et transparence**     | Publication rapports PDF, contrôle document obligatoire                    | Terminé (aucun rapport inventé)                  |
| **10 — Internationalisation**        | Architecture fr/en préparée                                                | Prévu                                            |
| **11 — Sécurité renforcée et tests** | Rate-limit, audit, origine, uploads, tests unitaires ; CSP/E2E à compléter | En cours                                         |
| **12 — Déploiement**                 | Dockerfile + compose production + docs exploitation                        | Préparé — aucun déploiement public effectué      |

## Garde-fous transverses

- Aucun contenu, chiffre, partenaire, témoignage ou coordonnée inventé.
- Contenus provisoires clairement identifiés.
- Identité officielle préservée (couleurs, slogan) sauf autorisation.
- Aucun paiement simulé ; confirmation uniquement après vérification prestataire.
- Aucun secret dans le dépôt ; aucune fusion sans autorisation.
