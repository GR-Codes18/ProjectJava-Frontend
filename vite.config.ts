import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/postcss' // <-- LA LÍNEA CORREGIDA
import autoprefixer from 'autoprefixer' 

export default defineConfig({
  plugins: [react()],
  
  css: {
    postcss: {
      plugins: [
        tailwindcss, // <-- Ahora esta variable es el plugin correcto
        autoprefixer,
      ],
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})