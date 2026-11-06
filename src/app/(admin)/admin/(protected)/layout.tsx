import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { AdminShell } from '@/components/admin/admin-shell'

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser()
  if (!user) redirect('/admin/connexion')
  return <AdminShell user={user}>{children}</AdminShell>
}
