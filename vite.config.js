import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static single-page site: Vercel auto-detects Vite and runs
// `npm run build`, publishing the `dist` folder. No router and no
// extra config needed.
export default defineConfig({
  plugins: [react()],
});
