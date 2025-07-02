import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import '@arco-design/web-react/dist/css/arco.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collection of Works | 作品集",
  description: "一个充满活力与创意的作品展示空间",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} flex flex-col min-h-screen bg-light`}>
        {/* 背景层 */}
        <div className="fixed inset-0 -z-10 bg-light"></div>
        
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 z-10 relative">
          <div className="pt-20">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
