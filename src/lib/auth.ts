import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { hash, verify } from '@node-rs/argon2'
import { getPrisma } from '@/lib/db'
import { getAuthSecret, getServerEnv } from '@/lib/env'
import { hasPermission, type Permission } from '@/lib/permissions'
import type { Role } from '@/generated/prisma/enums'

export const SESSION_COOKIE = 'fmhm_session'
export const SESSION_ABSOLUTE_MS = 8 * 60 * 60 * 1000
export const SESSION_IDLE_MS = 30 * 60 * 1000

export type SafeUser = {
  id: string
  email: string
  name: string
  role: Role
  active: boolean
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status: 401 | 403 = 401,
  ) {
    super(message)
  }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    algorithm: 2, // Argon2id
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  })
}

export async function verifyPassword(encoded: string, password: string): Promise<boolean> {
  try {
    return await verify(encoded, password)
  } catch {
    return false
  }
}

function safeUser(user: {
  id: string
  email: string
  name: string
  role: Role
  active: boolean
}): SafeUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role, active: user.active }
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString('base64url')
  const now = Date.now()
  await getPrisma().session.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt: new Date(now + SESSION_ABSOLUTE_MS),
      lastSeenAt: new Date(now),
    },
  })
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: getServerEnv().NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_ABSOLUTE_MS / 1000,
  })
}

export async function getSessionUser(): Promise<SafeUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token || token.length > 256) return null

  const session = await getPrisma().session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  })
  const now = Date.now()
  if (
    !session ||
    !session.user.active ||
    session.expiresAt.getTime() <= now ||
    now - session.lastSeenAt.getTime() > SESSION_IDLE_MS
  ) {
    if (session)
      await getPrisma()
        .session.delete({ where: { id: session.id } })
        .catch(() => {})
    return null
  }

  if (now - session.lastSeenAt.getTime() > 60_000) {
    await getPrisma().session.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date(now) },
    })
  }
  return safeUser(session.user)
}

export async function requireUser(permission?: Permission): Promise<SafeUser> {
  const user = await getSessionUser()
  if (!user) throw new AuthError('Authentification requise.')
  if (permission && !hasPermission(user.role, permission)) {
    throw new AuthError('Vous n’avez pas la permission d’effectuer cette action.', 403)
  }
  return user
}

export async function destroyCurrentSession(): Promise<void> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    await getPrisma().session.deleteMany({ where: { tokenHash: hashToken(token) } })
  }
  store.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}

export async function destroyUserSessions(userId: string): Promise<void> {
  await getPrisma().session.deleteMany({ where: { userId } })
}

export async function authenticate(email: string, password: string): Promise<SafeUser> {
  const user = await getPrisma().user.findUnique({ where: { email: email.toLowerCase().trim() } })
  // Vérification factice pour réduire la différence de temps de réponse.
  const encoded =
    user?.passwordHash ??
    '$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  const valid = await verifyPassword(encoded, password)
  if (!user || !user.active || !valid) throw new AuthError('Identifiants invalides.')
  await createSession(user.id)
  return safeUser(user)
}

export function setupTokenMatches(provided: string | undefined): boolean {
  const expected = getServerEnv().ADMIN_SETUP_TOKEN
  if (!expected || !provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function getSetupState() {
  const count = await getPrisma().user.count()
  const env = getServerEnv()
  const available = count === 0 && (env.NODE_ENV !== 'production' || Boolean(env.ADMIN_SETUP_TOKEN))
  return { initialized: count > 0, available }
}

/** Création atomique du premier compte. Aucun mot de passe par défaut. */
export async function bootstrapAdmin(input: {
  name: string
  email: string
  password: string
  setupToken?: string
}) {
  const env = getServerEnv()
  getAuthSecret()
  if (env.NODE_ENV === 'production' && !setupTokenMatches(input.setupToken)) {
    throw new AuthError('Jeton d’installation requis en production.', 403)
  }
  const passwordHash = await hashPassword(input.password)
  const prisma = getPrisma()
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(728394651)`
    if ((await tx.user.count()) > 0)
      throw new AuthError('L’installation est déjà initialisée.', 403)
    const user = await tx.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase().trim(),
        passwordHash,
        role: 'SUPER_ADMIN',
      },
    })
    await tx.systemMetadata.upsert({
      where: { key: 'installation.admin_initialized' },
      update: { value: 'true' },
      create: { key: 'installation.admin_initialized', value: 'true' },
    })
    await tx.auditLog.create({
      data: { actorId: user.id, action: 'BOOTSTRAP_ADMIN', entity: 'user', entityId: user.id },
    })
    return safeUser(user)
  })
}

export { getAuthSecret }
