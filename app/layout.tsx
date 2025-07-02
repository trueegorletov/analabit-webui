import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import ParallaxBackground from './components/ParallaxBackground';
import Footer from './components/Footer';
import HelpButton from './components/HelpButton';
import RootProviders from './RootProviders';
import Shell from './Shell';

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
    <html lang={process.env.NEXT_PUBLIC_LANG ?? 'ru'}>
      <body>
        <RootProviders>
          <main id="root">
            <Shell />
            <ParallaxBackground />
            <Header />
            {children}
            <Footer />
            <HelpButton />
          </main>
        </RootProviders>
      </body>
    </html>
  );
}
