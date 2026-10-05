import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const robotoMono = localFont({
  src: "./fonts/RobotoMono-VariableFont_wght.ttf",
  variable: "--font-roboto-mono",
  weight: "100 700",
});

export const metadata: Metadata = {
  title: "Player of the Week | Fan Vote",
  description: "Vote for your Unrivaled Player of the Week and see live results.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={robotoMono.variable}>
      <body>{children}</body>
    </html>
  );
}