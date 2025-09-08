"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* export const metadata = {
  title: "ASSI COUPON SYSTEM",
  description: "Assi Coupon System is a web application designed for a school matron to manage coupon distribution for students. Built with Next.js, Tailwind CSS, Shadcn, and Redux, it allows the matron to use natural language commands to perform tasks. For example, commands like 'All students in Class 1 took coupons today except Josh Annan, Kwame Obeng, and Maame Ama' add transaction records to a database (e.g., Firestore) for each specified student, while queries like 'Did Josh take a coupon last week Wednesday?' retrieve and display transaction data. The app streamlines coupon tracking with an intuitive interface and efficient backend processing.",
}; */

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
