import type { ReactNode } from 'react'

/** Rendu sûr : texte React uniquement, jamais dangerouslySetInnerHTML. */
export function RichText({
  content,
  className = 'prose-site',
}: {
  content: string
  className?: string
}) {
  const blocks: ReactNode[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`}>
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>,
      )
      list = []
    }
  }
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    if (line.startsWith('- ')) {
      list.push(line.slice(2))
      continue
    }
    flush()
    if (line.startsWith('### ')) blocks.push(<h3 key={blocks.length}>{line.slice(4)}</h3>)
    else if (line.startsWith('## ')) blocks.push(<h2 key={blocks.length}>{line.slice(3)}</h2>)
    else blocks.push(<p key={blocks.length}>{line}</p>)
  }
  flush()
  return <div className={className}>{blocks}</div>
}
