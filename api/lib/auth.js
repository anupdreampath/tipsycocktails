import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tipsy-cocktails-secret-key-2024'

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function getAuthUser(req) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1] || req.cookies?.adminToken
  if (!token) return null
  return verifyToken(token)
}

export function requireAuth(handler) {
  return async (req, res) => {
    const user = getAuthUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.admin = user
    return handler(req, res)
  }
}
