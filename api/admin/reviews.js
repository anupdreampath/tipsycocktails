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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const user = getAuthUser(req)
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    if (req.method === 'GET') {
      const reviews = await sql`
        SELECT id, name, email, rating, text, status, created_at 
        FROM reviews 
        ORDER BY created_at DESC
      `
      return res.status(200).json(reviews)
    }

    if (req.method === 'PUT') {
      const body = await parseBody(req)
      const { id, status } = body
      await sql`UPDATE reviews SET status = ${status} WHERE id = ${id}`
      return res.status(200).json({ success: true })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await sql`DELETE FROM reviews WHERE id = ${id}`
      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Admin reviews error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
