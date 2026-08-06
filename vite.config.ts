/// <reference types="vitest" />
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11', 'Safari >= 13', 'iOS >= 13']
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  }
})
