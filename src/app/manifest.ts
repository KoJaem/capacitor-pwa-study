import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Just Meditation",
    short_name: "Meditation",
    description: "명상 PWA 앱",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        src: "/icon-512.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
  };
}
