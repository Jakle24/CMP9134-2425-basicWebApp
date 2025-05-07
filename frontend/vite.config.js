import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/search_images': 'http://localhost:5000/search_images',
      '/contacts': 'http://localhost:5000/contacts',
      '/create_contact': 'http://localhost:5000/create_contact',
      '/update_contact': 'http://localhost:5000/update_contact',
      '/delete_contact': 'http://localhost:5000/delete_contact',
    }
  },
})