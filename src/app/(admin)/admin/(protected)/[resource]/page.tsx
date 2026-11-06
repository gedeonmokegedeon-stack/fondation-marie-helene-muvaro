import { notFound, redirect } from 'next/navigation'
import { getResource, publicResourceConfig, resourceDelegate } from '@/lib/admin-resources'
import { getSessionUser } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { ResourceAdmin } from '@/components/admin/resource-admin'
import { MediaUpload } from '@/components/admin/media-upload'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ resource: string }> }

export default async function ResourcePage({ params }: Props) {
  const { resource } = await params
  const config = getResource(resource)
  if (!config) notFound()
  const user = await getSessionUser()
  if (!user) redirect('/admin/connexion')
  if (!hasPermission(user.role, config.readPermission ?? config.permission)) notFound()
  const delegate = resourceDelegate(config)
  const [rows, total] = await Promise.all([
    delegate.findMany({
      orderBy: config.orderBy,
      take: 20,
      ...(config.select ? { select: config.select } : {}),
    }),
    delegate.count({}),
  ])
  return (
    <div className="space-y-6">
      {resource === 'media' && hasPermission(user.role, 'media:write') && <MediaUpload />}
      <ResourceAdmin
        config={publicResourceConfig(config)}
        initialRows={JSON.parse(JSON.stringify(rows))}
        initialTotal={total}
      />
    </div>
  )
}
