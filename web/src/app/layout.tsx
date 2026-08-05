import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#070a12",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://khire.net"),
  title: {
    default: "KHIRE | 해외 한인 F&B (식당·카페) & 숙박·청소 특화 위치 기반 AI 채용 플랫폼",
    template: "%s | KHIRE - Hire Near. Hire Smart.",
  },
  description:
    "해외 한인식당, K-카페, 호텔 숙박 및 클리닝 업종 특화 30km 반경 근거리 AI 구인구직. 접속 위치 자동 감지 및 구글지도 업체 주소 핀 마킹, 24시간 Gemini AI 뉴스 브리핑 제공.",
  keywords: [
    "KHIRE",
    "해외 한인 구인구직",
    "한인식당 채용",
    "K-BBQ 조리장 구인",
    "카페 바리스타 채용",
    "호텔 클리닝 구인",
    "해외 한인 커뮤니티 채용",
    "30km 반경 일자리",
    "LA 한인타운 구인",
    "시드니 한인 식당",
    "도쿄 신쿠보 채용",
    "Hire Near Hire Smart",
  ],
  authors: [{ name: "KHIRE Platform Team", url: "https://khire.net" }],
  creator: "KHIRE Inc.",
  publisher: "KHIRE Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: "https://khire.net",
    siteName: "KHIRE - 해외 한인 F&B & 숙박·청소 AI 채용",
    title: "KHIRE | 해외 한인 F&B (식당·카페) & 숙박·청소 특화 위치 기반 AI 채용 플랫폼",
    description:
      "접속 IP/GPS 기반 30km 반경 실시간 구글지도 일자리 마킹 및 Gemini 3 Flash AI 맞춤 추천 구인구직.",
    images: [
      {
        url: "https://khire.net/og-image.png",
        width: 1200,
        height: 630,
        alt: "KHIRE - Hire Near. Hire Smart.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KHIRE | 해외 한인 F&B & 숙박·청소 특화 위치 기반 AI 채용",
    description: "30km 반경 구글지도 업체 주소 핀 표출 및 AI 스마트 일자리 매칭",
    images: ["https://khire.net/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://khire.net",
    languages: {
      "ko-KR": "https://khire.net/ko",
      "en-US": "https://khire.net/en",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KHIRE",
    url: "https://khire.net",
    description: "해외 한인 F&B (식당·카페) & 숙박·청소 특화 위치 기반 AI 채용 플랫폼",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://khire.net/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="ko"
      className={`${plusJakartaSans.variable} ${notoSansKr.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#070a12] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
        {children}
      </body>
    </html>
  );
}
