import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Encart signalant un contenu provisoire, conformément aux règles du projet :
 * tout contenu non validé doit être clairement identifié comme tel.
 */
export function ProvisionalNotice({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <aside
      role="note"
      className={cn(
        'max-w-xl rounded-lg border border-gold/40 bg-white/70 px-5 py-4 text-center',
        className,
      )}
    >
      <p className="text-xs font-semibold tracking-widest text-gold uppercase">
        Contenu provisoire
      </p>
      <div className="mt-2 text-sm leading-relaxed text-navy/80">{children}</div>
    </aside>
  )
}
