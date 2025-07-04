// Domain Service - Calculate derived properties for Applications
// Pure business logic with no framework dependencies

import type { Application, Results, PrimaryResult } from '../models';

/**
 * Calculate if an application passes based on primary results
 * @param application The application to check
 * @param primaryResults The list of primary (admitted) results
 * @returns true if the student is admitted for this application
 */
export function calculatePasses(
  application: Application,
  primaryResults: PrimaryResult[],
): boolean {
  const result = primaryResults.find(r => r.headingId === application.headingId);
  if (!result) return false;
  return application.ratingPlace <= result.lastAdmittedRatingPlace;
}

/**
 * Calculate the number of other universities a student applied to
 * @param studentId The student ID
 * @param allApplications All applications across all students
 * @param currentHeadingId The current heading being examined
 * @returns number of unique universities the student applied to (excluding current)
 */
export function calculateOtherUniversities(
  studentId: string,
  allApplications: Application[],
  currentHeadingId: number,
  headings: { id: number; varsityCode: string }[],
): number {
  // Get all applications for this student
  const studentApplications = allApplications.filter(
    app => app.studentId === studentId,
  );

  // Get unique varsity codes from the student's applications
  const varsityCodes = new Set<string>();
  
  studentApplications.forEach(app => {
    const heading = headings.find(h => h.id === app.headingId);
    if (heading && app.headingId !== currentHeadingId) {
      varsityCodes.add(heading.varsityCode);
    }
  });

  return varsityCodes.size;
}

/**
 * Enrich applications with derived properties
 * @param applications List of applications to enrich
 * @param results Results data containing primary admissions
 * @param headings Heading data for varsity mapping
 * @returns Applications with passes and otherUnlv properties calculated
 */
export function enrichApplications(
  applications: Application[],
  results: Results,
  headings: { id: number; code: string; varsityCode: string }[],
): Application[] {
  return applications.map(application => {
    const resultForHeading = results.primary.find(
      r => r.headingId === application.headingId,
    );
    const passes = resultForHeading
      ? application.ratingPlace <= resultForHeading.lastAdmittedRatingPlace
      : false;

    const otherUnlv = calculateOtherUniversities(
      application.studentId,
      applications,
      application.headingId,
      headings,
    );

    return {
      ...application,
      passes,
      otherUnlv,
    };
  });
} 