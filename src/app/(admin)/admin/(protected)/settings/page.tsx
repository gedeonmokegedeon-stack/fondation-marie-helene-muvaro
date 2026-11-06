import { notFound, redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { getSiteSettings } from '@/lib/content'
import { SettingsForm } from '@/components/admin/settings-form'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/admin/connexion')
  if (!hasPermission(user.role, 'settings:write')) notFound()
  const settings = await getSiteSettings()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Paramètres du site</h1>
        <p className="mt-1 text-sm text-slate-500">
          Coordonnées officielles et messages publics. Ne renseigner que des informations validées.
        </p>
      </div>
      <SettingsForm initial={JSON.parse(JSON.stringify(settings))} />
    </div>
  )
}
