import type { Metadata } from "next";
import { Audiowide } from "next/font/google";
import "./globals.css";

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-audiowide",
});

export const metadata: Metadata = {
  title: "WEDNESS - 국내 최초 프리미엄 VR 웨딩 촬영",
  description:
    "당신의 결혼식, 그 날의 분위기를 언제든 다시 느껴보세요. WEDNESS는 웨딩 예식을 360도 VR로 정교하게 기록하여, 시간이 지나도 변함없이 그날의 감동을 다시 경험할 수 있도록 합니다.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={audiowide.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
