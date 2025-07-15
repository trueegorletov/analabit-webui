import React from 'react';
import { NoSymbolIcon, ArrowUpCircleIcon, QuestionMarkCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Legend() {
  return (
    <div className="mt-2">
      <h3 className="text-base sm:text-lg font-semibold text-gray-200 mb-4">
        Обозначения в таблице
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-left">
        {/* Green check */}
        <div className="flex items-start gap-3">
          <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <span className="font-medium">Оригинал подан в этот вуз</span>
            <p className="text-xs text-gray-400 mt-1">
              Абитуриент подал оригинал аттестата в данный университет. Включает как проходящих на это направление, так и не проходящих, но продолжающих конкурировать.
            </p>
          </div>
        </div>

        {/* Yellow circle */}
        <div className="flex items-start gap-3">
          <ArrowUpCircleIcon className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <span className="font-medium">Проходит на приоритетное направление</span>
            <p className="text-xs text-gray-400 mt-1">
              Абитуриент подал оригинал в этот вуз, но проходит на более приоритетное направление в своём списке. В данный момент не конкурирует за места здесь, но может начать, если будет вытеснен с приоритетного направления.
            </p>
          </div>
        </div>

        {/* Question mark */}
        <div className="flex items-start gap-3">
          <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <span className="font-medium">Выбор аттестата неизвестен</span>
            <p className="text-xs text-gray-400 mt-1">
              Мы не знаем, куда абитуриент подал оригинал аттестата: либо ещё не определился, либо выбрал вуз, не отслеживаемый сервисом. <em>Вымываются при проведении симуляций оттока аттестатов.</em>
            </p>
          </div>
        </div>

        {/* Red X */}
        <div className="flex items-start gap-3">
          <NoSymbolIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <span className="font-medium">Покинул конкурс</span>
            <p className="text-xs text-gray-400 mt-1">
              Абитуриент окончательно покинул конкурс в данный университет, подав оригинал аттестата в другой вуз. Теоретически может переложить аттестат, но это случается крайне редко.
            </p>
          </div>
        </div>

        {/* Other universities count */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-gray-600/50 rounded-sm border border-gray-500">
            <span className="font-mono text-[10px] xs:text-xs leading-none text-gray-200">2</span>
          </div>
          <div className="text-sm text-gray-300">
            <span className="font-medium">Число других вузов</span>
            <p className="text-xs text-gray-400 mt-1">
              Значение в предпоследнем столбце показывает, в сколько ещё университетов подал документы абитуриент. Нажмите на ID абитуриента в строке, чтобы увидеть список этих вузов.
            </p>
          </div>
        </div>

        {/* Violet highlight */}
        <div className="flex items-start gap-3">
          <div className="w-4 h-4 flex-shrink-0 mt-0.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-sm border border-purple-400/50"></div>
          <div className="text-sm text-gray-300">
            <span className="font-medium">Проходит на данное направление</span>
            <p className="text-xs text-gray-400 mt-1">
              Фиолетовый градиент с выделенным зелёным номером (#) обозначает, что абитуриент в данный момент проходит именно на это направление.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
