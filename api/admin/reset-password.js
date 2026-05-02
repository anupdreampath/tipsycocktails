import { sql } from '../lib/db.js'
import bcrypt from 'bcryptjs'
import { requireAuth } from '../lib/auth.js'
import { parseBody } from '../lib/body.js'

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = await parseBody(req)
    const { currentPassword, newPassword } = body
    const users = await sql`SELECT * FROM admin_users WHERE id = ${req.admin.id}`

    if (users.length === 0) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    const user = users[0]
    const isValid = await bcrypt.compare(currentPassword, user.password_hash)

    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await sql`UPDATE admin_users SET password_hash = ${hashedPassword}, updated_at = NOW() WHERE id = ${req.admin.id}`

    return res.status(200).json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default requireAuth(handler)
