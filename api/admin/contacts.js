import { sql } from '../lib/db.js'
import { requireAuth } from '../lib/auth.js'

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const contacts = await sql`
      SELECT id, name, email, phone, message, created_at
      FROM contacts
      ORDER BY created_at DESC
      LIMIT 500
    `
    return res.status(200).json(contacts)
  } catch (error) {
    console.error('Admin contacts error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default requireAuth(handler)
