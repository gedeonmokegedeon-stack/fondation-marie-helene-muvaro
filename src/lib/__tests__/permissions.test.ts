import { describe, expect, it } from 'vitest'
import { hasPermission, permissionsFor, PERMISSIONS } from '@/lib/permissions'

describe('matrice de permissions', () => {
  it('donne tous les droits au super-administrateur', () => {
    for (const permission of PERMISSIONS)
      expect(hasPermission('SUPER_ADMIN', permission)).toBe(true)
  })

  it('réserve la gestion des utilisateurs au super-administrateur', () => {
    expect(hasPermission('ADMIN', 'users:manage')).toBe(false)
    expect(hasPermission('EDITOR', 'users:manage')).toBe(false)
    expect(hasPermission('SUPER_ADMIN', 'users:manage')).toBe(true)
  })

  it('limite les rôles métier à leur périmètre', () => {
    expect(hasPermission('EDITOR', 'content:write')).toBe(true)
    expect(hasPermission('EDITOR', 'donations:read')).toBe(false)
    expect(hasPermission('DONATION_MANAGER', 'donations:read')).toBe(true)
    expect(hasPermission('DONATION_MANAGER', 'content:write')).toBe(false)
    expect(hasPermission('VOLUNTEER_MANAGER', 'volunteers:read')).toBe(true)
    expect(hasPermission('VOLUNTEER_MANAGER', 'reports:write')).toBe(false)
    expect(hasPermission('REPORT_MANAGER', 'reports:write')).toBe(true)
    expect(hasPermission('AUDITOR', 'audit:read')).toBe(true)
    expect(hasPermission('AUDITOR', 'settings:write')).toBe(false)
  })

  it('expose une liste de permissions cohérente', () => {
    expect(permissionsFor('ADMIN').length).toBeGreaterThan(0)
    expect(permissionsFor('ADMIN').every((p) => PERMISSIONS.includes(p))).toBe(true)
  })
})
