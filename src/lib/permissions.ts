import type { Role } from '@/generated/prisma/enums'

export const PERMISSIONS = [
  'content:write',
  'media:write',
  'partners:write',
  'volunteers:read',
  'volunteers:write',
  'contacts:read',
  'contacts:write',
  'donations:read',
  'reports:write',
  'users:manage',
  'settings:write',
  'audit:read',
] as const

export type Permission = (typeof PERMISSIONS)[number]

const ALL = [...PERMISSIONS]

const MATRIX: Record<Role, readonly Permission[]> = {
  SUPER_ADMIN: ALL,
  ADMIN: [
    'content:write',
    'media:write',
    'partners:write',
    'volunteers:read',
    'volunteers:write',
    'contacts:read',
    'contacts:write',
    'donations:read',
    'reports:write',
    'audit:read',
  ],
  EDITOR: ['content:write', 'media:write', 'partners:write', 'reports:write'],
  VOLUNTEER_MANAGER: ['volunteers:read', 'volunteers:write', 'contacts:read', 'contacts:write'],
  DONATION_MANAGER: ['donations:read'],
  REPORT_MANAGER: ['reports:write', 'media:write'],
  AUDITOR: ['audit:read', 'donations:read', 'volunteers:read', 'contacts:read'],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return MATRIX[role].includes(permission)
}

export function permissionsFor(role: Role): readonly Permission[] {
  return MATRIX[role]
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super-administration',
  ADMIN: 'Administration',
  EDITOR: 'Contenus',
  VOLUNTEER_MANAGER: 'Bénévoles et contacts',
  DONATION_MANAGER: 'Suivi des dons',
  REPORT_MANAGER: 'Rapports et documents',
  AUDITOR: 'Audit / lecture',
}
