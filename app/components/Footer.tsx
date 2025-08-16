"use client";

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 text-neutral-400 text-xs sm:text-sm px-4 py-6 mt-13 md:mt-16">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        {/* Feedback & rights notice */}
        <div className="space-y-2 max-w-prose">
          <p>
            Для обратной связи:{' '}
            <a
              href="mailto:trueegorletov@protonmail.com"
              className="underline hover:text-white transition-colors break-all"
            >
              trueegorletov@protonmail.com
            </a>
          </p>
          <p>
            Цитирование или использование данных, полученных с помощью analabit,
            разрешено при условии указания источника.
          </p>
        </div>

        {/* Links & credits */}
        <div className="space-y-2 md:text-right whitespace-normal md:whitespace-nowrap">
          <div className="flex flex-wrap md:justify-end gap-4">
            <a
              href="https://boosty.to/analabit"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Boosty
            </a>
            <a
              href="https://t.me/trueegorletov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://github.com/trueegorletov/analabit"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="/help"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Справка
            </a>
          </div>
          <p className="break-words">
            Особая благодарность{' '}
            <span className="font-medium text-white">ДОРОГОМУ БРАТУ Новинскому Максиму</span> за поддержку проекта.
          </p>
        </div>
      </div>
    </footer>
  );
} 