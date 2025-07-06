import React from 'react';
import { AdmissionStatusPopup } from '../components/admission-popup';
import type { UniversitySection } from '../components/admission-popup/types';

const passingSection: UniversitySection = {
  university: 'СПбГУ',
  code: 'spbgu',
  highlightPriority: 1,
  programs: [
    { priority: 1, name: 'Информатика', score: 271, rank: 49, delta: '+10' },
    { priority: 2, name: 'Компьютерные науки', score: 269, rank: 65, delta: '+14' },
    { priority: 3, name: 'Приборостроение и оптика', score: 296, rank: 36 },
  ],
};

const PopupDemoPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
      <AdmissionStatusPopup
        studentId="10234857689"
        mainStatus="Оригинал подан в СПбГУ"
        passingSection={passingSection}
        probabilityTabs={['–', '25%', '33%', '50%', '75%', '100%']}
      />
    </div>
  );
};

export default PopupDemoPage; 