import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // The advertiser app was ported from a Next.js + shadcn project that uses `@/...`
      // imports for `components/`, `lib/`, etc. Map `@/` to `src/advertiser/` so those
      // imports resolve without rewriting every file.
      '@': resolve(__dirname, 'src/advertiser'),
      // Custom brand icon set — src/icons/index.js exports 539 icons from os-icons-v2
      '@icons': resolve(__dirname, 'src/icons'),
    },
    // Force a single React instance across the app and all packages (including the
    // design system's CJS require("react")). Without this, pnpm's per-worktree
    // node_modules can create a second react@19 instance, breaking hooks.
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  build: {
    // tokens.css from @rishikeshjoshi-morpheus/ui contains CSS vars with '/' in names
    // (e.g. --osmos-sizes-1/2) which lightningcss (Vite 8 default) rejects — use esbuild instead
    cssMinify: false,
    rollupOptions: {
      input: {
        // Landing chooser at `/`
        main:       resolve(__dirname, 'index.html'),
        // Retailer console at `/retailer.html` (the legacy app)
        retailer:   resolve(__dirname, 'retailer.html'),
        // Advertiser/AdOps "Beat" console at `/advertiser.html`
        advertiser: resolve(__dirname, 'advertiser.html'),
      },
    },
  },
});
