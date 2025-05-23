'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider, useUser } from "./UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ACCOUNTS_URL } from "@pulse/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function InnerRoot({ children }: { children: React.ReactNode }) {
  const { userData, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!userData && !isLoading) {
      router.push(`${ACCOUNTS_URL}/v1/login`);
    }
  }, [userData, isLoading, router]);

  if (!userData && !isLoading) {
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <InnerRoot>{children}</InnerRoot>
        </body>
      </html>
    </AuthProvider>
  );
}