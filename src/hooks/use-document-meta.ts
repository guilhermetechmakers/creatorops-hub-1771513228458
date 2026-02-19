import { useEffect } from 'react'

interface DocumentMetaOptions {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
}

export function useDocumentMeta({
  title,
  description,
  ogTitle,
  ogDescription,
}: DocumentMetaOptions) {
  useEffect(() => {
    const baseTitle = 'CreatorOps Hub - Research to Publish'
    const baseDescription =
      'Consolidate assets, drafts, calendar events, and Gmail briefs. Run web research with OpenClaw, generate content with provenance, and schedule multi-channel publishing.'

    if (title) {
      document.title = `${title} | CreatorOps Hub`
    } else {
      document.title = baseTitle
    }

    const metaDescription = description ?? baseDescription
    const descEl = document.querySelector('meta[name="description"]')
    if (descEl) {
      descEl.setAttribute('content', metaDescription)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = metaDescription
      document.head.appendChild(meta)
    }

    const ogTitleVal = ogTitle ?? title ?? baseTitle
    const ogDescVal = ogDescription ?? metaDescription
    ;['og:title', 'twitter:title'].forEach((prop) => {
      const el = document.querySelector(`meta[property="${prop}"]`) ?? document.querySelector(`meta[name="${prop}"]`)
      if (el) el.setAttribute('content', ogTitleVal)
    })
    ;['og:description', 'twitter:description'].forEach((prop) => {
      const el = document.querySelector(`meta[property="${prop}"]`) ?? document.querySelector(`meta[name="${prop}"]`)
      if (el) el.setAttribute('content', ogDescVal)
    })

    return () => {
      document.title = baseTitle
    }
  }, [title, description, ogTitle, ogDescription])
}
