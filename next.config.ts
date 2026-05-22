import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
  reloadOnOnline: false, // 오프라인->온라인 전환 시점에 reload하지 않게
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
};

export default withSerwist(nextConfig);
