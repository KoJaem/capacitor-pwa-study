"use client";

import { SplashScreen } from "@capacitor/splash-screen";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface CustomSplashScreenProps {
  onComplete: () => void;
  minDisplayDuration?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

const DEFAULT_MIN_DISPLAY_MS = 1500;
const DEFAULT_FADE_IN_SEC = 0.5;
const DEFAULT_FADE_OUT_SEC = 0.6;
const EASE_OUT = [0.4, 0, 0.2, 1] as const;

function createSplashVariants(
  fadeInDuration: number,
  fadeOutDuration: number
): {
  background: Variants;
  logo: Variants;
} {
  return {
    background: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: fadeInDuration, ease: EASE_OUT },
      },
      exit: {
        opacity: 0,
        transition: { duration: fadeOutDuration, ease: EASE_OUT },
      },
    },
    logo: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: fadeInDuration, ease: EASE_OUT },
      },
      exit: {
        opacity: 0,
        transition: { duration: fadeOutDuration, ease: EASE_OUT },
      },
    },
  };
}

export default function CustomSplashScreen({
  onComplete,
  minDisplayDuration = DEFAULT_MIN_DISPLAY_MS,
  fadeInDuration = DEFAULT_FADE_IN_SEC,
  fadeOutDuration = DEFAULT_FADE_OUT_SEC,
}: CustomSplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  const variants = useMemo(
    () => createSplashVariants(fadeInDuration, fadeOutDuration),
    [fadeInDuration, fadeOutDuration]
  );

  useEffect(() => {
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hide();
      } catch {
        // 웹 환경에서는 플러그인이 없을 수 있으므로 무시
      }
    };

    hideNativeSplash();

    // 페이드인이 끝난 뒤 minDisplayDuration 동안 유지 후 페이드아웃
    const hideDelayMs = fadeInDuration * 1000 + minDisplayDuration;
    const hideTimerId = window.setTimeout(() => {
      setIsVisible(false);
    }, hideDelayMs);

    return () => window.clearTimeout(hideTimerId);
  }, [minDisplayDuration, fadeInDuration]);

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {isVisible && (
        <motion.section
          key="custom-splash"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          variants={variants.background}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.figure
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            variants={variants.logo}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Image
              src="/assets/custom-splash.png"
              alt="앱 스플래시"
              width={400}
              height={400}
              priority
            />
          </motion.figure>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
