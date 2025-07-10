import type { Metadata } from 'next';

// Base configuration for the site
const SITE_CONFIG = {
    name: 'analabit',
    domain: 'https://analabit.ru',
    description: 'Анализатор поступления в российские вузы',
    keywords: {
        base: [
            'анализатор', 'поступление', 'абитуриенты', 'университеты', 'конкурс', 'проходной балл', 'вузы',
            'ЕГЭ', 'баллы', 'рейтинг', 'списки', 'мониторинг', 'отслеживание', 'анализ',
        ],
        year: ['2025', 'поступление 2025', 'приемная кампания 2025', 'вузы 2025'],
        admission: [
            'заявления', 'оригиналы', 'статус', 'аттестат', 'документы', 'подача документов',
            'шансы поступления', 'конкурсный список', 'квота', 'льготы', 'целевое обучение',
        ],
        process: [
            'симуляция', 'оттока', 'прогноз', 'вероятность', 'сценарии', 'моделирование',
            'статистика', 'дашборд', 'интерфейс', 'онлайн', 'сервис',
        ],
        help: ['справка', 'помощь', 'инструкция', 'руководство', 'FAQ', 'часто задаваемые вопросы'],
        direction: ['программа', 'направление', 'специальность', 'код направления', 'бакалавриат', 'магистратура'],
        universities: [
            // Major universities by full and short names
            'МФТИ', 'МГУ', 'СПбГУ', 'ВШЭ', 'ИТМО', 'ТГУ', 'ЮФУ', 'НГУ', 'ТПУ',
            'МГТУ им. Баумана', 'СПбПУ', 'УрФУ', 'МЭИ', 'РУДН', 'КФУ', 'ДВФУ', 'РАНХиГС',
            'СПбГЭТУ', 'РГГУ', 'МИЭТ', 'ПНИПУ', 'НИУ МИЭТ', 'СФУ', 'ТюмГУ', 'НИЯУ МИФИ',
            // University codes
            'mfti', 'mgu', 'spbgu', 'hse', 'itmo', 'tgu', 'yufu', 'ngu', 'tpu',
            'bauman', 'spbpu', 'ural_fed', 'mei', 'rudn', 'kfu', 'dvfu', 'ranepa',
        ],
    },
};

// Default icons configuration
const DEFAULT_ICONS = {
    icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
};

interface MetadataOptions {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    noIndex?: boolean;
}

/**
 * Generates comprehensive metadata for a page
 */
export function generateMetadata(options: MetadataOptions): Metadata {
    const { title, description, path, keywords = [], noIndex = false } = options;

    const url = `${SITE_CONFIG.domain}${path}`;
    // Use the properly located Open Graph image for social media previews
    const socialImagePath = '/og/home.png';
    const fullKeywords = [...SITE_CONFIG.keywords.base, ...keywords];

    return {
        title,
        description,
        keywords: fullKeywords,
        robots: noIndex ? 'noindex, nofollow' : 'index, follow',
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_CONFIG.name,
            type: 'website',
            images: [
                {
                    url: `${SITE_CONFIG.domain}${socialImagePath}`,
                    width: 1200,
                    height: 630,
                    alt: `${title} - ${SITE_CONFIG.name}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [
                {
                    url: `${SITE_CONFIG.domain}${socialImagePath}`,
                    alt: `${title} - ${SITE_CONFIG.name}`,
                },
            ],
        },
        icons: DEFAULT_ICONS,
    };
}

/**
 * Generates metadata for the home page
 */
export function generateHomeMetadata(): Metadata {
    return {
        ...generateMetadata({
            title: 'Анализатор поступления | analabit',
            description: 'Анализируйте свои шансы на поступление в российские вузы. Проверьте статус заявлений, проходные баллы и симуляции оттока оригиналов.',
            path: '/',
            keywords: [...SITE_CONFIG.keywords.admission, ...SITE_CONFIG.keywords.year, ...SITE_CONFIG.keywords.universities, ...SITE_CONFIG.keywords.process],
        }),
        manifest: '/site.webmanifest',
    };
}

/**
 * Generates metadata for the help page
 */
export function generateHelpMetadata(): Metadata {
    return generateMetadata({
        title: 'Справка | analabit',
        description: 'Подробная информация о том, как работает analabit - анализатор поступления в российские вузы с симуляциями оттока оригиналов.',
        path: '/help',
        keywords: [...SITE_CONFIG.keywords.help, ...SITE_CONFIG.keywords.process, ...SITE_CONFIG.keywords.year],
    });
}

/**
 * Generates metadata for direction/program pages
 */
export function generateDirectionMetadata(
    programName: string,
    universityName: string,
    directionId: string,
    options?: {
        programCode?: string;
        universityCode?: string;
        additionalKeywords?: string[];
    },
): Metadata {
    const { programCode, universityCode, additionalKeywords = [] } = options || {};
    const shortTitle = programName.length > 30 ? `${programName.substring(0, 27)}...` : programName;

    // Create comprehensive keywords from real data
    const directionKeywords = [
        ...SITE_CONFIG.keywords.direction,
        ...SITE_CONFIG.keywords.admission,
        ...SITE_CONFIG.keywords.year,
        programName.toLowerCase(),
        universityName.toLowerCase(),
        ...(programCode ? [programCode, programCode.toLowerCase()] : []),
        ...(universityCode ? [universityCode, universityCode.toLowerCase()] : []),
        ...additionalKeywords,
    ];

    return generateMetadata({
        title: `${shortTitle} | ${universityName} | analabit`,
        description: `Анализ поступления на "${programName}" в ${universityName}. Проходные баллы, конкурсные списки и симуляции оттока оригиналов на 2025 год.`,
        path: `/directions/${directionId}`,
        keywords: directionKeywords,
    });
}

/**
 * Generates metadata for popup/modal pages
 */
export function generatePopupMetadata(): Metadata {
    return generateMetadata({
        title: 'Статус заявлений | analabit',
        description: 'Проверьте статус ваших заявлений на поступление с анализом шансов по всем поданным направлениям.',
        path: '/popup',
        keywords: [...SITE_CONFIG.keywords.admission, ...SITE_CONFIG.keywords.process],
        noIndex: true, // Usually we don't want popups indexed
    });
}

export { SITE_CONFIG };
