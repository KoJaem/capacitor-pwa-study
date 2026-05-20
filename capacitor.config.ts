import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "capacitor-study",
  webDir: "out",
  plugins: {
    StatusBar: {
      overlaysWebView: false, // 상태바가 웹 화면 위에 겹치지 않게 함
      style: "DEFAULT", // 기본 상태바 스타일 사용
      backgroundColor: "#ffffff", // Android 상태바 배경을 #FFFFFF으로 설정
    },
    SplashScreen: {
      launchShowDuration: 1500, // 앱 시작 시 스플래시를 약 1.5초 표시
      launchAutoHide: true, // 시간이 지나면 자동으로 숨김
      backgroundColor: "#ffffff", // 스플래시 배경색
      showSpinner: false, // 로딩 스피너 숨김
    },
  },
};

export default config;
