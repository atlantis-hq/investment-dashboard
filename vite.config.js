import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiToken = env.API_TOKEN || ''
  return {
    plugins: [react(), tailwindcss()],
    base: '/',
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api/portfolio': {
          target: 'http://127.0.0.1:8443',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/portfolio/, '/portfolio'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (apiToken) {
                proxyReq.setHeader('authorization', `Bearer ${apiToken}`)
              }
            })
          },
        },
      },
    },
  }
})
