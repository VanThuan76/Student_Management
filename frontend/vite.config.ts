import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles.css";`,
      },
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
  },
  define: {
    'process.env': {}
  }
})
