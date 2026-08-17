import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "Return Radar · 留学生秋招求职系统",
    description: "为 UCL HEDS 2026 毕业生打造的 HEOR、市场准入、AI 医疗与全球业务动态求职看板。",
    openGraph: { title: "Return Radar", description: "留学生秋招情报与执行系统", images: [image] },
    twitter: { card: "summary_large_image", title: "Return Radar", description: "留学生秋招情报与执行系统", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
