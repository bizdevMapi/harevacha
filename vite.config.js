import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Rolldown (Vite 8+) forbids mutating the bundle map (delete / bundle[key] =).
 * Only adjust each output's `fileName` and patch string references inside emitted files.
 */
function lowercaseOutputPaths() {
  return {
    name: 'lowercase-output-paths',
    generateBundle(_options, bundle) {
      /** @type {Array<[string, string]>} */
      const pairs = []

      for (const output of Object.values(bundle)) {
        const current = output.fileName
        if (!current) continue
        const lower = current.toLowerCase()
        if (lower !== current) {
          output.fileName = lower
          pairs.push([current, lower])
        }
      }

      if (pairs.length === 0) return

      pairs.sort((a, b) => b[0].length - a[0].length)

      for (const output of Object.values(bundle)) {
        if (output.type === 'chunk' && typeof output.code === 'string') {
          let { code } = output
          for (const [from, to] of pairs) {
            code = code.split(from).join(to)
          }
          output.code = code
        } else if (output.type === 'asset') {
          const src = output.source
          if (typeof src === 'string') {
            let s = src
            for (const [from, to] of pairs) {
              s = s.split(from).join(to)
            }
            output.source = s
          } else if (src instanceof Uint8Array) {
            const dec = new TextDecoder('utf8')
            const enc = new TextEncoder()
            let s = dec.decode(src)
            for (const [from, to] of pairs) {
              s = s.split(from).join(to)
            }
            output.source = enc.encode(s)
          }
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), lowercaseOutputPaths()],
  base: '/sites/harevacha-dev/',
  server: {
    port: 3000,
    host: 'mylocalsite',
  },
})
