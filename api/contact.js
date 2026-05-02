import { sql } from './lib/db.js'
import { parseBody } from './lib/body.js'
import { notifyQuoteRequest } from './lib/notify.js'

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
    const { name, email, phone, message } = body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    const result = await sql`
      INSERT INTO contacts (name, email, phone, message)
      VALUES (${name}, ${email}, ${phone || ''}, ${message})
      RETURNING *
    `

    await notifyQuoteRequest(result[0])

    return res.status(201).json({ success: true, data: result[0] })
  } catch (error) {
    console.error('Contact error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
