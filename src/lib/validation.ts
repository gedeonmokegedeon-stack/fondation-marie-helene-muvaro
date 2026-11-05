import { z } from 'zod'
import { emailSchema, passwordSchema, slugSchema } from '@/lib/security'

export const publicationStatus = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
export const requestStatus = z.enum([
  'NEW',
  'IN_REVIEW',
  'ACCEPTED',
  'DECLINED',
  'RESOLVED',
  'ARCHIVED',
])

const shortText = (max: number) => z.string().trim().min(1).max(max)
const longText = (max: number) => z.string().trim().min(1).max(max)
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(''))
const optionalDate = z.union([z.string().datetime(), z.literal(''), z.null()]).optional()

export const pageSchema = z.object({
  slug: slugSchema,
  title: shortText(180),
  summary: longText(600),
  body: longText(50000),
  status: publicationStatus.default('DRAFT'),
  seoTitle: optionalText(180),
  seoDescription: optionalText(320),
})

export const projectSchema = z.object({
  slug: slugSchema,
  title: shortText(180),
  summary: longText(600),
  body: longText(50000),
  location: optionalText(180),
  phase: z.enum(['PROPOSED', 'PLANNED', 'ACTIVE', 'COMPLETED']).default('PROPOSED'),
  status: publicationStatus.default('DRAFT'),
  startDate: optionalDate,
  endDate: optionalDate,
  coverImageId: z.string().cuid().optional().or(z.literal('')),
})

export const postSchema = z
  .object({
    slug: slugSchema,
    title: shortText(180),
    excerpt: longText(600),
    body: longText(50000),
    kind: z.enum(['NEWS', 'EVENT']).default('NEWS'),
    status: publicationStatus.default('DRAFT'),
    location: optionalText(180),
    eventStartsAt: optionalDate,
    eventEndsAt: optionalDate,
    coverImageId: z.string().cuid().optional().or(z.literal('')),
  })
  .refine((v) => v.kind !== 'EVENT' || Boolean(v.eventStartsAt), {
    message: 'Un événement nécessite une date de début.',
    path: ['eventStartsAt'],
  })

export const partnerSchema = z.object({
  name: shortText(160),
  description: longText(2000),
  website: z.union([z.literal(''), z.url()]).optional(),
  logoId: z.string().cuid().optional().or(z.literal('')),
  status: publicationStatus.default('DRAFT'),
  sortOrder: z.coerce.number().int().min(0).max(10000).default(0),
})

export const reportSchema = z.object({
  slug: slugSchema,
  title: shortText(180),
  summary: longText(1000),
  year: z.coerce.number().int().min(1900).max(2100),
  category: shortText(80),
  documentId: z.string().cuid().optional().or(z.literal('')),
  status: publicationStatus.default('DRAFT'),
})

export const contactSchema = z.object({
  name: shortText(120),
  email: emailSchema,
  subject: shortText(180),
  message: longText(5000),
  consent: z.literal(true, { message: 'Votre consentement est requis.' }),
  website: z.literal('').optional(), // pot de miel
})

export const volunteerSchema = z.object({
  name: shortText(120),
  email: emailSchema,
  phone: optionalText(40),
  city: shortText(120),
  skills: longText(1500),
  availability: shortText(300),
  motivation: longText(4000),
  consent: z.literal(true, { message: 'Votre consentement est requis.' }),
  website: z.literal('').optional(),
})

export const donationIntentSchema = z.object({
  donorName: shortText(120),
  donorEmail: emailSchema,
  donorPhone: optionalText(40),
  amount: z.coerce.number().positive().max(1_000_000_000).multipleOf(0.01),
  currency: z.enum(['USD', 'CDF', 'EUR']).default('USD'),
  frequency: z.enum(['ONE_TIME', 'MONTHLY']).default('ONE_TIME'),
  provider: z
    .enum(['UNASSIGNED', 'MPESA', 'AIRTEL_MONEY', 'ORANGE_MONEY', 'INTERNATIONAL'])
    .default('UNASSIGNED'),
  message: optionalText(1000),
  consent: z.literal(true, { message: 'Votre consentement est requis.' }),
  website: z.literal('').optional(),
})

export const settingsSchema = z.object({
  contactEmail: z.union([z.literal(''), emailSchema]).optional(),
  contactPhone: optionalText(40),
  address: optionalText(300),
  officialNote: optionalText(2000),
  donationMessage: optionalText(2000),
  seoDescription: optionalText(320),
})

export const userCreateSchema = z.object({
  name: shortText(120),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum([
    'SUPER_ADMIN',
    'ADMIN',
    'EDITOR',
    'VOLUNTEER_MANAGER',
    'DONATION_MANAGER',
    'REPORT_MANAGER',
    'AUDITOR',
  ]),
  active: z.boolean().default(true),
})

export const userUpdateSchema = z.object({
  name: shortText(120),
  email: emailSchema,
  role: z.enum([
    'SUPER_ADMIN',
    'ADMIN',
    'EDITOR',
    'VOLUNTEER_MANAGER',
    'DONATION_MANAGER',
    'REPORT_MANAGER',
    'AUDITOR',
  ]),
  active: z.boolean(),
  password: z.union([z.literal(''), passwordSchema]).optional(),
})

export const setupSchema = z.object({
  name: shortText(120),
  email: emailSchema,
  password: passwordSchema,
  setupToken: z.string().max(256).optional(),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
})

export type ContactInput = z.infer<typeof contactSchema>
export type VolunteerInput = z.infer<typeof volunteerSchema>
export type DonationIntentInput = z.infer<typeof donationIntentSchema>
