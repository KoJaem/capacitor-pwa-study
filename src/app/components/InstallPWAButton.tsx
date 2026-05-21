// src/app/components/InstallPWAButton.tsx

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

  if (isIosDevice) {
    return (
      <div>
        iOS에서는 Safari 하단의 공유 버튼을 누른 뒤
        <strong>홈 화면에 추가</strong>를 선택해 주세요.
      </div>
    );
  }

  if (!promptEvent) {
    return null;
  }

  return (
    <button
      type="button"
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
