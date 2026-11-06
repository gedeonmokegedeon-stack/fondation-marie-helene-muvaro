'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Newspaper,
  Handshake,
  Users,
  Heart,
  FileBarChart,
  MessageSquare,
  Image,
  Settings,
  ScrollText,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'
import { hasPermission, ROLE_LABELS, type Permission } from '@/lib/permissions'
import type { SafeUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

const NAV: {
  href: string
  label: string
  icon: typeof LayoutDashboard
  permission?: Permission
}[] = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Pages', icon: FileText, permission: 'content:write' },
  { href: '/admin/projects', label: 'Projets', icon: FolderKanban, permission: 'content:write' },
  { href: '/admin/posts', label: 'Actualités', icon: Newspaper, permission: 'content:write' },
  { href: '/admin/partners', label: 'Partenaires', icon: Handshake, permission: 'partners:write' },
  { href: '/admin/reports', label: 'Rapports', icon: FileBarChart, permission: 'reports:write' },
  { href: '/admin/media', label: 'Médiathèque', icon: Image, permission: 'media:write' },
  { href: '/admin/contacts', label: 'Messages', icon: MessageSquare, permission: 'contacts:read' },
  { href: '/admin/volunteers', label: 'Bénévoles', icon: Users, permission: 'volunteers:read' },
  {
    href: '/admin/donations',
    label: 'Dons / intentions',
    icon: Heart,
    permission: 'donations:read',
  },
  { href: '/admin/users', label: 'Utilisateurs', icon: ShieldCheck, permission: 'users:manage' },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings, permission: 'settings:write' },
  { href: '/admin/audit', label: 'Journal d’audit', icon: ScrollText, permission: 'audit:read' },
]

export function AdminShell({ user, children }: { user: SafeUser; children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const items = NAV.filter((item) => !item.permission || hasPermission(user.role, item.permission))

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/connexion')
    router.refresh()
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-6">
        <Link href="/admin" className="font-display text-lg text-white">
          Fondation FMHM
        </Link>
        <p className="mt-1 text-xs text-white/50">Administration sécurisée</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                active ? 'bg-gold text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-medium text-white">{user.name}</p>
        <p className="truncate text-xs text-white/50">{ROLE_LABELS[user.role]}</p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/"
            className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-center text-xs text-white/70 hover:bg-white/10"
          >
            Voir le site
          </Link>
          <button
            onClick={logout}
            className="grid size-9 place-items-center rounded-lg border border-white/15 text-white/70 hover:bg-white/10"
            aria-label="Se déconnecter"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-dvh bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-navy lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-navy">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur">
          <button
            className="grid size-10 place-items-center rounded-lg border border-slate-200 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu admin"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <p className="text-sm font-medium text-slate-600">Espace d’administration</p>
          <span className="badge bg-emerald-50 text-emerald-700">Session protégée</span>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
