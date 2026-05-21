"use client";

import { SplashScreen } from "@capacitor/splash-screen";
import Image from "next/image";
import { useEffect } from "react";

interface CustomSplashScreenProps {
  onComplete: () => void;
  minDisplayDuration?: number;
}

const DEFAULT_MIN_DISPLAY_MS = 1500;

export default function CustomSplashScreen({
  onComplete,
  minDisplayDuration = DEFAULT_MIN_DISPLAY_MS,
}: CustomSplashScreenProps) {
  useEffect(() => {
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hide();
      } catch {
        // 웹 환경에서는 플러그인이 없을 수 있으므로 무시
      }
    };

    hideNativeSplash();

    const timerId = window.setTimeout(() => {
      onComplete();
    }, minDisplayDuration);

    return () => window.clearTimeout(timerId);
  }, [onComplete, minDisplayDuration]);

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <figure className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/splash.png"
          alt="앱 스플래시"
          width={400}
          height={400}
          priority
        />
      </figure>
    </section>
  );
}
