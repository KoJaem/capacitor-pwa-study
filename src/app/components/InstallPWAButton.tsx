"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function isIos() {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent.toLowerCase();

  return (
    /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes("macintosh") && window.navigator.maxTouchPoints > 1)
  );
}

function isAndroid() {
  if (typeof window === "undefined") return false;
  return /android/i.test(window.navigator.userAgent);
}

function isCapacitorNativeApp() {
  if (typeof window === "undefined") return false;

  const capacitor = (
    window as Window & {
      Capacitor?: { isNativePlatform?: () => boolean };
    }
  ).Capacitor;

  return capacitor?.isNativePlatform?.() ?? false;
}

function isInStandaloneMode() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export default function InstallPWAButton() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isIosDevice] = useState(() => isIos());
  const [isAndroidDevice] = useState(() => isAndroid());
  const [isNativeApp] = useState(() => isCapacitorNativeApp());
  const [isStandalone] = useState(() => isInStandaloneMode());

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  if (isStandalone) {
    return null;
  }

  // Capacitor 네이티브 WebView에서는 PWA 설치 이벤트가 거의 발생하지 않음
  if (isNativeApp) {
    return (
      <p className="px-4 py-2 text-sm text-zinc-600">
        앱 설치(PWA)는 Android Chrome 브라우저에서 이 사이트를 열 때 사용할 수
        있습니다.
      </p>
    );
  }

  if (isIosDevice) {
    return (
      <p className="px-4 py-2 text-sm text-zinc-600">
        iOS에서는 Safari 하단의 공유 버튼을 누른 뒤{" "}
        <strong>홈 화면에 추가</strong>를 선택해 주세요.
      </p>
    );
  }

  if (promptEvent) {
    return (
      <button
        type="button"
        className="mx-4 my-2 rounded-lg bg-black px-4 py-2 text-sm text-white"
        onClick={async () => {
          await promptEvent.prompt();

          const choice = await promptEvent.userChoice;

          if (choice.outcome === "accepted") {
            setPromptEvent(null);
          }
        }}
      >
        앱 설치
      </button>
    );
  }

  // Android Chrome: 이벤트가 없어도 메뉴 안내 표시 (버튼이 null이면 아무것도 안 보이는 문제 방지)
  if (isAndroidDevice) {
    return (
      <p className="px-4 py-2 text-sm text-zinc-600">
        Chrome에서 설치하려면 주소창 옆 <strong>앱 설치</strong> 또는 메뉴(⋮) →{" "}
        <strong>앱 설치</strong> / <strong>홈 화면에 추가</strong>를
        사용해 주세요. (로컬 테스트는 <code>pnpm build</code> 후{" "}
        <code>pnpm start</code> 필요)
      </p>
    );
  }

  return null;
}
