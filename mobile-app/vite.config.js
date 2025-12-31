import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Pastikan cookie ter-forward dengan benar
            if (req.headers.cookie) {
              proxyReq.setHeader('Cookie', req.headers.cookie)
            }
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Pastikan Set-Cookie header ter-forward dengan benar
            if (proxyRes.headers['set-cookie']) {
              // Ubah domain cookie jika perlu
              const cookies = proxyRes.headers['set-cookie']
              proxyRes.headers['set-cookie'] = cookies.map(cookie => {
                // Hapus domain restriction jika ada
                return cookie.replace(/;\s*domain=[^;]+/gi, '')
              })
            }
          })
        }
      }
    }
  }
})

