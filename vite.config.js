import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Normalizes emitted file names to lowercase without mutating bundle keys.
 * Important: do not rewrite binary asset content (png/svg/etc).
 */
function lowercaseOutputPaths() {
  return {
    name: 'lowercase-output-paths',
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        const current = output.fileName
        if (!current) continue
        const lower = current.toLowerCase()
        if (lower !== current) {
          output.fileName = lower
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
