'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

type AuditRow = {
  id: string
  action: string
  entity: string
  entityId: string | null
  createdAt: string
  actor: { name: string; email: string } | null
  metadata: unknown
}

export function AuditTable() {
  const [rows, setRows] = useState<AuditRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/audit?page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        setRows(d.rows ?? [])
        setTotal(d.total ?? 0)
      })
      .finally(() => setLoading(false))
  }, [page])

  function changePage(next: number) {
    setLoading(true)
    setPage(next)
  }

  const pages = Math.max(1, Math.ceil(total / 30))
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Acteur</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entité</th>
              <th className="px-4 py-3">Référence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-slate-400" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  Aucune opération journalisée.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(row.createdAt).toLocaleString('fr-CD')}
                  </td>
                  <td className="px-4 py-3">{row.actor?.name ?? 'Système'}</td>
                  <td className="px-4 py-3 font-medium">{row.action}</td>
                  <td className="px-4 py-3">{row.entity}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {row.entityId ?? '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
        <span>{total} opération(s)</span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
          >
            Précédent
          </button>
          <span>
            {page}/{pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => changePage(page + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  )
}
