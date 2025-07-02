import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 text-neutral-400 text-xs sm:text-sm px-4 py-6 mt-12">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        {/* Feedback & rights notice */}
        <div className="space-y-2 max-w-prose">
          <p>
            Для обратной связи:{' '}
            <a
              href="mailto:trueegorletov@protonmail.com"
              className="underline hover:text-white transition-colors"
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
        <div className="space-y-2 md:text-right whitespace-nowrap">
          <div className="flex md:justify-end gap-4">
            <a
              href="https://boosty.to/egorletov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Boosty
            </a>
            <a
              href="https://t.me/your_telegram"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://github.com/trueegorletov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
          <p>
            Особая благодарность{' '}
            <span className="font-medium text-white">Максиму Новинскому</span> (Maxim
            Novinsky) за поддержку проекта.
          </p>
        </div>
      </div>
    </footer>
  );
} 