// Local types for mock data (previously imported from ./types)
interface University {
  id: number;
  code: string;
  name: string;
}

interface Direction {
  id: string;
  name: string;
  score: number;
  rank: number | string;
  range: string;
  universityCode: string;
}

interface UniversitiesApiResponse {
  universities: University[];
}

interface DirectionsApiResponse {
  universityCode: string;
  directions: Direction[];
}

export const mockUniversities: University[] = [
  { id: 1, code: 'mfti', name: 'МФТИ' },
  { id: 2, code: 'mgu', name: 'МГУ' },
  { id: 3, code: 'spbgu', name: 'СПбГУ' },
  { id: 4, code: 'hse_msk', name: 'ВШЭ (Москва)' },
  { id: 5, code: 'itmo', name: 'ИТМО' },
  { id: 6, code: 'tgu', name: 'ТГУ' },
  { id: 7, code: 'yufu', name: 'ЮФУ' },
  { id: 8, code: 'ngu', name: 'НГУ' },
  { id: 9, code: 'hse_spb', name: 'ВШЭ (СПб)' },
  { id: 10, code: 'bauman', name: 'МГТУ им. Баумана' },
  { id: 11, code: 'spbpu', name: 'СПбПУ' },
  { id: 12, code: 'ural_fed', name: 'УрФУ' },
];

export const mockDirections: Record<string, Direction[]> = {
  'mfti': [
    { id: 'dir-mfti-001', name: 'Математика', score: 283, rank: 12, range: '283..271', universityCode: 'mfti' },
    { id: 'dir-mfti-002', name: 'Прикладная математика и информатика', score: 272, rank: 73, range: '272..259', universityCode: 'mfti' },
    { id: 'dir-mfti-003', name: 'Физика', score: 275, rank: 23, range: '275..260', universityCode: 'mfti' },
    { id: 'dir-mfti-004', name: 'Системный анализ и управление', score: 268, rank: 45, range: '268..255', universityCode: 'mfti' },
    { id: 'dir-mfti-005', name: 'Прикладные математика и физика', score: 285, rank: 8, range: '285..275', universityCode: 'mfti' },
  ],
  'mgu': [
    { id: 'dir-mgu-001', name: 'История', score: 265, rank: '#54', range: '265..250', universityCode: 'mgu' },
    { id: 'dir-mgu-002', name: 'Филология', score: 280, rank: '#60', range: '280..270', universityCode: 'mgu' },
    { id: 'dir-mgu-003', name: 'Журналистика', score: 275, rank: '#35', range: '275..265', universityCode: 'mgu' },
    { id: 'dir-mgu-004', name: 'Психология', score: 270, rank: '#42', range: '270..260', universityCode: 'mgu' },
    { id: 'dir-mgu-005', name: 'Математика', score: 285, rank: '#15', range: '285..275', universityCode: 'mgu' },
  ],
  'spbgu': [
    { id: 'dir-spbgu-001', name: 'Философия', score: 260, rank: '#78', range: '260..245', universityCode: 'spbgu' },
    { id: 'dir-spbgu-002', name: 'Биология', score: 275, rank: '#32', range: '275..265', universityCode: 'spbgu' },
    { id: 'dir-spbgu-003', name: 'Химия', score: 270, rank: '#48', range: '270..255', universityCode: 'spbgu' },
    { id: 'dir-spbgu-004', name: 'Физика', score: 280, rank: '#25', range: '280..270', universityCode: 'spbgu' },
  ],
  'hse_msk': [
    { id: 'dir-hse-msk-001', name: 'Экономика', score: 275, rank: '#28', range: '275..265', universityCode: 'hse_msk' },
    { id: 'dir-hse-msk-002', name: 'Менеджмент', score: 270, rank: '#45', range: '270..260', universityCode: 'hse_msk' },
    { id: 'dir-hse-msk-003', name: 'Программная инженерия', score: 285, rank: '#12', range: '285..275', universityCode: 'hse_msk' },
    { id: 'dir-hse-msk-004', name: 'Бизнес-информатика', score: 272, rank: '#38', range: '272..262', universityCode: 'hse_msk' },
    { id: 'dir-hse-msk-005', name: 'Государственное и муниципальное управление', score: 268, rank: '#52', range: '268..258', universityCode: 'hse_msk' },
  ],
  'itmo': [
    { id: 'dir-itmo-001', name: 'Информатика и вычислительная техника', score: 280, rank: '#20', range: '280..270', universityCode: 'itmo' },
    { id: 'dir-itmo-002', name: 'Прикладная математика и информатика', score: 275, rank: '#30', range: '275..265', universityCode: 'itmo' },
    { id: 'dir-itmo-003', name: 'Программная инженерия', score: 285, rank: '#10', range: '285..275', universityCode: 'itmo' },
    { id: 'dir-itmo-004', name: 'Информационные системы и технологии', score: 270, rank: '#40', range: '270..260', universityCode: 'itmo' },
  ],
  'tgu': [
    { id: 'dir-tgu-001', name: 'Филология', score: 255, rank: '#85', range: '255..240', universityCode: 'tgu' },
    { id: 'dir-tgu-002', name: 'История', score: 250, rank: '#95', range: '250..235', universityCode: 'tgu' },
    { id: 'dir-tgu-003', name: 'Биология', score: 265, rank: '#65', range: '265..250', universityCode: 'tgu' },
  ],
  'yufu': [
    { id: 'dir-yufu-001', name: 'Инженерные системы и сооружения', score: 245, rank: '#105', range: '245..230', universityCode: 'yufu' },
    { id: 'dir-yufu-002', name: 'Экономика', score: 250, rank: '#98', range: '250..235', universityCode: 'yufu' },
    { id: 'dir-yufu-003', name: 'Юриспруденция', score: 255, rank: '#88', range: '255..240', universityCode: 'yufu' },
  ],
  'ngu': [
    { id: 'dir-ngu-001', name: 'Математика', score: 270, rank: '#45', range: '270..255', universityCode: 'ngu' },
    { id: 'dir-ngu-002', name: 'Физика', score: 275, rank: '#35', range: '275..260', universityCode: 'ngu' },
    { id: 'dir-ngu-003', name: 'Химия', score: 265, rank: '#58', range: '265..250', universityCode: 'ngu' },
    { id: 'dir-ngu-004', name: 'Биология', score: 260, rank: '#68', range: '260..245', universityCode: 'ngu' },
  ],
  'hse_spb': [
    { id: 'dir-hse-spb-001', name: 'Экономика', score: 270, rank: '#48', range: '270..260', universityCode: 'hse_spb' },
    { id: 'dir-hse-spb-002', name: 'Менеджмент', score: 265, rank: '#55', range: '265..255', universityCode: 'hse_spb' },
    { id: 'dir-hse-spb-003', name: 'Социология', score: 260, rank: '#72', range: '260..250', universityCode: 'hse_spb' },
  ],
  'bauman': [
    { id: 'dir-bauman-001', name: 'Машиностроение', score: 275, rank: '#32', range: '275..265', universityCode: 'bauman' },
    { id: 'dir-bauman-002', name: 'Ракетостроение', score: 280, rank: '#22', range: '280..270', universityCode: 'bauman' },
    { id: 'dir-bauman-003', name: 'Информатика и управление', score: 270, rank: '#44', range: '270..260', universityCode: 'bauman' },
    { id: 'dir-bauman-004', name: 'Энергомашиностроение', score: 265, rank: '#58', range: '265..255', universityCode: 'bauman' },
  ],
  'spbpu': [
    { id: 'dir-spbpu-001', name: 'Строительство', score: 260, rank: '#75', range: '260..245', universityCode: 'spbpu' },
    { id: 'dir-spbpu-002', name: 'Энергетика', score: 265, rank: '#62', range: '265..250', universityCode: 'spbpu' },
    { id: 'dir-spbpu-003', name: 'Машиностроение', score: 270, rank: '#48', range: '270..255', universityCode: 'spbpu' },
  ],
  'ural_fed': [
    { id: 'dir-ural-fed-001', name: 'Металлургия', score: 255, rank: '#88', range: '255..240', universityCode: 'ural_fed' },
    { id: 'dir-ural-fed-002', name: 'Горное дело', score: 250, rank: '#98', range: '250..235', universityCode: 'ural_fed' },
    { id: 'dir-ural-fed-003', name: 'Химическая технология', score: 260, rank: '#75', range: '260..245', universityCode: 'ural_fed' },
  ],
};

export const getMockUniversitiesResponse = (): UniversitiesApiResponse => ({
  universities: mockUniversities,
});

export const getMockDirectionsResponse = (universityCode: string): DirectionsApiResponse => ({
  universityCode,
  directions: mockDirections[universityCode] || [],
});

export const simulateNetworkDelay = (minMs: number = 500, maxMs: number = 2000): Promise<void> => {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const simulateRandomFailure = (failureRate: number = 0.1): boolean => {
  return Math.random() < failureRate;
}; 