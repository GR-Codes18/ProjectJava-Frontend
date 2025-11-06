import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


export default defineConfig({
  plugins: [react()],
  
  // La sección 'css' y el bloque 'postcss' han sido eliminados.
  // Esto hace que Vite vuelva a su auto-detección estándar de PostCSS.

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})