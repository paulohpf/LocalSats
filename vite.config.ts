import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'icon.svg', 'icons.svg'],
    manifest: {
      name: 'LocalSats',
      short_name: 'LocalSats',
      description: 'Acompanhamento local de compras recorrentes de Bitcoin',
      start_url: '/',
      display: 'standalone',
      background_color: '#111113',
      theme_color: '#f7931a',
      lang: 'pt-BR',
      icons: [
        { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,svg,ico,png,webp,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.coingecko\.com\/api\/v3\/simple\/price/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'coingecko-price-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 5 * 60,
            },
            networkTimeoutSeconds: 10,
          },
        },
      ],
    },
  })],
})
