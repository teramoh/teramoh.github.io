import { defineConfig } from 'vite'

export default defineConfig({
  base: '/PocketDexQuiz/dist/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
