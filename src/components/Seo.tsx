import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://tipsycocktails.vercel.app'

const META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Tipsy Cocktails | Mobile Bar Hire & Cocktail Classes UK',
    description: 'Mobile bar hire, private cocktail bartenders and cocktail experiences for parties, weddings, hen parties, birthdays and corporate events.',
  },
  '/menu': {
    title: 'Cocktail Menu | Tipsy Cocktails',
    description: 'Explore the Tipsy Cocktails drinks menu for mobile bar hire, private parties, cocktail classes and events.',
  },
  '/classes': {
    title: 'Cocktail Making Classes | Tipsy Cocktails',
    description: 'Book cocktail making classes for hen parties, birthdays, corporate team events and private celebrations.',
  },
  '/reviews': {
    title: 'Reviews | Tipsy Cocktails',
    description: 'Read customer reviews for Tipsy Cocktails mobile bar hire, cocktail classes and private bartender experiences.',
  },
  '/faq': {
    title: 'FAQ | Tipsy Cocktails',
    description: 'Answers to common questions about booking mobile bar hire, cocktail classes, bartenders and party drinks packages.',
  },
  '/contact': {
    title: 'Contact Tipsy Cocktails | Request a Quote',
    description: 'Contact Tipsy Cocktails by phone, email or quote form to discuss mobile bar hire and cocktail classes.',
  },
}

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const element = document.head.querySelector(selector)
  if (element) element.setAttribute(attr, value)
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = META[pathname] || META['/']
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`

    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[name="twitter:title"]', 'content', meta.title)
    setMeta('meta[name="twitter:description"]', 'content', meta.description)
  }, [pathname])

  return null
}
