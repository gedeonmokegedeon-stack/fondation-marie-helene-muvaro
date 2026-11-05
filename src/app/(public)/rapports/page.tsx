import type { Metadata } from 'next'
import { Download, FileText, ShieldCheck } from 'lucide-react'
import { Badge, EmptyState, PageHero } from '@/components/ui'
import { getPrisma } from '@/lib/db'
import { formatDate } from '@/lib/content'

export const metadata: Metadata = { title: 'Rapports et transparence' }
export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const reports = await getPrisma().report.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ year: 'desc' }, { publishedAt: 'desc' }],
    include: { document: true },
  })
  return (
    <>
      <PageHero
        eyebrow="Rendre compte"
        title="Rapports et transparence"
        text="Les rapports d’activités, documents financiers et publications officielles de la Fondation seront accessibles ici après validation."
      />
      <section className="container-site py-16">
        <div className="mb-10 flex items-start gap-4 rounded-2xl border border-gold/25 bg-gold/8 p-6">
          <ShieldCheck className="mt-0.5 size-6 shrink-0 text-gold" />
          <p className="text-sm leading-6 text-navy/75">
            Aucun rapport n’est inventé. Seuls les documents officiels téléversés et publiés par
            l’administration apparaissent dans cette liste.
          </p>
        </div>
        {reports.length === 0 ? (
          <EmptyState
            title="Aucun rapport officiel publié"
            text="Les rapports seront ajoutés avec leur année, leur catégorie et leur document PDF validé."
          />
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <article
                key={report.id}
                className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-ivory text-gold">
                  <FileText className="size-6" />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>{report.year}</Badge>
                    <span className="text-xs font-medium text-navy/50">{report.category}</span>
                  </div>
                  <h2 className="mt-2 font-display text-xl">{report.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-navy/60">{report.summary}</p>
                  <p className="mt-2 text-xs text-navy/40">
                    Publié le {formatDate(report.publishedAt)}
                  </p>
                </div>
                {report.document && (
                  <a href={`/api/media/${report.document.id}`} className="btn-outline shrink-0">
                    <Download className="size-4" />
                    Télécharger le PDF
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
