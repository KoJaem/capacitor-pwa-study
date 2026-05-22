"use client";

import { SerwistProvider } from "@serwist/next/react";

interface SerwistProviderWrapperProps {
  children: React.ReactNode;
}

// 프로덕션에서만 SW 등록 (next.config.ts의 disable 설정과 동일)
const isSerwistDisabled = process.env.NODE_ENV !== "production";

export default function SerwistProviderWrapper({
  children,
}: SerwistProviderWrapperProps) {
  return (
    <SerwistProvider
      swUrl="/sw.js"
      disable={isSerwistDisabled}
      register
      cacheOnNavigation={false}
      reloadOnOnline={false}
    >
      {children}
    </SerwistProvider>
  );
}
