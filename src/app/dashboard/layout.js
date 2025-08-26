import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import StickyFooter from "@/components/mymenu/stickymenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function RootLayout({ children }) {
  return (
      <section
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <StickyFooter />
      </section>
  );
}
