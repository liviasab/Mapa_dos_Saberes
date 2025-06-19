import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import vitePluginSvgr from "vite-plugin-svgr";
export default defineConfig({
  plugins: [
    react(),
    vitePluginSvgr(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
        ],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Mapa dos Saberes",
        short_name: "Mapa Saberes",
        description:
          "Descubra e cadastre espaços educativos para um aprendizado interdisciplinar",
        theme_color: "#3B82F6",
        icons: [
          {
            src: "./public/logo_out.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
          {
            src: "./public/logo_out.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
