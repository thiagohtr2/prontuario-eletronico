/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath, URL } from 'node:url'

// `npm run build` gera uma pasta dist/ que funciona em qualquer hospedagem estática
// (caminhos relativos + rotas por hash). `npm run build:standalone` gera um único
// arquivo HTML que abre direto do disco, sem servidor.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'standalone' ? [viteSingleFile()] : [])],
  // Isola o Studio da configuração PostCSS/Tailwind do projeto pai.
  css: { postcss: { plugins: [] } },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    outDir: mode === 'standalone' ? 'dist-standalone' : 'dist',
    chunkSizeWarningLimit: 4000,
  },
  server: { port: 5180 },
  preview: { port: 4173 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/unit/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    css: false,
  },
}))
