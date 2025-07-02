import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import ParallaxBackground from './components/ParallaxBackground';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Analabit Admission',
  description: 'Check your admission status',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <ParallaxBackground />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
