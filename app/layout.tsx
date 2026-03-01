import type { Metadata } from "next";
import { ConfigProvider } from "@/context/ConfigContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Face API App",
  description: "Detección de personas a traves de rostro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}