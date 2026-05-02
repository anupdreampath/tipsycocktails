import { sql } from '../lib/db.js'
import jwt from 'jsonwebtoken'
import { parseBody } from '../lib/body.js'

const JWT_SECRET = process.env.JWT_SECRET || 'tipsy-cocktails-secret-key-2024'

function getAuthUser(req) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]
    if (!token) return null
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { page } = req.query

  try {
    if (req.method === 'GET') {
      const content = await sql`
        SELECT section, key, value 
        FROM page_content 
        WHERE page = ${page}
      `
      const result = {}
      for (const row of content) {
        if (!result[row.section]) result[row.section] = {}
        result[row.section][row.key] = row.value
      }
      return res.status(200).json(result)
    }

    if (req.method === 'PUT') {
      const user = getAuthUser(req)
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const body = await parseBody(req)
      const { section, key, value } = body
      await sql`
        INSERT INTO page_content (page, section, key, value)
        VALUES (${page}, ${section}, ${key}, ${value})
        ON CONFLICT (page, section, key) 
        DO UPDATE SET value = ${value}, updated_at = NOW()
      `
      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Content error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
