import React from 'react';

export const metadata = {
  title: 'О сервисе analabit',
  description: 'Подробная информация о том, как работает analabit и его симуляции оттока оригиналов.',
};

export default function HelpPage() {
  return (
    <main className="min-h-screen flex justify-center pb-24">
      <div className="dashboard-container text-left space-y-8 text-neutral-200">
        <h1 className="text-3xl font-bold text-white">Справка</h1>

        <p>
          AnalAbit — это веб-интерфейс к&nbsp;открытому скраперу-анализатору, чья миссия&nbsp;— помочь
          абитуриентам оценить свои шансы на&nbsp;поступление <span className="whitespace-nowrap">в&nbsp;любое&nbsp;из</span>{' '}
          российских высших учебных заведений.        
        </p>

        <h2 className="text-2xl font-semibold text-white">Как это работает?</h2>
        <p>
          В&nbsp;системе приёма действует правило приоритетов заявлений. Анализатор строит конкурсные
          списки&nbsp;— <em>с учётом пяти возможных приоритетов, квотных мест и&nbsp;уже поданных оригиналов</em> — и
          вычисляет <strong>минимальный балл, выше которого абитуриент гарантированно проходит</strong>.
          В&nbsp;отличие от&nbsp;простого «среза» по&nbsp;конкурсному номеру это даёт реалистичную картину даже
          при&nbsp;сложном переплетении списков.
        </p>

        <h2 className="text-2xl font-semibold text-white">Симуляции оттока оригиналов</h2>
        <p>
          На&nbsp;странице направления вы&nbsp;можете открыть вкладку <strong>Drained&nbsp;Results</strong>. В&nbsp;ней
          показаны <em>четыре сценария</em> возможного оттока оригиналов (drain): <strong>33&nbsp;%</strong>,{' '}
          <strong>50&nbsp;%</strong>, <strong>66&nbsp;%</strong> и&nbsp;<strong>100&nbsp;%</strong>.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>33 %</strong> — мягкий сценарий: треть поступающих потенциально забирают оригиналы и&nbsp;уходят из
            конкурса.
          </li>
          <li>
            <strong>50 %</strong> — базовый сценарий равновесия: уходит каждый второй «неустойчивый» абитуриент.
          </li>
          <li>
            <strong>66 %</strong> — пессимистичный: из&nbsp;трёх остаётся только один.
          </li>
          <li>
            <strong>100 %</strong> — крайний случай: уходят все, чьи оригиналы теоретически могут «утечь».
          </li>
        </ul>
        <p>
          Таблица показывает, как меняются проходные баллы и&nbsp;позиции при&nbsp;каждом сценарии. Это помогает
          оценить риски и принять обоснованное решение: стоит ли подавать заявление, приносить оригинал или
          переключиться на другую программу.
        </p>

        <h2 className="text-2xl font-semibold text-white">Часто задаваемые вопросы</h2>
        <div className="space-y-6">
          <div>
            <p className="font-medium text-white">❓ Какова точность предсказаний?</p>
            <p>
              Данные об&nbsp;оригиналах обновляются регулярно, однако даже за&nbsp;минуту до&nbsp;«часа&nbsp;X» они
              неполны. Поэтому предлагаемая сервисом планка&nbsp;— это <em>верхняя&nbsp;граница</em> проходного бала.
              Практика показывает, что реальный проходной, как правило, оказывается заметно ниже.
            </p>
          </div>

          <div>
            <p className="font-medium text-white">❓ Я всё равно боюсь не&nbsp;поступить. Что делать?</p>
            <p>
              Если по&nbsp;текущему раскладу вы&nbsp;уже проходите&nbsp;— отлично! Если нет, продолжайте следить за
              списками: ситуация меняется вплоть до&nbsp;последних минут приёма.
            </p>
          </div>

          <div>
            <p className="font-medium text-white">❓ Нашёл баг или идею для фичи. Куда писать?</p>
            <p>
              Оставляйте issue на&nbsp;
              <a
                href="https://github.com/trueegorletov/analabit"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                GitHub
              </a>{' '}
              или пишите автору: <a href="mailto:trueegorletov@protonmail.com" className="underline hover:text-white">trueegorletov@protonmail.com</a>.
            </p>
          </div>
        </div>

        <p className="pt-8 text-sm text-neutral-500">
          Анализатор и&nbsp;исходный код распространяются под лицензией MIT. Используйте данные сервиса со
          ссылкой на&nbsp;источник.
        </p>
      </div>
    </main>
  );
} 