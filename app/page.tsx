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

// Dynamically import the 3D volumetric blob so it only executes on the client
const VolumetricBlob = dynamic(() => import('./components/VolumetricBlob'), {
  ssr: false,
});

function Animation() {
  const searchParams = useSearchParams();
  const showAnimatedBlob = searchParams.get('animation') === 'blob';

  // If the query param "animation=blob" is present, render the original 2D AnimatedBlob.
  // Otherwise, fall back to the new 3D VolumetricBlob.
  return showAnimatedBlob ? <AnimatedBlob /> : <VolumetricBlob />;
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

  const handleCheckStatus = () => {
    if (/^\d+$/.test(studentIdInput.trim())) {
      setIsPopupOpen(true);
    } else {
      alert('Пожалуйста, введите числовой ID');
    }
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
            <Animation />
          </Suspense>
        </div>
        <div className="title">Проверка статуса поступления</div>
        <div className="desc">
          Введите ID абитуриента, чтобы узнать, в какие университеты он зачислен
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="ID студента"
            value={studentIdInput}
            onChange={(e) => setStudentIdInput(e.target.value)}
          />
          <button onClick={handleCheckStatus}>Проверить</button>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closePopup}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {/* Using demo props for now */}
            <AdmissionStatusPopup
              studentId={studentIdInput.trim()}
              mainStatus="Original submitted to SPbSU"
              subtitle="Enrollment is possible only at this university"
              passingSection={{
                university: 'SPbSU',
                highlightPriority: 1,
                programs: [
                  { priority: 1, name: 'Informatics', score: 271, rank: 49, delta: '+10' },
                  { priority: 2, name: 'Computer Science', score: 269, rank: 65, delta: '+14' },
                  { priority: 3, name: 'Precision Mechanics and Optics', score: 296, rank: 36 },
                ],
              }}
              secondarySections={[{
                university: 'MSU',
                programs: [
                  { priority: 1, name: 'Applied Mathematics', score: 295, rank: 67, delta: '67' },
                  { priority: 2, name: 'Fundamental Informatics', score: 281, rank: 84, delta: '+17' },
                ],
              }]}
            />
          </div>
        </div>
      )}

    </main>
  );
}
