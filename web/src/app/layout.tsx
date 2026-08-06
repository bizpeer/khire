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
    default: "호주 뉴질랜드 한인 구인구직 1위 - KHIRE | 시드니, 멜버른, 브리스번, 오클랜드 일자리",
    template: "%s | KHIRE - 호주·뉴질랜드 해외 한인 구인구직 플랫폼",
  },
  description:
    "호주 한인 구인구직 및 뉴질랜드 오클랜드 일자리 특화 1위. 시드니 한인 알바, 멜버른 워홀 일자리, 브리스번 한인 구인, 호주 타일 구인, 시드니 청소 알바, 브리스번 타일공 구직, 호주 회계사 채용 및 F&B/숙박/청소/전문직 위치 기반 AI 매칭 플랫폼.",
  keywords: [
    "KHIRE",
    "호주 한인 구인구직",
    "시드니 한인 알바",
    "멜버른 워홀 일자리",
    "브리스번 한인 구인",
    "뉴질랜드 오클랜드 한인 구인구직",
    "뉴질랜드 크라이스트처치 한인 구인",
    "호주 타일 구인",
    "시드니 청소 알바",
    "브리스번 타일공 구직",
    "호주 회계사 채용",
    "호주 워킹홀리데이 채용",
    "시드니 한인식당 구인",
    "멜버른 바리스타 채용",
    "오클랜드 클리닝 구인",
    "khire.net",
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
    siteName: "KHIRE - 호주·뉴질랜드 해외 한인 구인구직",
    title: "호주 뉴질랜드 한인 구인구직 1위 - KHIRE | 시드니, 멜버른, 오클랜드 일자리",
    description:
      "호주 한인 구인구직, 시드니 한인 알바, 멜버른 워홀, 브리스번 타일공 구직, 시드니 청소 알바, 호주 회계사 채용 및 뉴질랜드 오클랜드 한인 채용 정보.",
    images: [
      {
        url: "https://khire.net/og-image.png",
        width: 1200,
        height: 630,
        alt: "KHIRE - 호주 뉴질랜드 한인 구인구직",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KHIRE | 호주·뉴질랜드 해외 한인 구인구직 1위",
    description: "시드니, 멜버른, 브리스번, 오클랜드 타일공, 청소, 회계사, F&B, 워홀 스마트 AI 채용 매칭",
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
    name: "KHIRE - 호주·뉴질랜드 해외 한인 구인구직",
    url: "https://khire.net",
    description: "호주 한인 구인구직, 시드니 한인 알바, 멜버른 워홀 일자리, 브리스번 타일공 구직, 시드니 청소 알바, 호주 회계사 채용 및 뉴질랜드 오클랜드 일자리 매칭 플랫폼",
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
