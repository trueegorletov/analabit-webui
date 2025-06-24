import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analabit Admission",
  description: "Check your admission status",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
