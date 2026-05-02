import { useEffect, useState } from 'react'

export type PageContent = Record<string, Record<string, string>>

export function usePageContent(page: string) {
  const [content, setContent] = useState<PageContent>({})

  useEffect(() => {
    let cancelled = false
    fetch(`/api/content?page=${encodeURIComponent(page)}`)
      .then((response) => response.ok ? response.json() : {})
      .then((data) => {
        if (!cancelled && data && typeof data === 'object') setContent(data as PageContent)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [page])

  return content
}

export function cmsValue(content: PageContent, section: string, key: string, fallback: string) {
  return content[section]?.[key] || fallback
}
