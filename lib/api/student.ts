// Student Admission API Service
// Fetches and processes student admission data from the live API

import type { IApplicationRepository, IHeadingRepository, IResultsRepository } from '../../application/repositories';
import type { Application, Heading } from '../../domain/models';

// Types for the popup data structure (matching existing mock data format)
export interface ProgramRow {
  priority: number;
  name: string;
  score: number;
  rank: number;
  delta?: string | null;
}

export interface UniversitySection {
  university: string;
  code: string;
  programs: ProgramRow[];
  highlightPriority: number;
}

export interface AdmissionData {
  passingSection: UniversitySection;
  secondarySections: UniversitySection[];
  originalKnown: boolean;
  probabilityTabs: string[];
}

export interface StudentNotFoundError extends Error {
  type: 'NOT_FOUND';
}

export interface StudentDataError extends Error {
  type: 'DATA_ERROR';
}

/**
 * Fetches and processes student admission data from the API
 * @param studentId - The student ID to fetch data for
 * @param applicationRepo - Application repository instance
 * @param headingRepo - Heading repository instance
 * @param resultsRepo - Results repository instance
 * @returns Promise<AdmissionData> - Processed admission data for the popup
 * @throws StudentNotFoundError if student ID not found
 * @throws StudentDataError for other data-related errors
 */
export async function fetchStudentAdmissionData(
  studentId: string,
  applicationRepo: IApplicationRepository,
  headingRepo: IHeadingRepository,
  resultsRepo: IResultsRepository,
): Promise<AdmissionData> {
  try {
    // Step 1: Fetch student applications using the /applications endpoint
    const applications = await applicationRepo.getStudentApplications(studentId);

    if (applications.length === 0) {
      const error = new Error(`Student with ID "${studentId}" not found`) as StudentNotFoundError;
      error.type = 'NOT_FOUND';
      throw error;
    }

    // Step 2: Get unique heading IDs and fetch heading details
    const uniqueHeadingIds = [...new Set(applications.map(app => app.headingId))];

    // Filter out any undefined/null heading IDs
    const validHeadingIds = uniqueHeadingIds.filter(id => id != null);

    if (validHeadingIds.length === 0) {
      const error = new Error('No valid heading IDs found in applications') as StudentDataError;
      error.type = 'DATA_ERROR';
      throw error;
    }

    const headingDetailsMap = new Map<number, Heading>();

    // Fetch all heading details in parallel
    const headingPromises = validHeadingIds.map(async (headingId) => {
      try {
        const heading = await headingRepo.getHeadingById(headingId);
        if (heading) {
          headingDetailsMap.set(headingId, heading);
        }
      } catch (error) {
        console.warn(`Failed to fetch heading ${headingId}:`, error);
        // Continue processing other headings even if one fails
      }
    });

    await Promise.all(headingPromises);

    // Step 3: Group applications by university (varsity code)
    const universitySections = new Map<string, {
      applications: Application[];
      universityName: string;
      universityCode: string;
    }>();

    applications.forEach(app => {
      // Skip applications with invalid heading IDs
      if (app.headingId == null) {
        console.warn(`Application ${app.id} has invalid headingId: ${app.headingId}`);
        return;
      }

      const heading = headingDetailsMap.get(app.headingId);
      if (!heading) {
        console.warn(`Heading not found for application ${app.id}, headingId: ${app.headingId}`);
        return; // Skip this application
      }

      const varsityCode = heading.varsityCode;
      if (!varsityCode) {
        console.warn(`Heading ${heading.id} has no varsity code`);
        return; // Skip applications with invalid varsity codes
      }

      if (!universitySections.has(varsityCode)) {
        universitySections.set(varsityCode, {
          applications: [],
          universityName: '', // Will be set when we process the first application
          universityCode: varsityCode,
        });
      }

      const section = universitySections.get(varsityCode)!;
      section.applications.push(app);

      // Set university name from the varsity data if not already set
      if (!section.universityName) {
        // Prefer varsity name if available, otherwise use varsity code
        section.universityName = heading.varsityName || heading.varsityCode || varsityCode;
      }
    });

    // Step 4: Transform into popup format
    const sections: UniversitySection[] = [];
    let passingSection: UniversitySection | null = null;

    universitySections.forEach(({ applications: sectionApps, universityName, universityCode }) => {
      // Skip sections with invalid data
      if (!universityCode || !universityName || sectionApps.length === 0) {
        console.warn(`Skipping invalid university section: code=${universityCode}, name=${universityName}, apps=${sectionApps.length}`);
        return;
      }

      // Sort applications by priority
      const sortedApps = sectionApps.sort((a, b) => a.priority - b.priority);

      // Convert to ProgramRow format
      const programs: ProgramRow[] = sortedApps.map(app => {
        const heading = headingDetailsMap.get(app.headingId)!;
        return {
          priority: app.priority,
          name: heading.name,
          score: app.score,
          rank: app.ratingPlace,
          delta: null, // We don't have delta information from the API
        };
      });

      // Find the highlight priority (first passing application or first application)
      const passingApp = sortedApps.find(app => app.passingNow);
      const highlightPriority = passingApp ? passingApp.priority : 1;

      const section: UniversitySection = {
        university: universityName,
        code: universityCode,
        programs,
        highlightPriority,
      };

      sections.push(section);

      // Determine if this is the passing section
      if (sortedApps.some(app => app.passingNow)) {
        passingSection = section;
      }
    });

    // Step 5: Separate passing and secondary sections
    const secondarySections = sections.filter(section => section !== passingSection);

    // If no passing section found, use the first section as passing section
    if (!passingSection && sections.length > 0) {
      passingSection = sections[0];
      secondarySections.splice(secondarySections.indexOf(passingSection), 1);
    }

    // Handle case where no sections were created (shouldn't happen if we have applications)
    if (!passingSection) {
      const error = new Error('No valid applications found for student') as StudentDataError;
      error.type = 'DATA_ERROR';
      throw error;
    }

    // Step 6: Fetch probability steps from the results API
    // Get any heading ID from the student's applications to fetch the available steps
    // (All headings of a single university have the same available drain steps)
    let probabilityTabs: string[] = ['–', '33%', '50%', '66%', '100%']; // Default fallback

    try {
      const anyHeadingId = validHeadingIds[0]; // Use the first valid heading ID
      if (anyHeadingId) {
        const results = await resultsRepo.getResults({
          headingIds: String(anyHeadingId),
          drained: 'all', // Get all available steps
        });

        // Extract steps for this heading
        const stepsForHeading = results.steps[anyHeadingId];
        if (stepsForHeading && stepsForHeading.length > 0) {
          // Sort steps and format them with % symbol
          const sortedSteps = [...new Set(stepsForHeading)].sort((a, b) => a - b);
          probabilityTabs = ['–', ...sortedSteps.map(step => `${step}%`)];
        }
      }
    } catch (error) {
      // If fetching steps fails, use default fallback values
      console.warn('Failed to fetch probability steps, using defaults:', error);
    }

    // Step 7: Determine if original documents status is known
    const originalKnown = applications.some(app => app.originalSubmitted || app.originalQuit);

    return {
      passingSection,
      secondarySections,
      originalKnown,
      probabilityTabs,
    };

  } catch (error) {
    if ((error as StudentNotFoundError | StudentDataError).type === 'NOT_FOUND' || (error as StudentNotFoundError | StudentDataError).type === 'DATA_ERROR') {
      throw error; // Re-throw our custom errors
    }

    // Handle network errors or other unexpected errors
    console.error('Error fetching student admission data:', error);
    const dataError = new Error('Failed to fetch student admission data') as StudentDataError;
    dataError.type = 'DATA_ERROR';
    throw dataError;
  }
}
