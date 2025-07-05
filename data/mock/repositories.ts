// Mock Repository Implementations
// Deterministic fake data for development and testing

import type {
  IVarsityRepository,
  IHeadingRepository,
  IApplicationRepository,
  IResultsRepository,
} from '../../application/repositories';

import type {
  Varsity,
  Heading,
  Application,
  Results,
} from '../../domain/models';

// Mock data
const mockVarsities: Varsity[] = [
  { id: 1, code: 'hse', name: 'ВШЭ' },
  { id: 2, code: 'mgu', name: 'МГУ' },
  { id: 3, code: 'mfti', name: 'МФТИ' },
  { id: 4, code: 'spbgu', name: 'СПбГУ' },
  { id: 5, code: 'itmo', name: 'ИТМО' },
];

const mockHeadings: Heading[] = [
  {
    id: 42,
    code: '09.03.03',
    name: 'Прикладная математика и информатика',
    regularCapacity: 100,
    targetQuotaCapacity: 10,
    dedicatedQuotaCapacity: 5,
    specialQuotaCapacity: 3,
    varsityCode: 'hse',
  },
  {
    id: 43,
    code: '01.03.02',
    name: 'Прикладная математика и физика',
    regularCapacity: 80,
    targetQuotaCapacity: 8,
    dedicatedQuotaCapacity: 4,
    specialQuotaCapacity: 2,
    varsityCode: 'mfti',
  },
  {
    id: 44,
    code: '02.03.01',
    name: 'Математика и механика',
    regularCapacity: 60,
    targetQuotaCapacity: 6,
    dedicatedQuotaCapacity: 3,
    specialQuotaCapacity: 1,
    varsityCode: 'mgu',
  },
];

const mockApplications: Application[] = [
  {
    id: 123,
    studentId: 'ABC-123456',
    priority: 1,
    competitionType: 'Regular',
    ratingPlace: 47,
    score: 286,
    runId: 1,
    updatedAt: '2024-06-04T08:12:34Z',
    headingId: 42,
    originalSubmitted: true,
    originalQuit: false,
    passingNow: false,
  },
  {
    id: 124,
    studentId: 'ABC-123456',
    priority: 2,
    competitionType: 'Regular',
    ratingPlace: 58,
    score: 275,
    runId: 1,
    updatedAt: '2024-06-04T08:13:15Z',
    headingId: 43,
    originalSubmitted: true,
    originalQuit: false,
    passingNow: false,
  },
  {
    id: 125,
    studentId: 'DEF-789012',
    priority: 1,
    competitionType: 'Regular',
    ratingPlace: 32,
    score: 298,
    runId: 1,
    updatedAt: '2024-06-04T08:14:22Z',
    headingId: 42,
    originalSubmitted: true,
    originalQuit: false,
    passingNow: false,
  },
  {
    id: 126,
    studentId: 'GHI-345678',
    priority: 1,
    competitionType: 'BVI',
    ratingPlace: 1,
    score: 0,
    runId: 1,
    updatedAt: '2024-06-04T08:15:00Z',
    headingId: 42,
    originalSubmitted: true,
    originalQuit: false,
    passingNow: true,
  },
  {
    id: 127,
    studentId: 'JKL-901234',
    priority: 1,
    competitionType: 'TargetQuota',
    ratingPlace: 5,
    score: 285,
    runId: 1,
    updatedAt: '2024-06-04T08:16:00Z',
    headingId: 42,
    originalSubmitted: true,
    originalQuit: false,
    passingNow: true,
  },
  {
    id: 128,
    studentId: 'MNO-567890',
    priority: 1,
    competitionType: 'DedicatedQuota',
    ratingPlace: 3,
    score: 280,
    runId: 1,
    updatedAt: '2024-06-04T08:17:00Z',
    headingId: 42,
    originalSubmitted: true,
    originalQuit: false,
    passingNow: true,
  },
  {
    id: 129,
    studentId: 'PQR-123456',
    priority: 1,
    competitionType: 'SpecialQuota',
    ratingPlace: 2,
    score: 290,
    runId: 1,
    updatedAt: '2024-06-04T08:18:00Z',
    headingId: 42,
    originalSubmitted: true,
    originalQuit: false,
    passingNow: true,
  },
];

const mockResults: Results = {
  steps: {
    42: [33, 50, 66, 100],
    43: [33, 50, 66, 100],
    44: [33, 50, 66, 100],
  },
  primary: [
    {
      headingCode: '09.03.03',
      headingId: 42,
      passingScore: 286,
      lastAdmittedRatingPlace: 1,
      runId: 7,
    },
  ],
  drained: [
    // 09.03.03
    {
      headingCode: '09.03.03',
      headingId: 42,
      drainedPercent: 33,
      avgPassingScore: 300,
      minPassingScore: 260,
      maxPassingScore: 320,
      medPassingScore: 301,
      avgLastAdmittedRatingPlace: 45,
      minLastAdmittedRatingPlace: 30,
      maxLastAdmittedRatingPlace: 70,
      medLastAdmittedRatingPlace: 45,
      runId: 7,
    },
    {
      headingCode: '09.03.03',
      headingId: 42,
      drainedPercent: 50,
      avgPassingScore: 295,
      minPassingScore: 260,
      maxPassingScore: 310,
      medPassingScore: 297,
      avgLastAdmittedRatingPlace: 50,
      minLastAdmittedRatingPlace: 30,
      maxLastAdmittedRatingPlace: 70,
      medLastAdmittedRatingPlace: 48,
      runId: 7,
    },
    {
      headingCode: '09.03.03',
      headingId: 42,
      drainedPercent: 66,
      avgPassingScore: 290,
      minPassingScore: 250,
      maxPassingScore: 305,
      medPassingScore: 292,
      avgLastAdmittedRatingPlace: 55,
      minLastAdmittedRatingPlace: 35,
      maxLastAdmittedRatingPlace: 75,
      medLastAdmittedRatingPlace: 53,
      runId: 7,
    },
    {
      headingCode: '09.03.03',
      headingId: 42,
      drainedPercent: 100,
      avgPassingScore: 285,
      minPassingScore: 240,
      maxPassingScore: 300,
      medPassingScore: 285,
      avgLastAdmittedRatingPlace: 60,
      minLastAdmittedRatingPlace: 40,
      maxLastAdmittedRatingPlace: 80,
      medLastAdmittedRatingPlace: 58,
      runId: 7,
    },

    // 01.03.02
    {
      headingCode: '01.03.02',
      headingId: 43,
      drainedPercent: 33,
      avgPassingScore: 310,
      minPassingScore: 270,
      maxPassingScore: 330,
      medPassingScore: 312,
      avgLastAdmittedRatingPlace: 40,
      minLastAdmittedRatingPlace: 25,
      maxLastAdmittedRatingPlace: 65,
      medLastAdmittedRatingPlace: 42,
      runId: 7,
    },
    {
      headingCode: '01.03.02',
      headingId: 43,
      drainedPercent: 50,
      avgPassingScore: 305,
      minPassingScore: 265,
      maxPassingScore: 325,
      medPassingScore: 307,
      avgLastAdmittedRatingPlace: 45,
      minLastAdmittedRatingPlace: 30,
      maxLastAdmittedRatingPlace: 70,
      medLastAdmittedRatingPlace: 47,
      runId: 7,
    },
    {
      headingCode: '01.03.02',
      headingId: 43,
      drainedPercent: 66,
      avgPassingScore: 300,
      minPassingScore: 260,
      maxPassingScore: 320,
      medPassingScore: 302,
      avgLastAdmittedRatingPlace: 50,
      minLastAdmittedRatingPlace: 35,
      maxLastAdmittedRatingPlace: 75,
      medLastAdmittedRatingPlace: 52,
      runId: 7,
    },
    {
      headingCode: '01.03.02',
      headingId: 43,
      drainedPercent: 100,
      avgPassingScore: 295,
      minPassingScore: 250,
      maxPassingScore: 315,
      medPassingScore: 297,
      avgLastAdmittedRatingPlace: 55,
      minLastAdmittedRatingPlace: 40,
      maxLastAdmittedRatingPlace: 80,
      medLastAdmittedRatingPlace: 57,
      runId: 7,
    },

    // 02.03.01
    {
      headingCode: '02.03.01',
      headingId: 44,
      drainedPercent: 33,
      avgPassingScore: 280,
      minPassingScore: 240,
      maxPassingScore: 300,
      medPassingScore: 282,
      avgLastAdmittedRatingPlace: 50,
      minLastAdmittedRatingPlace: 35,
      maxLastAdmittedRatingPlace: 75,
      medLastAdmittedRatingPlace: 52,
      runId: 7,
    },
    {
      headingCode: '02.03.01',
      headingId: 44,
      drainedPercent: 50,
      avgPassingScore: 275,
      minPassingScore: 235,
      maxPassingScore: 295,
      medPassingScore: 277,
      avgLastAdmittedRatingPlace: 55,
      minLastAdmittedRatingPlace: 40,
      maxLastAdmittedRatingPlace: 80,
      medLastAdmittedRatingPlace: 57,
      runId: 7,
    },
    {
      headingCode: '02.03.01',
      headingId: 44,
      drainedPercent: 66,
      avgPassingScore: 270,
      minPassingScore: 230,
      maxPassingScore: 290,
      medPassingScore: 272,
      avgLastAdmittedRatingPlace: 60,
      minLastAdmittedRatingPlace: 45,
      maxLastAdmittedRatingPlace: 85,
      medLastAdmittedRatingPlace: 62,
      runId: 7,
    },
    {
      headingCode: '02.03.01',
      headingId: 44,
      drainedPercent: 100,
      avgPassingScore: 265,
      minPassingScore: 225,
      maxPassingScore: 285,
      medPassingScore: 267,
      avgLastAdmittedRatingPlace: 65,
      minLastAdmittedRatingPlace: 50,
      maxLastAdmittedRatingPlace: 90,
      medLastAdmittedRatingPlace: 67,
      runId: 7,
    },
  ],
};

// Helper function to simulate network delay
async function simulateDelay(minMs: number = 100, maxMs: number = 300): Promise<void> {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export class VarsityRepositoryMock implements IVarsityRepository {
  async getVarsities(limit?: number, offset?: number): Promise<Varsity[]> {
    await simulateDelay();
    
    let result = [...mockVarsities];
    
    if (offset !== undefined) {
      result = result.slice(offset);
    }
    
    if (limit !== undefined) {
      result = result.slice(0, limit);
    }
    
    return result;
  }

  async getVarsityByCode(code: string): Promise<Varsity | null> {
    await simulateDelay();
    return mockVarsities.find(v => v.code === code) || null;
  }
}

export class HeadingRepositoryMock implements IHeadingRepository {
  async getHeadings(options?: {
    limit?: number;
    offset?: number;
    varsityCode?: string;
  }): Promise<Heading[]> {
    await simulateDelay();
    
    let result = [...mockHeadings];
    
    if (options?.varsityCode) {
      result = result.filter(h => h.varsityCode === options.varsityCode);
    }
    
    if (options?.offset !== undefined) {
      result = result.slice(options.offset);
    }
    
    if (options?.limit !== undefined) {
      result = result.slice(0, options.limit);
    }
    
    return result;
  }

  async getHeadingById(id: number): Promise<Heading | null> {
    await simulateDelay();
    return mockHeadings.find(h => h.id === id) || null;
  }
}

export class ApplicationRepositoryMock implements IApplicationRepository {
  async getApplications(options?: {
    limit?: number;
    offset?: number;
    studentId?: string;
    varsityCode?: string;
    headingId?: number;
  }): Promise<Application[]> {
    await simulateDelay();
    
    let result = [...mockApplications];
    
    if (options?.studentId) {
      result = result.filter(a => a.studentId === options.studentId);
    }
    
    if (options?.headingId !== undefined) {
      result = result.filter(a => a.headingId === options.headingId);
    }
    
    if (options?.varsityCode) {
      // Need to join with headings to filter by varsity
      const headingsForVarsity = mockHeadings.filter(h => h.varsityCode === options.varsityCode);
      const headingIds = headingsForVarsity.map(h => h.id);
      result = result.filter(a => headingIds.includes(a.headingId));
    }
    
    if (options?.offset !== undefined) {
      result = result.slice(options.offset);
    }
    
    if (options?.limit !== undefined) {
      result = result.slice(0, options.limit);
    }
    
    return result;
  }

  async getStudentApplications(studentId: string): Promise<Application[]> {
    await simulateDelay();
    return mockApplications.filter(a => a.studentId === studentId);
  }
}

export class ResultsRepositoryMock implements IResultsRepository {
  async getResults(): Promise<Results> {
    await simulateDelay();
    // For mock, return the same data regardless of options
    return { ...mockResults };
  }
}