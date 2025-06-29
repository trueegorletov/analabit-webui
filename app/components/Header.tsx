'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiGithub, SiTelegram, SiBoosty } from 'react-icons/si';
import { Poppins } from 'next/font/google';
import CustomIcon from './CustomIcon';

// Fancy font just for the brand logo
const brandFont = Poppins({ weight: '600', subsets: ['latin'] });

// Shared IconButton component as suggested in the plan
const IconButton = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size: number }>;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    className="opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 text-white"
  >
    <Icon size={25} />
  </a>
);

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Header is now shown on all pages including dashboard pages

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 w-full z-50 bg-[rgba(9,9,9,0.66)] border-b border-[rgba(255,255,255,0.2)] transition-shadow px-2 backdrop-blur-[18px] backdrop-saturate-[66%] backdrop-grayscale-[66%] ${scrolled ? 'shadow-lg' : ''}`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between h-[46px] sm:h-[48px] max-h-[46px] sm:max-h-[48px] px-2"
      >
        <Link
          href="/"
          className={`${brandFont.className} text-2xl md:text-3xl font-semibold tracking-tight text-white no-underline visited:text-white hover:no-underline focus-visible:no-underline flex items-center gap-2`}
        >
          <CustomIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
          analabit
        </Link>
        <div className="flex items-center gap-2">
          <IconButton
            href="https://github.com/analabit"
            label="GitHub"
            icon={SiGithub}
          />
          <IconButton
            href="https://t.me/analabit"
            label="Telegram"
            icon={SiTelegram}
          />
          <IconButton
            href="https://boosty.to/analabit"
            label="Boosty"
            icon={SiBoosty}
          />
        </div>
      </nav>
    </header>
  );
}

export default Header;
