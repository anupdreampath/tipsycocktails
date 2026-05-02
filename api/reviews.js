import { sql } from './lib/db.js'
import { parseBody } from './lib/body.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      const reviews = await sql`
        SELECT id, name, rating, text, created_at 
        FROM reviews 
        WHERE status = 'approved'
        ORDER BY created_at DESC
      `
      return res.status(200).json(reviews)
    }

    if (req.method === 'POST') {
      const body = await parseBody(req)
      const { name, email, rating, text } = body

      if (!name || !rating || !text) {
        return res.status(400).json({ error: 'Name, rating, and text are required' })
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' })
      }

      const result = await sql`
        INSERT INTO reviews (name, email, rating, text, status)
        VALUES (${name}, ${email || ''}, ${rating}, ${text}, 'pending')
        RETURNING *
      `

      return res.status(201).json({ success: true, data: result[0] })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Reviews error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
