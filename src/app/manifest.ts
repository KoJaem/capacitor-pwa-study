import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** PWA manifest에 등록할 아이콘 크기(px) */
const PWA_ICON_SIZES = [48, 72, 96, 128, 192, 256, 512] as const;

function buildPwaIcons(): MetadataRoute.Manifest["icons"] {
  const standardIcons = PWA_ICON_SIZES.map((size) => ({
    src: `/assets/icons/icon-${size}.webp`,
    sizes: `${size}x${size}`,
    type: "image/webp",
    purpose: "any" as const,
  }));

  // Android adaptive icon 등 maskable 영역용
  const maskableIcon = {
    src: "/assets/icons/icon-512.webp",
    sizes: "512x512",
    type: "image/webp",
    purpose: "maskable" as const,
  };

  return [...standardIcons, maskableIcon];
}

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "PWA 앱 전체이름",
    short_name: "PWA 짧은이름",
    description: "PWA 앱 설명",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: buildPwaIcons(),
  };
}
