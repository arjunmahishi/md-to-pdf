import { defineConfig } from 'vite';

export default defineConfig({
  base: '/md-to-pdf/',
  css: {
    postcss: './postcss.config.js',
  },
});
