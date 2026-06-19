import React from "react";
import "../styles/globals.css";
import QueryProvider from "../lib/query-provider";

export const metadata = {
  title: "MangaNarrator AI - Interactive Manga Narration",
  description: "AI-powered multimodal Manga-to-Audio reader",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
