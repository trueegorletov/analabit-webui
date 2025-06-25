import type { Metadata } from "next";
import "./globals.scss";
import Header from './components/Header'

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
      <body><Header />{children}</body>
    </html>
  );
}
