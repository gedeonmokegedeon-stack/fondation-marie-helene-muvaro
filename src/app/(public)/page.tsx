import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HandHeart,
  Heart,
  HeartPulse,
  ShieldCheck,
  Sprout,
  Users,
} from 'lucide-react'
import { Badge, CtaBand, EmptyState, SectionHeading } from '@/components/ui'
import { getPrisma } from '@/lib/db'
import { BRAND } from '@/lib/brand'
import { formatDate } from '@/lib/content'

export const dynamic = 'force-dynamic'

const domains = [
  {
    icon: GraduationCap,
    title: 'Éducation et formation',
    text: 'Piste de travail : favoriser l’accès au savoir et aux compétences.',
  },
  {
    icon: HeartPulse,
    title: 'Santé et bien-être',
    text: 'Piste de travail : soutenir des initiatives communautaires de santé.',
  },
  {
    icon: Users,
    title: 'Dignité et inclusion',
    text: 'Piste de travail : accompagner les personnes en situation de vulnérabilité.',
  },
  {
    icon: Sprout,
    title: 'Développement communautaire',
    text: 'Piste de travail : encourager des solutions locales et durables.',
  },
]

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    getPrisma().project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      include: { coverImage: true },
    }),
    getPrisma().post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
  ])

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-site grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <Badge>Présentation institutionnelle provisoire</Badge>
            <h1 className="display mt-6 text-5xl sm:text-6xl lg:text-[64px]">
              Ensemble, faisons vivre la <span className="text-gold">solidarité</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-navy/65">
              La {BRAND.name} est une organisation humanitaire basée à Kinshasa, en République
              démocratique du Congo. Elle inscrit son engagement dans un esprit de dignité, de
              proximité et d’espoir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/a-propos" className="btn-primary">
                Découvrir la Fondation
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/don" className="btn-outline">
                <Heart className="size-4 text-gold" />
                Soutenir la Fondation
              </Link>
            </div>
            <p className="mt-6 text-xs tracking-[0.18em] text-navy/45 uppercase">{BRAND.slogan}</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] border border-gold/30" />
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-soft">
              <Image
                src="/images/illustration-communaute.jpg"
                alt="Illustration générée : membres d’une communauté congolaise collaborant autour d’un projet commun, avec dignité et espoir."
                width={1200}
                height={900}
                priority
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-5 pt-14">
                <p className="text-xs text-white/85">
                  Image d’illustration générée — ne représente pas une action documentée de la
                  Fondation.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-gold/25 bg-white px-5 py-4 shadow-soft sm:block">
              <p className="font-display text-lg">Kinshasa, RDC</p>
              <p className="text-xs text-navy/55">Ancrage local · ouverture solidaire</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-navy/8 bg-white">
        <div className="container-site grid gap-8 py-10 md:grid-cols-3">
          {[
            {
              icon: HandHeart,
              title: 'Solidarité',
              text: 'Un engagement tourné vers l’autre et le bien commun.',
            },
            {
              icon: ShieldCheck,
              title: 'Dignité',
              text: 'Le respect de chaque personne comme principe d’action.',
            },
            {
              icon: Sprout,
              title: 'Espoir',
              text: 'La conviction que des solutions locales peuvent construire l’avenir.',
            },
          ].map((v) => (
            <div key={v.title} className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ivory text-gold">
                <v.icon className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-xl">{v.title}</h2>
                <p className="mt-1 text-sm leading-6 text-navy/60">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-site py-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Notre raison d’être"
            title="Une Fondation à l’écoute des communautés"
            text="Les orientations présentées ici sont des propositions de travail. Elles seront confirmées et complétées par les instances officielles de la Fondation avant toute publication définitive."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {domains.map((d) => (
              <div key={d.title} className="card p-6">
                <d.icon className="size-6 text-gold" />
                <h3 className="mt-4 font-display text-lg">{d.title}</h3>
                <p className="mt-2 text-sm leading-6 text-navy/60">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <Link
            href="/domaines-intervention"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold"
          >
            Explorer les domaines proposés
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="bg-ivory/45 py-20">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Projets et réalisations"
              title="Des actions documentées, pas des promesses inventées"
              text="Les projets officiels seront publiés ici après validation. Aucun projet, chiffre ou résultat n’est ajouté sans source."
            />
            <Link href="/projets" className="btn-outline">
              Voir tous les projets
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10">
            {projects.length === 0 ? (
              <EmptyState
                title="Aucun projet officiel publié pour le moment"
                text="La médiathèque et l’administration permettent d’ajouter des projets validés, avec description, lieu, état et images."
                action={{ href: '/projets', label: 'Consulter la page projets' }}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projets/${p.slug}`}
                    className="card group overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] bg-ivory">
                      {p.coverImage ? (
                        <Image
                          src={`/api/media/${p.coverImage.id}`}
                          alt={p.coverImage.alt || p.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-gold">
                          <BookOpen className="size-8" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl group-hover:text-gold">{p.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-navy/60">
                        {p.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-site py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Actualités"
              title="Informer avec exactitude"
              text="Actualités et événements confirmés seront publiés dans cet espace."
            />
            <div className="mt-8 space-y-4">
              {posts.length === 0 ? (
                <p className="rounded-xl border border-dashed border-navy/20 p-6 text-sm text-navy/55">
                  Aucune actualité officielle publiée pour le moment.
                </p>
              ) : (
                posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/actualites/${post.slug}`}
                    className="card block p-5 transition hover:border-gold/40"
                  >
                    <p className="text-xs text-gold">{formatDate(post.publishedAt)}</p>
                    <h3 className="mt-1 font-display text-lg">{post.title}</h3>
                  </Link>
                ))
              )}
            </div>
          </div>
          <div className="rounded-3xl bg-navy p-8 text-white sm:p-10">
            <ShieldCheck className="size-8 text-gold-light" />
            <h2 className="display mt-6 text-3xl">La transparence comme engagement</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              La Fondation a vocation à publier ses rapports d’activités et documents de
              transparence. Aucun rapport n’est inventé : les documents officiels seront ajoutés
              après validation.
            </p>
            <Link href="/rapports" className="btn-gold mt-8">
              Rapports et transparence
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Votre engagement peut faire la différence"
        text="Bénévolat, partenariat ou intention de don : plusieurs formes de soutien sont possibles. Les modalités officielles seront précisées par la Fondation."
        primary={{ href: '/benevole', label: 'Devenir bénévole' }}
        secondary={{ href: '/contact', label: 'Nous contacter' }}
      />
    </>
  )
}
