import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Health Co-Pilot",
  description: "Smart Ingredient Safety Analyzer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-black selection:bg-green-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}