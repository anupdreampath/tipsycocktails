export default async function handler(req, res) {
  try {
    const { sql } = await import('./lib/db.js')
    const rows = await sql`SELECT current_database() AS database, current_user AS user`
    return res.status(200).json({ ok: true, ...rows[0] })
  } catch (error) {
    console.error('DB health check failed:', error)
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Database check failed',
    })
  }
}
