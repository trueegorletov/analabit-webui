import type { Metadata } from 'next';
import Script from 'next/script';
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
      <head>
        {/* Yandex.Metrika counter */}
        <Script
          id="yandex-metrica"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(103269604, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true
            });
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/103269604"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
      </head>
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
