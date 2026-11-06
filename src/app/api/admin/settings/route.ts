import type { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { getSiteSettings } from '@/lib/content'
import { getPrisma } from '@/lib/db'
import { jsonError, readJson } from '@/lib/security'
import { settingsSchema } from '@/lib/validation'

export async function GET() {
  try {
    await requireUser('settings:write')
    return Response.json({ settings: await getSiteSettings() })
  } catch (error) {
    return jsonError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser('settings:write')
    const input = await readJson(request, settingsSchema)
    const data = Object.fromEntries(Object.entries(input).map(([k, v]) => [k, v === '' ? null : v]))
    const settings = await getPrisma().siteSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data },
    })
    await recordAudit({
      actorId: user.id,
      action: 'UPDATE',
      entity: 'settings',
      entityId: 'default',
      metadata: { fields: Object.keys(data) },
    })
    revalidatePath('/', 'layout')
    return Response.json({ settings })
  } catch (error) {
    return jsonError(error)
  }
}
