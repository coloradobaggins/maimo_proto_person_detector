import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { ConfigProvider } from "@/context/ConfigContext";
import { ContentProvider } from "@/context/ContentContext";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Face API App",
  description: "Detección de personas a traves de rostro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${fredoka.variable} ${nunito.variable}`}>
        <ConfigProvider>
          <ContentProvider>
            {children}
          </ContentProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}