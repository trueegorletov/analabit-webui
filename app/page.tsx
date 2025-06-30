'use client';
import { useEffect, useMemo, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';
import AnimatedBlob from './components/AnimatedBlob';
import { type Palette } from './utils/glowHelpers';
import { useUniversityColors } from '../hooks/useUniversityColors';
import { useUniversitiesData } from '../hooks/useUniversitiesData';
import { UniversityBlock } from './components/UniversityBlock';
import { CriticalLoadingScreen, CriticalErrorScreen } from './components/LoadingComponents';
import { AdmissionStatusPopup } from './components/AdmissionStatusPopup';
import { mockUniversities, mockDirections } from '../lib/api/mockData';

// Dynamically import the 3D volumetric blob so it only executes on the client
const VolumetricBlob = dynamic(() => import('./components/VolumetricBlob'), {
  ssr: false,
});

function Animation({ loading, error }: { loading: boolean; error: boolean }) {
  const searchParams = useSearchParams();
  const showAnimatedBlob = searchParams.get('animation') === 'blob';

  // If the query param "animation=blob" is present, render the original 2D AnimatedBlob.
  // Otherwise, fall back to the new 3D VolumetricBlob.
  return showAnimatedBlob ? <AnimatedBlob /> : <VolumetricBlob loading={loading} error={error} />;
}

// ------------------ Mock admission generator ------------------
interface ProgramRow {
  priority: number;
  name: string;
  score: number;
  rank: number;
  delta?: string | null;
}

interface UniSection {
  university: string;
  code: string;
  programs: ProgramRow[];
  highlightPriority: number;
}

interface AdmissionMock {
  passingSection: UniSection;
  secondarySections: UniSection[];
  originalKnown: boolean;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function generateAdmissionData(): { passingSection: UniSection; secondarySections: UniSection[]; originalKnown: boolean } {
  const universitiesPool = [...mockUniversities];
  const uniCount = randomInt(2, 5);
  const selectedUnis: typeof mockUniversities = [];
  while (selectedUnis.length < uniCount && universitiesPool.length) {
    const idx = randomInt(0, universitiesPool.length - 1);
    selectedUnis.push(universitiesPool.splice(idx, 1)[0]);
  }

  const sections: UniSection[] = selectedUnis.map((uni) => {
    const dirPool = mockDirections[uni.code] || [];
    const dirCount = Math.min(randomInt(2, 10), dirPool.length > 0 ? dirPool.length : 10);
    const programs: ProgramRow[] = [];
    const usedNames = new Set<string>();
    while (programs.length < dirCount) {
      let dirName: string;
      if (dirPool.length) {
        const dir = pickRandom(dirPool);
        dirName = dir.name;
      } else {
        dirName = `Направление ${programs.length + 1}`;
      }
      if (usedNames.has(dirName)) continue;
      usedNames.add(dirName);
      const priority = programs.length + 1;
      programs.push({
        priority,
        name: dirName,
        score: randomInt(240, 300),
        rank: randomInt(1, 120),
      });
    }

    const highlightPriority = randomInt(1, programs.length);

    programs.forEach((p) => {
      if (p.priority < highlightPriority) {
        p.delta = '-' + randomInt(1, 99).toString();
      } else if (p.priority === highlightPriority) {
        const v = randomInt(0, 20);
        p.delta = v === 0 ? '0' : '+' + v.toString();
      } else {
        const sign = Math.random() < 0.5 ? '+' : '-';
        p.delta = sign + randomInt(1, 50).toString();
      }
    });

    return {
      university: uni.name,
      code: uni.code,
      programs,
      highlightPriority,
    };
  });

  const passingSection = sections[0];
  const secondarySections = sections.slice(1);
  const originalKnown = Math.random() < 0.8; // 80% we know
  return { passingSection, secondarySections, originalKnown };
}

export default function Home() {
  // Use the universities data hook
  const {
    universities,
    universitiesLoading,
    universitiesError,
    retryCount,
    directionsCache,
    fetchUniversityDirections,
    refreshUniversities,
    scrollToUniversity,
  } = useUniversitiesData();

  // Use the university colors system
  const { getUniversityColor } = useUniversityColors();
  
  // Create palettes mapping for universities using codes
  const universityPalettes = useMemo(() => {
    const mapping: { [key: string]: Palette } = {};
    universities.forEach((university) => {
      const color = getUniversityColor(university.code); // Use code for color mapping
      if (color) {
        mapping[university.code] = {
          grad: color.gradient,
          glow: color.glow,
        };
      } else {
        // Fallback palette
        mapping[university.code] = {
          grad: 'linear-gradient(120deg, rgba(255, 94, 98, 0.6), rgba(255, 153, 102, 0.6))',
          glow: 'rgba(255, 120, 99, 0.3)',
        };
      }
    });
    return mapping;
  }, [universities, getUniversityColor]);

  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  // Popup state handling
  const [studentIdInput, setStudentIdInput] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<AdmissionMock | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const ERROR_DURATION = 5211; // ms for blob
  const TOOLTIP_VISIBLE_DURATION = 5500; // ms for tooltip
  const [blobError, setBlobError] = useState(false);

  const handleCheckStatus = () => {
    if (!/^\d+$/.test(studentIdInput.trim())) {
      // Trigger input error UI
      setInputError(true);
      setShowTooltip(true);
      // Trigger blob error for same duration
      setBlobError(true);
      setTimeout(() => {
        setBlobError(false);
      }, ERROR_DURATION);
      // Hide tooltip after new duration
      setTimeout(() => setShowTooltip(false), TOOLTIP_VISIBLE_DURATION);
      return;
    }

    // Simulate network delay & loading effect
    setLoadingStatus(true);

    const delay = 3000 + Math.random() * 1000; // 3-4s artificial delay
    setTimeout(() => {
      const data = generateAdmissionData();
      setPopupData(data);
      setIsPopupOpen(true);
      setLoadingStatus(false);
      setInputError(false);
    }, delay);
  };

  const closePopup = () => setIsPopupOpen(false);

  // modified handleTagClick
  const handleTagClick = (universityCode: string) => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${universityCode}`);
    }
    const ok = scrollToUniversity(universityCode);
    if (!ok) {
      setPendingScroll(universityCode);
    }
  };

  useEffect(() => {
    if (!pendingScroll) return;
    const success = scrollToUniversity(pendingScroll);
    if (success) {
      setPendingScroll(null);
    }
  }, [pendingScroll, universities]);

  // Scroll to university block if URL already contains a hash (direct access)
  useEffect(() => {
    if (universities.length === 0) return;

    const handleHashChange = () => {
      const code = window.location.hash.replace('#', '');
      if (code) {
        scrollToUniversity(code);
      }
    };

    // On initial load
    handleHashChange();

    // Listen for subsequent hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [universities, scrollToUniversity]);

  // Handle tag animations and university block styling
  useEffect(() => {
    if (universities.length === 0) return;

    const tags = gsap.utils.toArray<HTMLElement>('.tag');
    tags.forEach((tag) => {
      const universityCode = tag.dataset.universityCode;
      const palette = universityCode && universityPalettes[universityCode]
        ? universityPalettes[universityCode]
        : { grad: 'linear-gradient(120deg, rgba(255, 94, 98, 0.6), rgba(255, 153, 102, 0.6))', glow: 'rgba(255, 120, 99, 0.3)' };

      gsap.set(tag, {
        background: palette.grad,
        backgroundSize: '200% 200%',
      });
      gsap.to(tag, {
        backgroundPosition: '100% 100%',
        duration: gsap.utils.random(10, 15),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(tag, {
        boxShadow: `0 0 18px 3px ${palette.glow}, 0 0 8px 1px rgba(255, 255, 255, 0.1)`,
        duration: gsap.utils.random(6, 10),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 2),
      });
    });

    // Apply gradients to university blocks
    const universityBlocks = gsap.utils.toArray<HTMLElement>('.university-block');
    universityBlocks.forEach((block) => {
      const universityCode = block.dataset.universityCode;
      const palette = universityCode && universityPalettes[universityCode]
        ? universityPalettes[universityCode]
        : { grad: 'linear-gradient(120deg, rgba(255, 94, 98, 0.6), rgba(255, 153, 102, 0.6))', glow: 'rgba(255, 120, 99, 0.3)' };

      gsap.set(block, {
        background: palette.grad,
        backgroundSize: '200% 200%',
      });
      gsap.to(block, {
        backgroundPosition: '100% 100%',
        duration: gsap.utils.random(15, 20),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Tag floating animations
    tags.forEach((tag, index) => {
      const amplitude = gsap.utils.random(3, 8);
      const duration = gsap.utils.random(4, 7);
      const delay = (index % 5) * 0.3;
      gsap.to(tag, {
        y: -amplitude,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay,
      });
    });

    // Simple hover scaling using GSAP
    const removeListeners: Array<() => void> = [];
    tags.forEach((tag) => {
      const onEnter = () =>
        gsap.to(tag, { scale: 1.08, duration: 0.2, ease: 'power2.out' });
      const onLeave = () =>
        gsap.to(tag, { scale: 1, duration: 0.2, ease: 'power2.out' });
      tag.addEventListener('mouseenter', onEnter);
      tag.addEventListener('mouseleave', onLeave);
      removeListeners.push(() => {
        tag.removeEventListener('mouseenter', onEnter);
        tag.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => {
      removeListeners.forEach((fn) => fn());
    };
  }, [universities, universityPalettes]);

  // Debug: Log universities data
  useEffect(() => {
    if (universities.length > 0) {
      console.log('[DEBUG] Universities loaded:', universities.map(u => ({ name: u.name, code: u.code })));
    }
  }, [universities]);

  // Debug: Add global click listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      console.log('[DEBUG] Global click detected on:', target.tagName, target.className);
      if (target.classList.contains('tag')) {
        console.log('[DEBUG] Tag clicked globally! Code:', target.dataset.universityCode);
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isPopupOpen) {
      // Save current scroll position and lock the body
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Clean up in case component unmounts while popup open
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isPopupOpen]);

  // Show critical loading screen while universities are loading
  if (universitiesLoading) {
    return (
      <CriticalLoadingScreen 
        message="Загружаем университеты..."
        subMessage={retryCount > 1 ? `Попытка ${retryCount}` : 'Подождите, это займет несколько секунд'}
      />
    );
  }

  // Show critical error screen if universities failed to load
  if (universitiesError) {
    return (
      <CriticalErrorScreen 
        error={universitiesError}
        onRetry={refreshUniversities}
        retryCount={retryCount}
      />
    );
  }

  // Don't show main content if no universities loaded
  if (universities.length === 0) {
    return (
      <CriticalErrorScreen 
        error="Университеты не найдены"
        onRetry={refreshUniversities}
        retryCount={retryCount}
      />
    );
  }

  const renderUniversityBlocks = () => {
    return universities.map((university) => (
      <UniversityBlock
        key={university.code}
        university={university}
        palette={universityPalettes[university.code]}
        directionsState={directionsCache[university.code]}
        onFetchDirections={fetchUniversityDirections}
      />
    ));
  };

  return (
    <main>
      {/* Hero section with glass container styling */}
      <div className="dashboard-container">
        {/* Dynamic tag buttons based on loaded universities */}
        <div className="tags">
          {universities.map((university) => (
            <div 
              key={university.code} 
              className="tag"
              data-university-code={university.code}
              onClick={() => handleTagClick(university.code)}
            >
              {university.name}
            </div>
          ))}
        </div>
        <div className="wave-container">
          <Suspense fallback={<div>Loading...</div>}>
            <Animation loading={loadingStatus} error={blobError} />
          </Suspense>
        </div>
        <div className="title">Проверка статуса поступления</div>
        <div className="desc">
          Введите ID абитуриента, чтобы узнать, в какие университеты он зачислен
        </div>
        <div className="input-group flex gap-4 items-start">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="ID студента"
              value={studentIdInput}
              onChange={(e) => {
                setStudentIdInput(e.target.value);
                if (inputError) setInputError(false);
              }}
              className={`w-full bg-black/30 text-white rounded-lg px-4 py-3 placeholder-gray-500 transition-all duration-300 ease-in-out focus:outline-none ${
                inputError
                  ? 'ring-2 ring-red-500/80 focus:ring-red-500/80'
                  : 'focus:ring-2 focus:ring-violet-500/80'
              }`}
            />
            <div className="absolute -top-12 inset-x-0 flex justify-center pointer-events-none transition-opacity duration-700 ease-in-out" style={{opacity: showTooltip ? 1 : 0}}>
              <span className="whitespace-nowrap px-4 py-2 rounded-lg bg-red-600/95 text-white text-sm font-medium shadow-lg backdrop-blur-sm">
                Неверный формат ID
              </span>
            </div>
          </div>
          <button
            onClick={handleCheckStatus}
            disabled={loadingStatus}
            className={(loadingStatus ? 'opacity-60 cursor-wait ' : '') + 'inline-flex items-center justify-center px-6 py-2 rounded-md bg-violet-600 hover:bg-violet-700 transition-colors'}
          >
            {loadingStatus ? (
              <svg className="animate-spin h-5 w-5 text-white" style={{ animationDuration: '0.6s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              'Проверить'
            )}
          </button>
        </div>
      </div>

      {/* Results section with glass container styling */}
      <div className="dashboard-container mt-8">
        <h2 className="results-title">Результаты по направлениям</h2>
        {renderUniversityBlocks()}
      </div>

      {/* Popup overlay */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain"
          onClick={closePopup}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {popupData && (
              <AdmissionStatusPopup
                studentId={studentIdInput.trim()}
                mainStatus="Статус подачи документов"
                originalKnown={popupData.originalKnown}
                passingSection={popupData.passingSection}
                secondarySections={popupData.secondarySections}
                onClose={closePopup}
              />
            )}
          </div>
        </div>
      )}

    </main>
  );
}
