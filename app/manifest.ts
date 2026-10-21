import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NextForma",
    short_name: "NextForma",
    description: "Тренувальні програми, календар та фіксація прогресу",
    start_url: "/",
    display: "standalone",
    background_color: "#060605",
    theme_color: "#060605",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Full-bleed background, glyph inside the 80% safe zone so the OS mask never clips it.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
