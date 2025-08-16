"use client";

import { useState, Suspense, useRef, useEffect } from 'react';
import CustomIcon from './CustomIcon';
import dynamic from 'next/dynamic';
import Footer from './Footer';

// Dynamically import the shaders-powered volumetric blob (same as main page)
const VolumetricBlob = dynamic(() => import('./VolumetricBlob'), { ssr: false });

export default function OffseasonStub() {
    const [expanded, setExpanded] = useState(false);
    const scrollTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (scrollTimerRef.current !== null) {
                clearTimeout(scrollTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center">
            {/* Top spacer: increased to avoid URL bar cut-off on small screens */}
            <div className="w-full px-4 pt-4 sm:pt-6 md:pt-8" />

            {/* Logo with subtle animated sigils left/right */}
            <div className="relative flex items-center justify-center select-none isolate">
                {/* Center logo wrapped by sigil container (pseudo-elements for perfect symmetry) */}
                <div className="sigil-wrap relative z-0 flex items-center justify-center">
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        <CustomIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                        <span className="font-sans text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">analabit</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 sm:mt-10 md:mt-12 w-full flex items-center justify-center">
                <div className="wave-container" aria-hidden>
                    <Suspense fallback={<div>Загрузка...</div>}>
                        <VolumetricBlob loading={false} error={false} />
                    </Suspense>
                </div>
            </div>

            <div className="mt-6 sm:mt-8 md:mt-10 text-center px-4">
                <h1 className="title">Прием-2025 завершён</h1>
                <p className="mt-3 sm:mt-4 text-xl sm:text-2xl text-zinc-300">До встречи в следующем году!</p>
            </div>

            <div className="w-full max-w-3xl px-4 mt-10 sm:mt-12 md:mt-16">
                <p className="text-left text-zinc-300 text-base sm:text-lg mb-3">
                    А пока рекомендуем к прочтению следующую статью от автора admlist.ru:
                </p>

                <button
                    type="button"
                    onClick={() =>
                        setExpanded((v) => {
                            const next = !v;
                            // If opening while the page is at the very top, defer scroll
                            if (next && typeof window !== 'undefined') {
                                const yNow = window.scrollY || window.pageYOffset || 0;
                                if (yNow < 4) {
                                    if (scrollTimerRef.current !== null) {
                                        clearTimeout(scrollTimerRef.current);
                                    }
                                    // Wait a bit so the expanding content increases page height
                                    scrollTimerRef.current = window.setTimeout(() => {
                                        // Only scroll if user is still near the top
                                        const y = window.scrollY || window.pageYOffset || 0;
                                        if (y < 8) {
                                            const target = Math.round(window.innerHeight * 0.511);
                                            window.scrollTo({ top: target, behavior: 'smooth' });
                                        }
                                    }, 360);
                                }
                            }
                            return next;
                        })
                    }
                    className="group w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-4 hover:bg-white/[0.07] transition-colors"
                    aria-expanded={expanded}
                    aria-controls="offseason-article"
                >
                    <span className="text-base sm:text-lg font-medium text-white">Как должна быть устроена система поступления</span>
                    <svg
                        className={`arrow-icon ml-3 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white/80 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path fillRule="evenodd" d="M6.293 9.293a1 1 0 0 1 1.414 0L10 11.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414Z" clipRule="evenodd" />
                    </svg>
                </button>

                <div
                    id="offseason-article"
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out mt-2 ${expanded ? 'opacity-100 grid-rows-[1fr]' : 'opacity-0 grid-rows-[0fr]'}`}
                >
                    <div className="overflow-hidden">
                        <div className="rounded-xl border border-white/10 bg-black/50 p-4 sm:p-5 md:p-6">
                            <p className="text-sm text-zinc-400 mb-4">
                                Оригинальная статья с admlist.ru доступна{' '}
                                <a
                                    href="https://web.archive.org/web/20220803142553/http://admlist.ru/how.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-200 underline hover:text-white"
                                >
                                    в архиве Wayback Machine
                                </a>
                            </p>
                            <ArticleContent />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Local CSS: perfectly symmetric sigils as pseudo-elements of the logo container */}
            <style jsx>{`
                                                .sigil-wrap {
                                                    /* Base size and gap */
                                                    --sigil-size: calc(22vmin * 0.8); /* 20% smaller */
                                    --sigil-gap: 2.5rem;
                                }
                                @media (min-width: 640px) { /* sm */
                                    .sigil-wrap { --sigil-gap: 3rem; }
                                }
                                @media (min-width: 768px) { /* md */
                                    .sigil-wrap { --sigil-gap: 3.5rem; }
                                }

                                .sigil-wrap::before,
                                .sigil-wrap::after {
                                    content: '';
                                    position: absolute;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    width: var(--sigil-size);
                                    height: var(--sigil-size);
                                    mix-blend: normal;
                                    mix-blend-mode: screen;
                                    filter: invert(1) brightness(1);
                                    opacity: 0.0211;
                                    background-size: contain;
                                    background-repeat: no-repeat;
                                    pointer-events: none;
                                    animation: sigilPulse 7s ease-in-out infinite both;
                                }
                                .sigil-wrap::before {
                                    background-image: url('/sigil_1.png');
                                    left: calc(-1 * var(--sigil-gap) - var(--sigil-size));
                                }
                                .sigil-wrap::after {
                                    background-image: url('/sigil_2.png');
                                    right: calc(-1 * var(--sigil-gap) - var(--sigil-size));
                                }

                                @keyframes sigilPulse {
                                    0% { filter: invert(1) brightness(0.94) contrast(1.05) hue-rotate(0deg); }
                                    50% { filter: invert(1) brightness(1.06) contrast(1.12) hue-rotate(12deg); }
                                    100% { filter: invert(1) brightness(0.94) contrast(1.05) hue-rotate(0deg); }
                                }
                        `}</style>
        </div>
    );
}

function ArticleContent() {
    return (
        <article className="max-w-none">
            <h2 className="section-title mb-4" style={{ textAlign: 'left' }}>Коротко</h2>
            <p className="text-zinc-200">
                Абитуриент получает свои баллы ЕГЭ, олимпиады, индивидуальные достижения, справки об инвалидности и т.п. (всё как сейчас). Расставляет, например, 15 образовательных программ по приоритету. Если абитуриент не проходит по первому приоритету, то он участвует в конкурсе по второму, если не проходит и по нему — по третьему и так далее. Если он попадает в каком-то конкурсе в КЦП, но выталкивает кого-то, то этот вытолкнутый абитуриент переходит по своему следующему приоритету и так далее. В итоге оказывается так, что ни для одного абитуриента не найдется никого слабее его ни в одном более приоритетном конкурсе. Наступает справедливость.
            </p>

            <h3 className="mt-6 text-xl font-semibold">Ничего непонятно, но очень интересно!</h3>
            <p className="text-zinc-200">Посмотрите <a href="#exmp" className="underline">пример</a>, будет понятнее.</p>

            <h3 className="mt-6 text-xl font-semibold">Получается, все должны сдавать одинаковые экзамены?</h3>
            <p className="text-zinc-200">
                Нет, внутри одного конкурса люди ранжируются как сейчас. Кто не попал в КЦП — ушел на свой следующий приоритет (возможно, там другие критерии ранжирования, но это не проблема).
            </p>

            <h3 className="mt-6 text-xl font-semibold">Это очень сложная система, её невозможно реализовать!</h3>
            <p className="text-zinc-200">Нет, на пару вечеров работы. А работать будет минут за десять для всех российских абитуриентов.</p>

            <h3 className="mt-6 text-xl font-semibold">А если я передумаю и захочу поменять приоритеты?</h3>
            <p className="text-zinc-200">Приоритеты можно менять хоть каждые три минуты до момента X. В момент X происходит справедливое распределение.</p>

            <h3 className="mt-6 text-xl font-semibold">В этой системе невозможно учесть БВИ, целевой приём и особое право!</h3>
            <p className="text-zinc-200">Нынешняя система позволяет ранжировать все эти категории граждан, ничего менять не нужно. Ранжировать как сейчас и нет проблем.</p>

            <h3 className="mt-6 text-xl font-semibold">В этой системе невозможно учесть ДВИ!</h3>
            <p className="text-zinc-200">
                Записываетесь заранее, сдаёте ДВИ и только со сданным ДВИ имеете право принять участие в конкурсе. После сдачи ДВИ выбираете этот конкурс в качестве одного из приоритетов и дальше ранжирование как сейчас. Пролетели — автоматически перешли на следующий конкурс. А так хоть во все 15 мест можно разные ДВИ сдавать, никаких проблем.
            </p>

            <h3 className="mt-6 text-xl font-semibold">Это вы сами придумали?</h3>
            <p className="text-zinc-200">Нет, это придумали в 1962 году Гэйл и Шепли. В 2012 они получили за эту идею Нобелевскую премию по экономике.</p>

            <h3 className="mt-6 text-xl font-semibold">Это вообще где-нибудь уже работает?</h3>
            <p className="text-zinc-200">Да, примерно так был устроен приём в украинские вузы, например. И ещё много где используется.</p>

            <h3 className="mt-6 text-xl font-semibold">Из-за этой системы вузы не заработают миллиарды рублей, потому что те кто пролетит мимо всех приоритетов - бедные и плохо подготовленные (не хватало денег на репетиторов и квартиру в районе с хорошей школой). Они же не смогут оплатить платное обучение!</h3>
            <p className="text-zinc-200">Да.</p>

            <h3 className="mt-6 text-xl font-semibold">Из-за этой системы все самые умные уедут в столицу!</h3>
            <p className="text-zinc-200">Ну не все, но уедут, да.</p>

            <h3 className="mt-6 text-xl font-semibold">Мне нравится ваша идея, куда заносить деньги, что делать, кому писать?!</h3>
            <p className="text-zinc-200">Расскажите знакомым и незнакомым, что система поступления может быть нормальной.</p>

            <h3 className="mt-6 text-xl font-semibold"><a id="exmp" />Пример</h3>
            <p className="text-zinc-200">
                Пусть у нас есть шесть людей: Анна, Борис, Валентина, Григорий, Диана и Евгений, а также три образовательных программы X, Y, Z, по два места на каждой. Все эти люди сдавали какие-то свои наборы ЕГЭ и ДВИ и их результаты отображены в таблице (прочерк означает, что они не сдали соответствующий образовательной программе набор экзаменов):
            </p>

            <div className="overflow-x-auto mt-3 rounded-lg border border-white/10">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-white/[0.06]">
                        <tr>
                            <th className="px-3 py-2 font-medium text-zinc-200">Имя</th>
                            <th className="px-3 py-2 font-medium text-zinc-200">X</th>
                            <th className="px-3 py-2 font-medium text-zinc-200">Y</th>
                            <th className="px-3 py-2 font-medium text-zinc-200">Z</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['Анна', '310', '-', '268'],
                            ['Борис', '200', '210', '200'],
                            ['Валентина', '-', '211', '212'],
                            ['Григорий', '300', '213', '212'],
                            ['Диана', '299', '299', '299'],
                            ['Евгений', '-', '298', '300'],
                        ].map((row, idx) => (
                            <tr key={idx} className={idx % 2 ? 'bg-white/[0.03]' : ''}>
                                {row.map((cell, i) => (
                                    <td key={i} className="px-3 py-2 text-zinc-200">{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 text-zinc-200">К моменту распределения люди расставили следующие приоритеты:</p>
            <div className="overflow-x-auto mt-3 rounded-lg border border-white/10">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-white/[0.06]">
                        <tr>
                            <th className="px-3 py-2 font-medium text-zinc-200">Имя</th>
                            <th className="px-3 py-2 font-medium text-zinc-200">Приоритет 1</th>
                            <th className="px-3 py-2 font-medium text-zinc-200">Приоритет 2</th>
                            <th className="px-3 py-2 font-medium text-zinc-200">Приоритет 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['Анна', 'Z', 'X', '-'],
                            ['Борис', 'Z', 'Y', 'X'],
                            ['Валентина', 'Y', 'Z', '-'],
                            ['Григорий', 'Z', 'Y', 'X'],
                            ['Диана', 'Z', 'X', 'Y'],
                            ['Евгений', 'Y', 'Z', '-'],
                        ].map((row, idx) => (
                            <tr key={idx} className={idx % 2 ? 'bg-white/[0.03]' : ''}>
                                {row.map((cell, i) => (
                                    <td key={i} className="px-3 py-2 text-zinc-200">{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-zinc-200">Проверим для каждого абитуриента:</p>
            <p className="text-zinc-200">Анна первым приоритетом указала программу Z и поступила туда с баллом 310.</p>
            <p className="text-zinc-200">Борис первым приоритетом указал программу Z, но со своим баллом 200 оказался хуже Анны (310) и Дианы (299). Второй приоритет Бориса - программа Y, балл у Бориса на ней равен 210, что хуже, чем у Евгения (298) и Григория (212). В итоге Борис попал на программу X по третьему приоритету с баллом 200.</p>
            <p className="text-zinc-200">Валентина первым приоритетом указала программу Y, но со своим баллом 200 оказалась хуже Евгения (298) и Григория (212). Второй приоритет Валентины - программа Z, но она не поступила и туда со своим баллом 212, что хуже чем у Анны (310) и Дианы (298). Валентина не поступила никуда, т.к. третьего приоритета у неё нет.</p>
            <p className="text-zinc-200">Григорий первым приоритетом указал программу Z, но со своим баллом 212 оказался хуже Анны (310) и Дианы (299). Второй приоритет Григория - программа Y, на которую он и поступил с баллом 212.</p>
            <p className="text-zinc-200">Диана первым приоритетом указала программу Z и поступила туда с баллом 299.</p>
            <p className="text-zinc-200">Для любого абитуриента на более желанной для него программе оказались только абитуриенты с большим баллом.</p>
        </article>
    );
}
