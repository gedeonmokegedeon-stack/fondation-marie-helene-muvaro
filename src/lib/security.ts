import { createHash } from 'node:crypto'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAuthSecret, getServerEnv, getSiteUrl } from '@/lib/env'

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400,
    public details?: unknown,
  ) {
    super(message)
  }
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      { error: error.message, ...(error.details ? { details: error.details } : {}) },
      { status: error.status },
    )
  }
  if (error instanceof z.ZodError) {
    return Response.json(
      {
        error: 'Données invalides.',
        details: error.issues.map((i) => ({ path: i.path, message: i.message })),
      },
      { status: 422 },
    )
  }
  if (error && typeof error === 'object' && 'status' in error && typeof error.status === 'number') {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Accès refusé.' },
      { status: error.status },
    )
  }
  console.error('[api] erreur interne', error instanceof Error ? error.name : 'unknown')
  return Response.json({ error: 'Une erreur interne est survenue.' }, { status: 500 })
}

/** Les mutations JSON n'acceptent pas d'origine tierce explicite. */
export function assertTrustedOrigin(request: NextRequest): void {
  const origin = request.headers.get('origin')
  if (!origin) return
  let originUrl: URL
  try {
    originUrl = new URL(origin)
  } catch {
    throw new ApiError('Origine invalide.', 403)
  }
  const host = request.headers.get('host')
  const configured = new URL(getSiteUrl()).host
  const isDevPreview =
    getServerEnv().NODE_ENV !== 'production' &&
    (originUrl.hostname.endsWith('.e2b.app') ||
      originUrl.hostname === 'localhost' ||
      originUrl.hostname === '127.0.0.1')
  if (originUrl.host !== host && originUrl.host !== configured && !isDevPreview) {
    throw new ApiError('Origine non autorisée.', 403)
  }
}

export async function readJson<T>(request: NextRequest, schema: z.ZodType<T>): Promise<T> {
  assertTrustedOrigin(request)
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new ApiError('Content-Type application/json requis.', 415)
  }
  const text = await request.text()
  if (text.length > 128_000) throw new ApiError('Requête trop volumineuse.', 413)
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    throw new ApiError('JSON invalide.', 400)
  }
  return schema.parse(value)
}

export function clientRateKey(request: NextRequest, scope: string): string {
  const env = getServerEnv()
  const forwarded =
    env.TRUST_PROXY === '1'
      ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      : undefined
  const address = forwarded || 'local'
  return createHash('sha256').update(`${getAuthSecret()}:${scope}:${address}`).digest('hex')
}

export const passwordSchema = z
  .string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères.')
  .max(128)
  .regex(/[a-zA-Z]/, 'Ajoutez au moins une lettre.')
  .regex(/[0-9]/, 'Ajoutez au moins un chiffre.')

export const emailSchema = z.string().trim().toLowerCase().email().max(254)
export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(140)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide : lettres minuscules, chiffres et tirets.')

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140)
}
