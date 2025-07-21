'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiGithub, SiTelegram, SiBoosty } from 'react-icons/si';
import CustomIcon from './CustomIcon';
import Image from 'next/image';

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
      className={`fixed top-0 left-0 w-full z-50 bg-[rgba(2,1,1,0.82)] border-b border-[rgba(255,255,255,0.2)] transition-shadow px-2 backdrop-blur-[22px] backdrop-saturate-[66%] backdrop-grayscale-[66%] ${scrolled ? 'shadow-lg' : ''} relative`}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
             src="/sigil_1.png"
             alt=""
             width={1024}
             height={1024}
             className="absolute opacity-[0.11] mix-blend-soft-light filter invert brightness-[0.97] contrast-110"
             style={{
               height: '75%',
               width: '75%',
               objectFit: 'contain',
               transform: 'translateX(-20px)'
             }}
             priority
           />
           <Image
             src="/sigil_2.png"
             alt=""
             width={1024}
             height={1024}
             className="absolute opacity-[0.2] mix-blend-soft-light filter invert brightness-[0.97] contrast-90"
             style={{
               height: '90%',
               width: '90%',
               objectFit: 'contain',
               transform: 'translateX(20px)'
             }}
             priority
           />
        </div>
      </div>
      
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between h-[46px] sm:h-[48px] max-h-[46px] sm:max-h-[48px] px-2 relative z-10"
      >
        <Link
          href="/"
          className="font-sans text-2xl md:text-3xl font-semibold tracking-tight text-white no-underline visited:text-white hover:no-underline focus-visible:no-underline flex items-center gap-2"
        >
          <CustomIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
          analabit
        </Link>
        <div className="flex items-center gap-2">
          <IconButton
            href="https://github.com/trueegorletov/analabit"
            label="GitHub"
            icon={SiGithub}
          />
          <IconButton
            href="https://t.me/trueegorletov"
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
