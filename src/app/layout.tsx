import { ClerkProvider } from '@clerk/nextjs'

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { Header } from '~/components/layout/header';

export const metadata: Metadata = {
  title: "noexcuses",
  description: "no excuses.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="flex flex-col min-h-screen bg-black text-white">
          <div>
            <Header />
          </div>
          <div>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
