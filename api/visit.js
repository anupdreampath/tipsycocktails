import { sql } from './lib/db.js'
import { parseBody } from './lib/body.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = await parseBody(req)
    const { sessionId, pagePath, action, timeSpent } = body
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown'
    const userAgent = req.headers['user-agent'] || ''

    // Parse device info
    let deviceType = 'desktop'
    if (/mobile|android|iphone|ipod/i.test(userAgent)) deviceType = 'mobile'
    else if (/tablet|ipad/i.test(userAgent)) deviceType = 'tablet'

    let browser = 'Unknown'
    if (/chrome/i.test(userAgent)) browser = 'Chrome'
    else if (/firefox/i.test(userAgent)) browser = 'Firefox'
    else if (/safari/i.test(userAgent)) browser = 'Safari'
    else if (/edge/i.test(userAgent)) browser = 'Edge'

    let os = 'Unknown'
    if (/windows/i.test(userAgent)) os = 'Windows'
    else if (/macintosh|mac os/i.test(userAgent)) os = 'MacOS'
    else if (/linux/i.test(userAgent)) os = 'Linux'
    else if (/android/i.test(userAgent)) os = 'Android'
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS'

    if (action === 'end' && timeSpent) {
      await sql`
        UPDATE visits 
        SET time_spent_seconds = ${Math.round(timeSpent)}, ended_at = NOW()
        WHERE session_id = ${sessionId} AND ended_at IS NULL
      `
      return res.status(200).json({ success: true })
    }

    // Start new visit
    let city = 'Unknown'
    let country = 'Unknown'
    try {
      const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=city,country`)
      if (response.ok) {
        const geoData = await response.json()
        city = geoData.city || 'Unknown'
        country = geoData.country || 'Unknown'
      }
    } catch (e) {
      // Silently fail geolocation
    }

    const result = await sql`
      INSERT INTO visits (session_id, ip_address, city, country, device_type, browser, os, page_path)
      VALUES (${sessionId}, ${ipAddress}, ${city}, ${country}, ${deviceType}, ${browser}, ${os}, ${pagePath || '/'})
      RETURNING *
    `

    return res.status(201).json({ success: true, data: result[0] })
  } catch (error) {
    console.error('Visit error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
