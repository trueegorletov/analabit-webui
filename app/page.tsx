'use client';
import { useEffect, useMemo, Suspense, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
// AnimatedBlob deprecated on main page; always use shader-powered VolumetricBlob
import OffseasonStub from '@/app/components/OffseasonStub';
import { type Palette } from './utils/glowHelpers';
import { useUniversityColors } from '../hooks/useUniversityColors';
import { useUniversitiesData } from '../hooks/useUniversitiesData';
import { UniversityBlock } from './components/UniversityBlock';
import { CriticalLoadingScreen, CriticalErrorScreen } from './components/LoadingComponents';
import { AdmissionStatusPopup } from './components/AdmissionStatusPopup';
import {
  fetchStudentAdmissionData,
  type AdmissionData,
  type StudentNotFoundError,
  type StudentDataError,
  type StudentTimeoutError,
} from '../lib/api/student';
import { useApplicationRepository, useHeadingRepository, useResultsRepository } from '../application/DataProvider';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

// Dynamically import the 3D volumetric blob so it only executes on the client
const VolumetricBlob = dynamic(() => import('./components/VolumetricBlob'), {
  ssr: false,
});

function Animation({ loading, error }: { loading: boolean; error: boolean }) {
  // Always use the shaders-powered VolumetricBlob on the main page
  return <VolumetricBlob loading={loading} error={error} />;
}

export default function Home() {
  const OFFSEASON = process.env.NEXT_PUBLIC_OFFSEASON_STUB ?? true;

  return OFFSEASON ? <OffseasonStub /> : <HomeContent />;
}

function HomeContent() {
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

  const { getUniversityColor } = useUniversityColors();

  const applicationRepo = useApplicationRepository();
  const headingRepo = useHeadingRepository();
  const resultsRepo = useResultsRepository();

  const universityPalettes = useMemo(() => {
    const mapping: { [key: string]: Palette } = {};
    universities.forEach((university) => {
      const color = getUniversityColor(university.code);
      if (color) {
        mapping[university.code] = {
          grad: color.gradient,
          glow: color.glow,
        };
      } else {
        mapping[university.code] = {
          grad: 'linear-gradient(120deg, rgba(255, 94, 98, 0.6), rgba(255, 153, 102, 0.6))',
          glow: 'rgba(255, 120, 99, 0.3)',
        };
      }
    });
    return mapping;
  }, [universities, getUniversityColor]);

  const sortedUniversities = useMemo(
    () => [...universities].sort((a, b) => a.name.localeCompare(b.name)),
    [universities],
  );

  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  const [studentIdInput, setStudentIdInput] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<AdmissionData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const ERROR_DURATION = 3511;
  const TOOLTIP_VISIBLE_DURATION = 5500;
  const [blobError, setBlobError] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleInputKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCheckStatus();
    }
  };

  const handleIdInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const originalValue = event.target.value;
    let sanitizedValue = originalValue;
    const hasInvalidChars = /[^0-9@]/.test(originalValue);
    const atCount = (originalValue.match(/@/g) || []).length;
    const hasMultipleAts = atCount > 1;
    const hasAtInMiddle = originalValue.includes('@') && !originalValue.startsWith('@');

    if (hasInvalidChars || hasMultipleAts || hasAtInMiddle) {
      if (originalValue.startsWith('@')) {
        sanitizedValue = '@' + originalValue.slice(1).replace(/[^0-9]/g, '');
      } else {
        sanitizedValue = originalValue.replace(/[^0-9]/g, '');
      }

      setTooltipText('Недопустимый символ');
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, TOOLTIP_VISIBLE_DURATION);
    }

    setStudentIdInput(sanitizedValue);
    if (inputError) setInputError(false);
  };

  const handleCheckStatus = () => {
    if (buttonRef.current) {
      buttonRef.current.blur();
    }

    document.body.style.pointerEvents = 'none';
    ScrollTrigger.getAll().forEach((trigger) => trigger.disable());
    document.dispatchEvent(new CustomEvent('disableParallax'));

    const executeCheck = () => {
      document.body.style.pointerEvents = 'auto';
      ScrollTrigger.getAll().forEach((trigger) => trigger.enable());
      document.dispatchEvent(new CustomEvent('enableParallax'));

      const trimmedId = studentIdInput.trim();

      if (!trimmedId) {
        setTooltipText('Введите СНИЛС или ID');
        setInputError(true);
        setShowTooltip(true);
        setBlobError(true);
        setTimeout(() => {
          setBlobError(false);
        }, ERROR_DURATION);
        setTimeout(() => setShowTooltip(false), TOOLTIP_VISIBLE_DURATION);
        if (buttonRef.current) {
          gsap.fromTo(
            buttonRef.current,
            { x: -8 },
            {
              x: 8,
              duration: 0.11,
              ease: 'power2.inOut',
              yoyo: true,
              repeat: 7,
              onComplete: () => {
                gsap.set(buttonRef.current, { x: 0 });
              },
            },
          );
        }
        return;
      }

      setLoadingStatus(true);

      fetchStudentAdmissionData(trimmedId, applicationRepo, headingRepo, resultsRepo)
        .then((data) => {
          setPopupData(data);
          setIsPopupOpen(true);
          setLoadingStatus(false);
          setInputError(false);
        })
        .catch((error: StudentNotFoundError | StudentDataError | StudentTimeoutError) => {
          const isNotFound = error.type === 'NOT_FOUND';
          const isTimeout = error.type === 'TIMEOUT';
          let tooltipMessage = 'Произошла ошибка при загрузке данных';

          if (isNotFound) {
            tooltipMessage = 'Абитуриент не найден';
          } else if (isTimeout) {
            tooltipMessage = 'Превышено время ожидания запроса';
          }

          setTooltipText(tooltipMessage);
          setInputError(true);
          setShowTooltip(true);
          setBlobError(true);
          setTimeout(() => {
            setBlobError(false);
          }, ERROR_DURATION);
          setTimeout(() => setShowTooltip(false), TOOLTIP_VISIBLE_DURATION);
          setLoadingStatus(false);
        });
    };

    gsap.to(window, {
      duration: 0.3,
      scrollTo: 0,
      ease: 'sine.inOut',
      onComplete: executeCheck,
      onInterrupt: () => {
        document.body.style.pointerEvents = 'auto';
        ScrollTrigger.getAll().forEach((trigger) => trigger.enable());
        document.dispatchEvent(new CustomEvent('enableParallax'));
      },
    });
  };

  const closePopup = () => setIsPopupOpen(false);

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
  }, [pendingScroll, universities, scrollToUniversity]);

  useEffect(() => {
    if (universities.length === 0) return;

    const handleHashChange = () => {
      const code = window.location.hash.replace('#', '');
      if (code) {
        scrollToUniversity(code);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [universities, scrollToUniversity]);

  useEffect(() => {
    if (universities.length === 0) return;

    const tags = gsap.utils.toArray<HTMLElement>('.tag');
    tags.forEach((tag) => {
      const universityCode = tag.dataset.universityCode;
      const palette =
        universityCode && universityPalettes[universityCode]
          ? universityPalettes[universityCode]
          : {
            grad: 'linear-gradient(120deg, rgba(255, 94, 98, 0.6), rgba(255, 153, 102, 0.6))',
            glow: 'rgba(255, 120, 99, 0.3)',
          };

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

    const universityBlocks = gsap.utils.toArray<HTMLElement>('.university-block');
    universityBlocks.forEach((block) => {
      const universityCode = block.dataset.universityCode;
      const palette =
        universityCode && universityPalettes[universityCode]
          ? universityPalettes[universityCode]
          : {
            grad: 'linear-gradient(120deg, rgba(255, 94, 98, 0.6), rgba(255, 153, 102, 0.6))',
            glow: 'rgba(255, 120, 99, 0.3)',
          };

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

  useEffect(() => {
    if (universities.length > 0) {
      console.log(
        '[DEBUG] Universities loaded:',
        universities.map((u) => ({ name: u.name, code: u.code })),
      );
    }
  }, [universities]);

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

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isPopupOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
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
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isPopupOpen]);

  if (universitiesLoading) {
    return (
      <CriticalLoadingScreen
        message="Загружаем университеты..."
        subMessage={retryCount > 1 ? `Попытка ${retryCount}` : 'Подождите, это займет несколько секунд'}
      />
    );
  }

  if (universitiesError) {
    return (
      <CriticalErrorScreen
        error={universitiesError}
        onRetry={refreshUniversities}
        retryCount={retryCount}
      />
    );
  }

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
    return sortedUniversities.map((university) => (
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
    <div className="min-h-screen">
      <div className="dashboard-container">
        <div className="tags">
          {sortedUniversities.map((university) => (
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
          <Suspense fallback={<div>Загрузка...</div>}>
            <Animation loading={loadingStatus} error={blobError} />
          </Suspense>
        </div>
        <div className="title hero-title">Проверка статуса поступления</div>
        <div className="desc">
          Введите ID абитуриента, чтобы узнать, на какие образовательные программы он проходит
        </div>
        <div className="input-group flex gap-4 items-start">
          <div className="relative flex-grow">
            <input
              type="text"
              inputMode="text"
              placeholder="ID абитуриента или @WebanketaID"
              value={studentIdInput}
              onChange={handleIdInputChange}
              onKeyDown={handleInputKeydown}
              className={`w-full bg-black/30 text-white rounded-lg px-4 py-3 placeholder-gray-500 transition-all duration-300 ease-in-out focus:outline-none ${inputError
                ? 'ring-2 ring-red-500/80 focus:ring-red-500/80'
                : 'focus:ring-2 focus:ring-violet-500/80'
                }`}
            />
            <div
              className="absolute -top-12 inset-x-0 flex justify-center pointer-events-none transition-opacity duration-700 ease-in-out"
              style={{ opacity: showTooltip ? 1 : 0 }}
            >
              <span className="whitespace-no wrap px-4 py-2 rounded-lg bg-red-600/95 text-white text-sm font-medium shadow-lg backdrop-blur-sm">
                {tooltipText || 'Неверный формат ID'}
              </span>
            </div>
          </div>
          <button
            ref={buttonRef}
            onClick={handleCheckStatus}
            disabled={loadingStatus}
            className={
              (loadingStatus ? 'opacity-60 cursor-wait ' : '') +
              'inline-flex items-center justify-center px-6 py-2 rounded-md bg-violet-600 hover:bg-violet-700 transition-colors'
            }
          >
            {loadingStatus ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                style={{ animationDuration: '0.6s' }}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              'Проверить'
            )}
          </button>
        </div>
      </div>

      <div className="dashboard-container-secondary">
        <h2 className="section-title">Проходные по ОП</h2>
        {renderUniversityBlocks()}
      </div>

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
                passingSection={popupData.passingSection}
                originalKnown={popupData.originalKnown}
                secondarySections={popupData.secondarySections}
                probabilityTabs={popupData.probabilityTabs}
                onClose={closePopup}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
