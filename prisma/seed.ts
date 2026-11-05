/**
 * Seed idempotent — contenus provisoires clairement identifiés.
 * Aucun utilisateur, partenaire, projet, actualité, rapport ou don inventé.
 * Les pages existantes ne sont pas écrasées afin de préserver les modifications admin.
 */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL est manquant.')

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

const pages = [
  {
    slug: 'a-propos',
    title: 'À propos de la Fondation Marie-Hélène Muvaro',
    summary: 'Une organisation humanitaire basée à Kinshasa, en République démocratique du Congo.',
    body: '## Présentation\nLa Fondation Marie-Hélène Muvaro est une organisation à vocation humanitaire basée à Kinshasa, en République démocratique du Congo. Son identité officielle repose sur trois mots : Solidarité, Dignité, Espoir.\n\n## Contenu provisoire\nL’historique officiel, la gouvernance et les textes fondateurs seront publiés après validation.\n\n## Engagement de présentation\n- Ne présenter que des informations validées.\n- Identifier clairement les contenus provisoires.\n- Documenter les projets, réalisations et rapports avant publication.',
  },
  {
    slug: 'vision-mission-valeurs',
    title: 'Vision, mission et valeurs',
    summary: 'Proposition de cadre institutionnel, à confirmer par les instances officielles.',
    body: '## Contenu provisoire — proposition de travail\nLes formulations ci-dessous ne constituent pas encore la vision ou la mission officiellement adoptée.\n\n## Vision proposée\nContribuer à des communautés plus dignes, plus solidaires et porteuses d’espoir.\n\n## Mission proposée\nMobiliser des compétences, des ressources et des partenariats au service d’actions humanitaires et communautaires, avec transparence.\n\n## Valeurs proposées\n- Solidarité\n- Dignité\n- Espoir\n- Transparence\n- Responsabilité',
  },
  {
    slug: 'domaines-intervention',
    title: 'Nos domaines d’intervention',
    summary: 'Pistes de travail proposées, ne décrivant pas des programmes déjà opérationnels.',
    body: '## Avertissement\nAucun domaine officiel n’a encore été communiqué. La liste suivante est une proposition de structure.\n\n## Éducation et formation\nPiste : accès au savoir et aux compétences.\n\n## Santé et bien-être\nPiste : soutien à des initiatives communautaires de santé.\n\n## Dignité et inclusion\nPiste : accompagnement des personnes en situation de vulnérabilité.\n\n## Développement communautaire\nPiste : solutions locales et durables.',
  },
  {
    slug: 'mentions-legales',
    title: 'Mentions légales',
    summary: 'Informations légales provisoires à compléter avec les données officielles.',
    body: '## Éditeur\nFondation Marie-Hélène Muvaro, Kinshasa, République démocratique du Congo.\n\n## À confirmer\nStatut juridique, numéro d’enregistrement, responsable de publication, adresse officielle, coordonnées et hébergeur.\n\nAucune information officielle manquante n’est inventée. Le formulaire de contact est le canal disponible.',
  },
  {
    slug: 'confidentialite',
    title: 'Politique de confidentialité',
    summary: 'Collecte, utilisation et protection des données personnelles.',
    body: '## Données collectées\nDonnées transmises via les formulaires : contact, bénévolat, intention de don.\n\n## Finalités\nRépondre aux demandes, examiner les candidatures, recontacter les donateurs potentiels et administrer le site.\n\n## Paiements\nAucun paiement actif. Aucune donnée de carte bancaire collectée.\n\n## Sécurité\nMots de passe hachés, sessions protégées, accès par rôles, limitation de débit et fichiers hors racine publique.\n\n## Conservation\nLes durées officielles seront précisées par la Fondation. Contact via le formulaire du site.',
  },
  {
    slug: 'conditions-dons',
    title: 'Conditions des dons',
    summary: 'Cadre provisoire applicable aux intentions de don.',
    body: '## État actuel\nAucune passerelle de paiement n’est opérationnelle.\n\n## Intention de don\nLe formulaire enregistre uniquement une intention, sans débit ni abonnement.\n\n## Confirmation future\nUn don ne sera confirmé qu’après vérification serveur d’une confirmation prestataire. Aucune donnée de carte n’est stockée.\n\n## Questions\nUtiliser le formulaire de contact. Les modalités officielles seront publiées avant activation des paiements.',
  },
]

async function main() {
  for (const entry of [
    { key: 'installation.name', value: 'Fondation Marie-Hélène Muvaro' },
    { key: 'installation.module', value: 'site-public-admin' },
  ]) {
    await prisma.systemMetadata.upsert({
      where: { key: entry.key },
      update: { value: entry.value },
      create: entry,
    })
  }

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: { ...page, status: 'PUBLISHED', publishedAt: new Date() },
    })
  }

  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      officialNote:
        'Les coordonnées officielles et informations institutionnelles complémentaires sont en cours de validation.',
      donationMessage:
        'Les paiements ne sont pas activés. Vous pouvez enregistrer une intention de don, sans transfert d’argent.',
      seoDescription:
        'Fondation humanitaire basée à Kinshasa, République démocratique du Congo. Solidarité · Dignité · Espoir.',
    },
  })

  console.log(
    `Seed appliqué : ${pages.length} pages provisoires, paramètres par défaut. Aucun contenu institutionnel inventé.`,
  )
}

main()
  .catch((error) => {
    console.error('Échec du seed :', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
