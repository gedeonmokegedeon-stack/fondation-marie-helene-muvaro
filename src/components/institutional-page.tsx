import { PageHero } from '@/components/ui'
import { RichText } from '@/components/rich-text'
import { ProvisionalNotice } from '@/components/ui/provisional-notice'
import { getPrisma } from '@/lib/db'

export async function InstitutionalPage({
  slug,
  eyebrow,
  title,
  summary,
  body,
}: {
  slug: string
  eyebrow: string
  title: string
  summary: string
  body: string
}) {
  const page = await getPrisma().page.findFirst({ where: { slug, status: 'PUBLISHED' } })
  return (
    <>
      <PageHero eyebrow={eyebrow} title={page?.title ?? title} text={page?.summary ?? summary} />
      <section className="container-site py-14">
        <div className="mx-auto max-w-3xl">
          {!page && (
            <div className="mb-8">
              <ProvisionalNotice>
                Ce contenu est une proposition de travail, en attente de validation officielle par
                la Fondation.
              </ProvisionalNotice>
            </div>
          )}
          <RichText content={page?.body ?? body} />
        </div>
      </section>
    </>
  )
}
