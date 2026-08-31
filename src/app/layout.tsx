import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { auth, signOut } from "../../auth";
import { LegalFooter } from "@/components/legal-footer";
import { SiteNavigation } from "@/components/site-navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecurityMatch | Beveiligingsprofessionals verbinden",
  description:
    "De marketplace voor ZZP-beveiligers en opdrachtgevers in Nederland.",
  icons: {
    icon: "/securitymatch-icon.svg",
    apple: "/securitymatch-icon.svg",
  },
};

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <html
      lang="nl"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteNavigation role={session?.user?.role ?? null} userName={session?.user?.name} signOutAction={handleSignOut} />
        <div className="flex-1">{children}</div>
        <LegalFooter />
      </body>
    </html>
  );
}
