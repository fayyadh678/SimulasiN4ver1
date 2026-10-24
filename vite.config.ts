import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // On GitHub Pages the project lives under /SimulasiN4ver1/; Vercel serves from /.
  base: process.env.GITHUB_PAGES === 'true' ? '/SimulasiN4ver1/' : '/',
});