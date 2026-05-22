import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import InstallPWAButton from "./components/InstallPWAButton";
import SerwistProviderWrapper from "./components/SerwistProviderWrapper";
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
  title: "Just Meditation",
  icons: [
    { rel: "icon", url: "/icon-192.webp" },
    { rel: "apple-touch-icon", url: "/icon-192.webp" },
  ],
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
        <SerwistProviderWrapper>
          <InstallPWAButton />
          <SplashGate>{children}</SplashGate>
        </SerwistProviderWrapper>
      </body>
    </html>
  );
}
