/**
 * Sıfır bağımlılık statik sunucu. Kurulum adımı yok:
 *   node tools/serve.mjs
 * Tarayıcı: http://127.0.0.1:4173
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const PORT = Number(process.env.PORT) || 4173

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

function resolveTarget(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://local').pathname)
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
  const target = resolve(ROOT, relative)
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return null
  return target
}

const server = createServer(async (request, response) => {
  const target = resolveTarget(request.url ?? '/')
  if (!target) {
    response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('403')
    return
  }

  try {
    const info = await stat(target)
    const file = info.isDirectory() ? resolve(target, 'index.html') : target
    const body = await readFile(file)
    response.writeHead(200, {
      'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    })
    response.end(body)
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('404')
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Campus Elevator Mobility → http://127.0.0.1:${PORT}`)
})
