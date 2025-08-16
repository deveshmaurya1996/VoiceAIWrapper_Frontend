import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Management System",
  description: "A multi-tenant project management tool built with Next.js and GraphQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
