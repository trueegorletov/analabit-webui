import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Application, OrigCeltStatus, AdmissionDecision } from '@/domain/application';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a batch of random mock applications for testing purposes
 * Useful for demos and testing with varied, realistic data
 * 
 * @param count Number of applications to generate
 * @param startRank Starting rank number (default: 1)
 * @param baseScore Base score for variation (default: 280)
 * @param seed Optional seed for deterministic generation
 * @returns Array of mock Application objects
 */
export function generateRandomApplications(
  count: number,
  startRank: number = 1,
  baseScore: number = 280,
  seed?: number,
): Application[] {
  // Simple seeded random if seed provided (for deterministic testing)
  let currentSeed = seed || Math.floor(Math.random() * 1000000);
  const seededRandom = seed ? () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  } : Math.random;

  const applications: Application[] = [];
  
  for (let i = 0; i < count; i++) {
    const rank = startRank + i;
    
    // Realistic distribution of OrigCeltStatus
    const statusRand = seededRandom();
    let origCelt: OrigCeltStatus;
    if (statusRand < 0.08) {
      origCelt = OrigCeltStatus.OTHER; // 8% - Left competition
    } else if (statusRand < 0.25) {
      origCelt = OrigCeltStatus.UNKNOWN; // 17% - No data
    } else if (statusRand < 0.55) {
      origCelt = OrigCeltStatus.NO; // 30% - Competing elsewhere
    } else {
      origCelt = OrigCeltStatus.YES; // 45% - Original submitted
    }

    // Score decreases with rank but has some variation
    const scoreVariation = Math.floor(seededRandom() * 40) - 20; // ±20 points
    const score = Math.max(180, baseScore - Math.floor(rank / 5) + scoreVariation);

    // Priority distribution (more realistic)
    const priority = Math.floor(seededRandom() * 30) + 20; // 20-49

    // Other universities (some students have applications elsewhere)
    let otherUnlv: number | 'check' | undefined;
    const otherRand = seededRandom();
    if (otherRand < 0.3) {
      otherUnlv = undefined; // 30% no other applications
    } else if (otherRand < 0.4) {
      otherUnlv = 'check'; // 10% need to check
    } else {
      otherUnlv = Math.floor(seededRandom() * 8); // 60% have 0-7 other applications
    }

    // Admission decision distribution
    let admission: AdmissionDecision;
    const admissionRand = seededRandom();
    if (admissionRand < 0.15) {
      admission = AdmissionDecision.NOT_COMPETING_TEXT; // 15%
    } else if (admissionRand < 0.5) {
      admission = AdmissionDecision.ADMITTED_TEXT; // 35%
    } else {
      admission = AdmissionDecision.ADMITTED_GREEN_CHECK; // 50%
    }

    // Some students pass to the direction (higher chance for better ranks)
    const passes = rank <= 150 && seededRandom() < (0.3 - (rank / 500));

    // Generate realistic student ID
    const studentId = String(10000000000 + Math.floor(seededRandom() * 9999999999));

    applications.push({
      rank,
      studentId,
      priority,
      score,
      origCelt,
      otherUnlv,
      admission,
      passes,
    });
  }

  return applications;
}
