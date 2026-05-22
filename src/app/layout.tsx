import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SplashGate from "./components/SplashGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PWA 앱 전체이름",
  description: "PWA 앱 설명",
  appleWebApp: {
    capable: true,
    title: "PWA 앱 전체이름",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SplashGate>{children}</SplashGate>
      </body>
    </html>
  );
}
