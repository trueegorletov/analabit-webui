import { Application, OrigCeltStatus, AdmissionDecision, DrainedResultItem } from './types'

export const applicationsData: Application[] = [
  { rank: 102, studentId: '14023456789', priority: 23, score: 293, origCelt: OrigCeltStatus.YES, otherUnlv: 'check', admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 103, studentId: '19325868878', priority: 24, score: 293, origCelt: OrigCeltStatus.NO, otherUnlv: 3, admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 120, studentId: '07885312033', priority: 24, score: 282, origCelt: OrigCeltStatus.YES, otherUnlv: 'check', admission: AdmissionDecision.ADMITTED_TEXT },
  { rank: 137, studentId: '05833459218', priority: 24, score: 282, origCelt: OrigCeltStatus.YES, otherUnlv: 1, admission: AdmissionDecision.ADMITTED_TEXT, isCurrentUser: true },
  { rank: 134, studentId: '09793918939', priority: 24, score: 182, origCelt: OrigCeltStatus.NO, otherUnlv: 'check', admission: AdmissionDecision.NOT_COMPETING_TEXT },
  // Added applications for scrollability
  { rank: 140, studentId: '11223344556', priority: 25, score: 281, origCelt: OrigCeltStatus.YES, otherUnlv: 'check', admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 141, studentId: '22334455667', priority: 22, score: 280, origCelt: OrigCeltStatus.NO, otherUnlv: 2, admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 145, studentId: '33445566778', priority: 26, score: 279, origCelt: OrigCeltStatus.YES, admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 150, studentId: '44556677889', priority: 23, score: 275, origCelt: OrigCeltStatus.YES, otherUnlv: 'check', admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 152, studentId: '55667788990', priority: 24, score: 274, origCelt: OrigCeltStatus.NO, admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 158, studentId: '66778899001', priority: 27, score: 270, origCelt: OrigCeltStatus.YES, otherUnlv: 1, admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 160, studentId: '77889900112', priority: 25, score: 268, origCelt: OrigCeltStatus.YES, otherUnlv: 'check', admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 163, studentId: '88990011223', priority: 24, score: 265, origCelt: OrigCeltStatus.NO, otherUnlv: 4, admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 167, studentId: '99001122334', priority: 22, score: 260, origCelt: OrigCeltStatus.YES, admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 170, studentId: '00112233445', priority: 26, score: 255, origCelt: OrigCeltStatus.YES, otherUnlv: 'check', admission: AdmissionDecision.ADMITTED_GREEN_CHECK },
  { rank: 175, studentId: '12300045678', priority: 23, score: 250, origCelt: OrigCeltStatus.NO, admission: AdmissionDecision.NOT_COMPETING_TEXT },
  { rank: 180, studentId: '45600078901', priority: 24, score: 245, origCelt: OrigCeltStatus.YES, otherUnlv: 1, admission: AdmissionDecision.ADMITTED_GREEN_CHECK }
]

export const drainedResultsData: DrainedResultItem[] = [
  { label: 'Passing score', '33%': '284-58', '50%': '284-48', '66%': '255-49', '100%': '255-62' },
  { label: 'Rank', '33%': '262-68', '50%': '262-56', '66%': '264-65', '100%': '265-70' }
] 