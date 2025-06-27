'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SiGithub, SiTelegram, SiBoosty } from 'react-icons/si'
import { Poppins } from 'next/font/google'

// Fancy font just for the brand logo
const brandFont = Poppins({ weight: '600', subsets: ['latin'] })

function Header () {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Header is now shown on all pages including dashboard pages

  return (
    <header
      style={{ backdropFilter: 'blur(18px) saturate(66%) grayscale(66%)', padding: '0 8px' }}
      className={`fixed top-0 left-0 w-full z-50 bg-[rgba(9,9,9,0.66)] border-b border-[rgba(255,255,255,0.2)] transition-shadow ${scrolled ? 'shadow-lg' : ''}`}
    >
      <nav
        aria-label='Main'
        style={{ padding: '0 8px' }}
        className='mx-auto flex max-w-7xl items-center justify-between h-[46px] sm:h-[48px] max-h-[46px] sm:max-h-[48px]'
      >
        <Link
          href='/'
          className={`${brandFont.className} text-2xl md:text-3xl font-semibold tracking-tight text-white no-underline visited:text-white hover:no-underline focus-visible:no-underline`}
        >
          analabit
        </Link>
        <div className='flex items-center' style={{ columnGap: '0.5rem' }}>
          <a
            href='https://github.com/analabit'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='GitHub'
            title='GitHub'
            className='opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 text-white'
          >
            <SiGithub size={25} />
          </a>
          <a
            href='https://t.me/analabit'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Telegram'
            title='Telegram'
            className='opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 text-white'
          >
            <SiTelegram size={25} />
          </a>
          <a
            href='https://boosty.to/analabit'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Boosty'
            title='Boosty'
            className='opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 text-white'
          >
            <SiBoosty size={25} />
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Header 