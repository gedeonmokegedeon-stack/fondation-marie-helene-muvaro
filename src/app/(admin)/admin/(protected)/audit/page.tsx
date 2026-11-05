import { notFound, redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { AuditTable } from '@/components/admin/audit-table'

export const dynamic = 'force-dynamic'

export default async function AuditPage() {
  const user = await getSessionUser()
  if (!user) redirect('/admin/connexion')
  if (!hasPermission(user.role, 'audit:read')) notFound()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Journal d’audit</h1>
        <p className="mt-1 text-sm text-slate-500">
          Opérations administratives horodatées. Aucun secret ni mot de passe n’est journalisé.
        </p>
      </div>
      <AuditTable />
    </div>
  )
}
