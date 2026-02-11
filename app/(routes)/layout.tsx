import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for Every Dev Event You Mustn't Miss",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
        <NuqsAdapter>
          <Suspense>
            <Navbar />
          </Suspense>
          <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
            <LightRays
              raysOrigin="top-center-offset"
              raysColor="#5dfeca"
              raysSpeed={0.5}
              lightSpread={0.9}
              rayLength={1.4}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0}
              distortion={0.01}
            />
          </div>
          <main>{children}</main>
          <Toaster
            toastOptions={{
              style: {
                borderRadius: "10px",
                background: "black",
                color: "#fff",
              },
            }}
          />
        </NuqsAdapter>
      </body>
    </html>
  );
}
