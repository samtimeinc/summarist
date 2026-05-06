'use client'

import "@/app/globals.css";
import { Roboto, Roboto_Mono } from "next/font/google";
import { Providers } from "./providers";
import AuthListener from "@/components/AuthListener";
import { ToastContainer } from "@/components/Toast/ToastNotification";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoSans.variable} ${robotoMono.variable}`}>
        <Providers>
          <AuthListener />
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
