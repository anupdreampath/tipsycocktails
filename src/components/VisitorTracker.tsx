import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function VisitorTracker() {
  const location = useLocation()
  const sessionId = useRef(crypto.randomUUID()).current
  const startTime = useRef(Date.now())

  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return

    startTime.current = Date.now()

    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, pagePath: location.pathname, action: 'start' }),
    }).catch(() => {})

    const handleEnd = () => {
      const timeSpent = (Date.now() - startTime.current) / 1000
      navigator.sendBeacon('/api/visit', JSON.stringify({ sessionId, timeSpent: Math.round(timeSpent), action: 'end' }))
    }

    window.addEventListener('beforeunload', handleEnd)
    return () => {
      handleEnd()
      window.removeEventListener('beforeunload', handleEnd)
    }
  }, [location.pathname])

  return null
}
