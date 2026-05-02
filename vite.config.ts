import { defineConfig, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

type ApiRequest = IncomingMessage & {
  query?: Record<string, string>
  cookies?: Record<string, string>
}

type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
}

const apiRoutes = new Map([
  ['/api/admin/login', 'api/admin/login.js'],
  ['/api/admin/me', 'api/admin/me.js'],
  ['/api/admin/contacts', 'api/admin/contacts.js'],
  ['/api/admin/reset-password', 'api/admin/reset-password.js'],
  ['/api/admin/reviews', 'api/admin/reviews.js'],
  ['/api/content', 'api/content.js'],
  ['/api/db-health', 'api/db-health.js'],
  ['/api/contact', 'api/contact.js'],
  ['/api/health', 'api/health.js'],
  ['/api/reviews', 'api/reviews.js'],
  ['/api/visit', 'api/visit.js'],
  ['/api/visits', 'api/visits.js'],
])

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map(cookie => cookie.trim())
      .filter(Boolean)
      .map(cookie => {
        const [name, ...value] = cookie.split('=')
        return [name, decodeURIComponent(value.join('='))]
      })
  )
}

function matchApiRoute(pathname: string) {
  const file = apiRoutes.get(pathname)
  return file ? { file, params: {} as Record<string, string> } : null
}

function localApiPlugin() {
  return {
    name: 'local-api-routes',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (request: IncomingMessage, response: ServerResponse, next: () => void) => {
        const req = request as ApiRequest
        const res = response as ApiResponse

        if (!req.url?.startsWith('/api/')) return next()

        const url = new URL(req.url, 'http://localhost')
        const match = matchApiRoute(url.pathname)
        if (!match) return next()

        req.query = {
          ...Object.fromEntries(url.searchParams.entries()),
          ...match.params,
        }
        req.cookies = parseCookies(req.headers.cookie)

        res.status = (code: number) => {
          res.statusCode = code
          return res
        }
        res.json = (body: unknown) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }

        try {
          const moduleUrl = pathToFileURL(path.join(__dirname, match.file)).href
          const handler = (await import(`${moduleUrl}?t=${Date.now()}`)).default
          await handler(req, res)
        } catch (error) {
          server.config.logger.error(error instanceof Error ? error.stack || error.message : String(error))
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
          }
          if (!res.writableEnded) res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [localApiPlugin(), react()],
})
