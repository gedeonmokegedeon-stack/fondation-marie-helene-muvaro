import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'left',
  light = false,
}: {
  eyebrow?: string
  title: string
  text?: string
  align?: 'left' | 'center'
  light?: boolean
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className={cn('display text-3xl sm:text-4xl', light ? 'text-white' : 'text-navy')}>
        {title}
      </h2>
      {text && (
        <p className={cn('mt-4 text-base leading-7', light ? 'text-white/70' : 'text-navy/65')}>
          {text}
        </p>
      )}
    </div>
  )
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string
  text: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="card flex flex-col items-center px-8 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-ivory text-gold">
        <Inbox className="size-5" />
      </span>
      <h3 className="mt-5 font-display text-xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-navy/60">{text}</p>
      {action && (
        <Link href={action.href} className="btn-outline mt-6">
          {action.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string
  title: string
  text?: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-navy/8 bg-ivory/45">
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full border border-gold/15" />
      <div className="pointer-events-none absolute -right-10 top-10 size-64 rounded-full border border-gold/10" />
      <div className="container-site relative py-16 sm:py-20">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="display max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        {text && (
          <p className="mt-5 max-w-2xl text-base leading-7 text-navy/65 sm:text-lg">{text}</p>
        )}
        {children}
      </div>
    </section>
  )
}

export function Badge({
  children,
  tone = 'gold',
}: {
  children: ReactNode
  tone?: 'gold' | 'navy' | 'green' | 'red' | 'gray'
}) {
  const tones = {
    gold: 'bg-gold/12 text-[#8a6a2f]',
    navy: 'bg-navy/10 text-navy',
    green: 'bg-emerald-100 text-emerald-800',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-slate-100 text-slate-600',
  }
  return <span className={cn('badge', tones[tone])}>{children}</span>
}

export function CtaBand({
  title,
  text,
  primary,
  secondary,
}: {
  title: string
  text: string
  primary: { href: string; label: string }
  secondary?: { href: string; label: string }
}) {
  return (
    <section className="container-site py-16">
      <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-12 text-white sm:px-12">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full border border-gold/25" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="display text-3xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">{text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={primary.href} className="btn-gold">
              {primary.label}
              <ArrowRight className="size-4" />
            </Link>
            {secondary && (
              <Link
                href={secondary.href}
                className="btn border border-white/25 text-white hover:bg-white/10"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
