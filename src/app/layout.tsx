import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme/theme";
import Layout from "@/components/Layout/Layout";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LUNALABS - AI Voice Synthesis",
  description: "专业的 AI 语音合成服务，提供自然、富有表现力的语音生成功能",
  keywords: "AI, 语音合成, TTS, 语音生成, 人工智能",
  authors: [{ name: "LUNALABS Team" }],
  openGraph: {
    title: "LUNALABS - AI Voice Synthesis",
    description: "专业的 AI 语音合成服务",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUNALABS - AI Voice Synthesis",
    description: "专业的 AI 语音合成服务",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Layout>{children}</Layout>
          </ThemeProvider>
        </AppRouterCacheProvider>

        {/* WUUNU SNIPPET - DON'T CHANGE THIS (START) */}
        {process.env.NODE_ENV !== "production" && (
          <>
            <Script id="wuunu-ws" strategy="afterInteractive">
              {`window.__WUUNU_WS__ = "http://127.0.0.1:58798/";`}
            </Script>
            <Script
              id="wuunu-widget"
              src="https://cdn.jsdelivr.net/npm/@wuunu/widget@0.1?cacheParam=56"
              strategy="afterInteractive"
              crossOrigin="anonymous"
            />
          </>
        )}
        {/* WUUNU SNIPPET - DON'T CHANGE THIS (END) */}
      </body>
    </html>
  );
}
