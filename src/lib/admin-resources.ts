import { z } from 'zod'
import { getPrisma } from '@/lib/db'
import type { Permission } from '@/lib/permissions'
import {
  pageSchema,
  projectSchema,
  postSchema,
  partnerSchema,
  reportSchema,
  userCreateSchema,
  userUpdateSchema,
  requestStatus,
} from '@/lib/validation'

export type AdminField = {
  name: string
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'email'
    | 'url'
    | 'number'
    | 'datetime'
    | 'select'
    | 'checkbox'
    | 'image'
    | 'document'
    | 'password'
  options?: { value: string; label: string }[]
  help?: string
  required?: boolean
  rows?: number
}

export type ResourceKey =
  | 'pages'
  | 'projects'
  | 'posts'
  | 'partners'
  | 'reports'
  | 'contacts'
  | 'volunteers'
  | 'donations'
  | 'users'
  | 'media'

type GenericDelegate = {
  findMany: (args: unknown) => Promise<Record<string, unknown>[]>
  count: (args: unknown) => Promise<number>
  findUnique: (args: unknown) => Promise<Record<string, unknown> | null>
  create: (args: unknown) => Promise<Record<string, unknown>>
  update: (args: unknown) => Promise<Record<string, unknown>>
}

export type ResourceConfig = {
  key: ResourceKey
  label: string
  singular: string
  description: string
  permission: Permission
  readPermission?: Permission
  model: string
  fields: AdminField[]
  columns: string[]
  searchFields: string[]
  orderBy: Record<string, 'asc' | 'desc'>
  schema: z.ZodType
  updateSchema?: z.ZodType
  creatable: boolean
  editable: boolean
  select?: Record<string, boolean>
}

const publicationOptions = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PUBLISHED', label: 'Publié' },
  { value: 'ARCHIVED', label: 'Archivé' },
]
const requestOptions = [
  { value: 'NEW', label: 'Nouveau' },
  { value: 'IN_REVIEW', label: 'En examen' },
  { value: 'ACCEPTED', label: 'Accepté' },
  { value: 'DECLINED', label: 'Non retenu' },
  { value: 'RESOLVED', label: 'Traité' },
  { value: 'ARCHIVED', label: 'Archivé' },
]
const roleOptions = [
  { value: 'SUPER_ADMIN', label: 'Super-administration' },
  { value: 'ADMIN', label: 'Administration' },
  { value: 'EDITOR', label: 'Contenus' },
  { value: 'VOLUNTEER_MANAGER', label: 'Bénévoles et contacts' },
  { value: 'DONATION_MANAGER', label: 'Suivi des dons' },
  { value: 'REPORT_MANAGER', label: 'Rapports et documents' },
  { value: 'AUDITOR', label: 'Audit / lecture' },
]

const statusField: AdminField = {
  name: 'status',
  label: 'Publication',
  type: 'select',
  options: publicationOptions,
}
const slugField: AdminField = {
  name: 'slug',
  label: 'Identifiant URL (slug)',
  type: 'text',
  required: true,
  help: 'Exemple : mon-projet',
}
const coverField: AdminField = {
  name: 'coverImageId',
  label: 'Image de couverture',
  type: 'image',
  help: 'Choisir une image téléversée dans la médiathèque.',
}

export const RESOURCES: Record<ResourceKey, ResourceConfig> = {
  pages: {
    key: 'pages',
    label: 'Pages et contenus',
    singular: 'Page',
    description: 'Contenus institutionnels modifiables, publiables et archivables.',
    permission: 'content:write',
    model: 'page',
    fields: [
      slugField,
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'summary', label: 'Résumé', type: 'textarea', required: true, rows: 3 },
      {
        name: 'body',
        label: 'Contenu',
        type: 'textarea',
        required: true,
        rows: 14,
        help: 'Texte simple. Lignes ## pour les titres, - pour les listes. Aucun HTML autorisé.',
      },
      statusField,
      { name: 'seoTitle', label: 'Titre SEO', type: 'text' },
      { name: 'seoDescription', label: 'Description SEO', type: 'textarea', rows: 2 },
    ],
    columns: ['title', 'slug', 'status', 'updatedAt'],
    searchFields: ['title', 'slug', 'summary'],
    orderBy: { updatedAt: 'desc' },
    schema: pageSchema,
    creatable: true,
    editable: true,
  },
  projects: {
    key: 'projects',
    label: 'Projets et réalisations',
    singular: 'Projet',
    description: 'Publier uniquement des projets et réalisations validés par la Fondation.',
    permission: 'content:write',
    model: 'project',
    fields: [
      slugField,
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'summary', label: 'Résumé', type: 'textarea', required: true, rows: 3 },
      { name: 'body', label: 'Description détaillée', type: 'textarea', required: true, rows: 12 },
      { name: 'location', label: 'Lieu', type: 'text' },
      {
        name: 'phase',
        label: 'État du projet',
        type: 'select',
        options: [
          { value: 'PROPOSED', label: 'Proposition à valider' },
          { value: 'PLANNED', label: 'Planifié' },
          { value: 'ACTIVE', label: 'En cours' },
          { value: 'COMPLETED', label: 'Terminé' },
        ],
      },
      statusField,
      { name: 'startDate', label: 'Date de début', type: 'datetime' },
      { name: 'endDate', label: 'Date de fin', type: 'datetime' },
      coverField,
    ],
    columns: ['title', 'phase', 'status', 'updatedAt'],
    searchFields: ['title', 'summary', 'location'],
    orderBy: { updatedAt: 'desc' },
    schema: projectSchema,
    creatable: true,
    editable: true,
  },
  posts: {
    key: 'posts',
    label: 'Actualités et événements',
    singular: 'Publication',
    description: 'Actualités vérifiées et événements confirmés.',
    permission: 'content:write',
    model: 'post',
    fields: [
      slugField,
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'excerpt', label: 'Chapeau', type: 'textarea', required: true, rows: 3 },
      { name: 'body', label: 'Contenu', type: 'textarea', required: true, rows: 12 },
      {
        name: 'kind',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'NEWS', label: 'Actualité' },
          { value: 'EVENT', label: 'Événement' },
        ],
      },
      statusField,
      { name: 'location', label: 'Lieu', type: 'text' },
      { name: 'eventStartsAt', label: 'Début de l’événement', type: 'datetime' },
      { name: 'eventEndsAt', label: 'Fin de l’événement', type: 'datetime' },
      coverField,
    ],
    columns: ['title', 'kind', 'status', 'publishedAt'],
    searchFields: ['title', 'excerpt'],
    orderBy: { updatedAt: 'desc' },
    schema: postSchema,
    creatable: true,
    editable: true,
  },
  partners: {
    key: 'partners',
    label: 'Partenaires',
    singular: 'Partenaire',
    description: 'Aucun partenaire n’est ajouté sans information officielle validée.',
    permission: 'partners:write',
    model: 'partner',
    fields: [
      { name: 'name', label: 'Nom officiel', type: 'text', required: true },
      {
        name: 'description',
        label: 'Description validée',
        type: 'textarea',
        required: true,
        rows: 5,
      },
      { name: 'website', label: 'Site officiel', type: 'url' },
      { name: 'logoId', label: 'Logo', type: 'image' },
      statusField,
      { name: 'sortOrder', label: 'Ordre d’affichage', type: 'number' },
    ],
    columns: ['name', 'status', 'sortOrder', 'updatedAt'],
    searchFields: ['name', 'description'],
    orderBy: { sortOrder: 'asc' },
    schema: partnerSchema,
    creatable: true,
    editable: true,
  },
  reports: {
    key: 'reports',
    label: 'Rapports et transparence',
    singular: 'Rapport',
    description: 'Rapports d’activités, financiers ou autres documents validés.',
    permission: 'reports:write',
    model: 'report',
    fields: [
      slugField,
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'summary', label: 'Résumé', type: 'textarea', required: true, rows: 4 },
      { name: 'year', label: 'Année', type: 'number', required: true },
      { name: 'category', label: 'Catégorie', type: 'text', required: true },
      { name: 'documentId', label: 'Document PDF', type: 'document' },
      statusField,
    ],
    columns: ['title', 'year', 'category', 'status'],
    searchFields: ['title', 'summary', 'category'],
    orderBy: { year: 'desc' },
    schema: reportSchema,
    creatable: true,
    editable: true,
  },
  contacts: {
    key: 'contacts',
    label: 'Demandes de contact',
    singular: 'Demande',
    description: 'Messages reçus via le formulaire public.',
    permission: 'contacts:write',
    readPermission: 'contacts:read',
    model: 'contactRequest',
    fields: [
      { name: 'status', label: 'Statut', type: 'select', options: requestOptions },
      { name: 'adminNote', label: 'Note interne', type: 'textarea', rows: 4 },
    ],
    columns: ['name', 'email', 'subject', 'status', 'createdAt'],
    searchFields: ['name', 'email', 'subject'],
    orderBy: { createdAt: 'desc' },
    schema: z.object({ status: requestStatus, adminNote: z.string().max(5000).default('') }),
    creatable: false,
    editable: true,
  },
  volunteers: {
    key: 'volunteers',
    label: 'Bénévoles',
    singular: 'Candidature',
    description: 'Candidatures reçues et suivi de leur examen.',
    permission: 'volunteers:write',
    readPermission: 'volunteers:read',
    model: 'volunteerApplication',
    fields: [
      { name: 'status', label: 'Statut', type: 'select', options: requestOptions },
      { name: 'adminNote', label: 'Note interne', type: 'textarea', rows: 4 },
    ],
    columns: ['name', 'email', 'city', 'availability', 'status', 'createdAt'],
    searchFields: ['name', 'email', 'city', 'skills'],
    orderBy: { createdAt: 'desc' },
    schema: z.object({ status: requestStatus, adminNote: z.string().max(5000).default('') }),
    creatable: false,
    editable: true,
  },
  donations: {
    key: 'donations',
    label: 'Dons et intentions',
    singular: 'Don',
    description: 'Suivi en lecture seule. Une intention n’est jamais un paiement confirmé.',
    permission: 'donations:read',
    model: 'donation',
    fields: [],
    columns: ['reference', 'donorName', 'amount', 'currency', 'provider', 'status', 'createdAt'],
    searchFields: ['reference', 'donorName', 'donorEmail'],
    orderBy: { createdAt: 'desc' },
    schema: z.object({}),
    creatable: false,
    editable: false,
  },
  users: {
    key: 'users',
    label: 'Utilisateurs et rôles',
    singular: 'Utilisateur',
    description: 'Comptes administratifs et permissions. Réservé à la super-administration.',
    permission: 'users:manage',
    model: 'user',
    fields: [
      { name: 'name', label: 'Nom', type: 'text', required: true },
      { name: 'email', label: 'Adresse e-mail', type: 'email', required: true },
      {
        name: 'password',
        label: 'Mot de passe',
        type: 'password',
        help: 'Laisser vide pour conserver le mot de passe actuel.',
      },
      { name: 'role', label: 'Rôle', type: 'select', options: roleOptions },
      { name: 'active', label: 'Compte actif', type: 'checkbox' },
    ],
    columns: ['name', 'email', 'role', 'active', 'createdAt'],
    searchFields: ['name', 'email'],
    orderBy: { createdAt: 'asc' },
    schema: userCreateSchema,
    updateSchema: userUpdateSchema,
    creatable: true,
    editable: true,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  media: {
    key: 'media',
    label: 'Médiathèque',
    singular: 'Média',
    description:
      'Images et PDF stockés hors de la racine publique, servis par une route contrôlée.',
    permission: 'media:write',
    model: 'mediaAsset',
    fields: [
      {
        name: 'alt',
        label: 'Texte alternatif',
        type: 'text',
        help: 'Obligatoire pour les images publiées.',
      },
      { name: 'caption', label: 'Légende / source', type: 'textarea', rows: 3 },
      { name: 'isPublic', label: 'Accessible publiquement', type: 'checkbox' },
    ],
    columns: ['originalName', 'kind', 'mimeType', 'sizeBytes', 'isPublic', 'createdAt'],
    searchFields: ['originalName', 'alt', 'caption'],
    orderBy: { createdAt: 'desc' },
    schema: z.object({
      alt: z.string().max(300).default(''),
      caption: z.string().max(500).default(''),
      isPublic: z.boolean().default(false),
    }),
    creatable: false,
    editable: true,
  },
}

export function getResource(key: string): ResourceConfig | null {
  return Object.hasOwn(RESOURCES, key) ? RESOURCES[key as ResourceKey] : null
}

export function resourceDelegate(config: ResourceConfig): GenericDelegate {
  const prisma = getPrisma() as unknown as Record<string, GenericDelegate>
  const delegate = prisma[config.model]
  if (!delegate) throw new Error('Ressource inconnue')
  return delegate
}

const NULLABLE = new Set([
  'seoTitle',
  'seoDescription',
  'location',
  'startDate',
  'endDate',
  'eventStartsAt',
  'eventEndsAt',
  'coverImageId',
  'logoId',
  'website',
  'documentId',
  'contactEmail',
  'contactPhone',
  'address',
  'officialNote',
  'donationMessage',
])
const DATES = new Set(['startDate', 'endDate', 'eventStartsAt', 'eventEndsAt'])

export function normalizeData(
  config: ResourceConfig,
  input: Record<string, unknown>,
  existing?: Record<string, unknown> | null,
) {
  const data: Record<string, unknown> = { ...input }
  for (const key of Object.keys(data)) {
    if (NULLABLE.has(key) && (data[key] === '' || data[key] === undefined)) data[key] = null
    if (DATES.has(key) && typeof data[key] === 'string')
      data[key] = data[key] ? new Date(data[key]) : null
  }
  if (['pages', 'projects', 'posts', 'partners', 'reports'].includes(config.key)) {
    data.publishedAt = data.status === 'PUBLISHED' ? (existing?.publishedAt ?? new Date()) : null
  }
  if (
    config.key === 'reports' &&
    data.status === 'PUBLISHED' &&
    !data.documentId &&
    !existing?.documentId
  ) {
    throw new Error('Un rapport publié doit être associé à un document PDF.')
  }
  return data
}

export function publicResourceConfig(config: ResourceConfig) {
  return {
    key: config.key,
    label: config.label,
    singular: config.singular,
    description: config.description,
    fields: config.fields,
    columns: config.columns,
    creatable: config.creatable,
    editable: config.editable,
  }
}
