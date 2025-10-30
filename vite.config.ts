import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This tells Vite the sub-folder your app will be in on GitHub Pages.
  // This has been pre-filled for you based on your repository name.
  base: '/tradediary/',
})