import Link from 'next/link'
import { FileText, FolderKanban, Heart, MessageSquare, Users, AlertCircle } from 'lucide-react'
import { getPrisma } from '@/lib/db'
import { getSiteSettings, formatDate, DONATION_STATUS_LABELS } from '@/lib/content'
import { isPaymentEnabled } from '@/lib/payments'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const prisma = getPrisma()
  const [
    pages,
    projects,
    posts,
    partners,
    reports,
    newContacts,
    newVolunteers,
    intents,
    confirmed,
    media,
    settings,
    recentContacts,
    recentDonations,
  ] = await Promise.all([
    prisma.page.count({ where: { status: 'PUBLISHED' } }),
    prisma.project.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.partner.count({ where: { status: 'PUBLISHED' } }),
    prisma.report.count({ where: { status: 'PUBLISHED' } }),
    prisma.contactRequest.count({ where: { status: 'NEW' } }),
    prisma.volunteerApplication.count({ where: { status: 'NEW' } }),
    prisma.donation.count({ where: { status: 'INTENT' } }),
    prisma.donation.count({ where: { status: 'CONFIRMED' } }),
    prisma.mediaAsset.count({ where: { archivedAt: null } }),
    getSiteSettings(),
    prisma.contactRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.donation.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  const stats = [
    { label: 'Pages publiées', value: pages, href: '/admin/pages', icon: FileText },
    { label: 'Projets publiés', value: projects, href: '/admin/projects', icon: FolderKanban },
    {
      label: 'Messages à traiter',
      value: newContacts,
      href: '/admin/contacts',
      icon: MessageSquare,
    },
    {
      label: 'Candidatures à examiner',
      value: newVolunteers,
      href: '/admin/volunteers',
      icon: Users,
    },
    { label: 'Intentions de don', value: intents, href: '/admin/donations', icon: Heart },
    {
      label: 'Dons confirmés prestataire',
      value: confirmed,
      href: '/admin/donations',
      icon: Heart,
    },
  ]

  const checks = [
    {
      ok: Boolean(settings.contactEmail || settings.contactPhone),
      label: 'Coordonnées officielles renseignées',
    },
    { ok: projects > 0, label: 'Au moins un projet officiel publié' },
    { ok: reports > 0, label: 'Au moins un rapport officiel publié' },
    { ok: partners > 0, label: 'Partenaires officiellement confirmés' },
    { ok: false, label: 'Passerelles de paiement activées (aucune intégration réelle à ce stade)' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-slate-500">
          Vue réelle des contenus et demandes. Aucune statistique inventée.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="admin-card p-5 transition hover:border-gold/50"
          >
            <div className="flex items-center justify-between">
              <s.icon className="size-5 text-gold" />
              <span className="text-3xl font-semibold text-slate-900">{s.value}</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="admin-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">État de préparation</h2>
          <ul className="mt-4 space-y-3">
            {checks.map((c) => (
              <li key={c.label} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-xs ${c.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                >
                  {c.ok ? '✓' : '!'}
                </span>
                <span className={c.ok ? 'text-slate-700' : 'text-slate-500'}>{c.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            Les contenus manquants doivent être fournis et validés par la Fondation. Ils ne sont pas
            générés automatiquement.
          </p>
        </section>
        <section className="admin-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Paiements</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Aucune passerelle n’est activée. Les intentions de don sont enregistrées sans transfert
            d’argent.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            {['MPESA', 'AIRTEL_MONEY', 'ORANGE_MONEY', 'INTERNATIONAL'].map((p) => (
              <div
                key={p}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
              >
                <span>{p}</span>
                <span className="badge bg-slate-200 text-slate-600">
                  {isPaymentEnabled(p as never) ? 'Activé' : 'Non activé'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="admin-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Derniers messages</h2>
            <Link href="/admin/contacts" className="text-sm font-medium text-gold">
              Tout voir
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {recentContacts.length === 0 ? (
              <p className="py-6 text-sm text-slate-400">Aucun message reçu.</p>
            ) : (
              recentContacts.map((c) => (
                <div key={c.id} className="py-3">
                  <p className="text-sm font-medium text-slate-800">{c.subject}</p>
                  <p className="text-xs text-slate-500">
                    {c.name} · {formatDate(c.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
        <section className="admin-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dernières intentions / dons</h2>
            <Link href="/admin/donations" className="text-sm font-medium text-gold">
              Tout voir
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {recentDonations.length === 0 ? (
              <p className="py-6 text-sm text-slate-400">Aucune intention enregistrée.</p>
            ) : (
              recentDonations.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{d.reference}</p>
                    <p className="text-xs text-slate-500">{DONATION_STATUS_LABELS[d.status]}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {String(d.amount)} {d.currency}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
      <p className="text-xs text-slate-400">
        Médiathèque : {media} fichier(s) · Actualités publiées : {posts} · Partenaires publiés :{' '}
        {partners}
      </p>
    </div>
  )
}
