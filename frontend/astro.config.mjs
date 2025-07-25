import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      ignored: ['!**/*']
    }
  },
  vite: {
    define: {
      'import.meta.env.STRAPI_URL': JSON.stringify(process.env.STRAPI_URL || 'http://strapi:1337')
    }
  }
});
