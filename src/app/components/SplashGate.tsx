"use client";

import { useState } from "react";
import CustomSplashScreen from "./CustomSplashScreen";

interface SplashGateProps {
  children: React.ReactNode;
}

export default function SplashGate({ children }: SplashGateProps) {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <CustomSplashScreen
        onComplete={() => setShowSplash(false)}
        minDisplayDuration={1500}
        fadeInDuration={0.5}
        fadeOutDuration={0.6}
      />
    );
  }

  return <>{children}</>;
}
