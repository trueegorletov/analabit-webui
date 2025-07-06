import React from 'react';
import AnimatedBlob from './AnimatedBlob';

// Loading spinner component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <svg className="w-full h-full text-white/60" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Loading animation with pulsing dots
export const LoadingDots: React.FC = () => {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );
};

// University directions loading placeholder
export const DirectionsLoadingPlaceholder: React.FC = () => {
  return (
    <div className="directions-loading-placeholder">
      {/* Table-like styled dark background */}
      <div className="directions-loading-table">
        {/* Skeleton rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="loading-row">
            <div className="loading-cell loading-cell-wide">
              <div className="skeleton-line" />
            </div>
            <div className="loading-cell loading-cell-narrow">
              <div className="skeleton-line" />
            </div>
            <div className="loading-cell loading-cell-narrow">
              <div className="skeleton-line" />
            </div>
            <div className="loading-cell loading-cell-medium">
              <div className="skeleton-line" />
            </div>
          </div>
        ))}
      </div>

      {/* Loading message */}
      <div className="loading-message">
        <LoadingSpinner size="sm" />
        <span>Загружаем направления...</span>
      </div>

      <style jsx>{`
        .directions-loading-placeholder {
          margin-top: 1rem;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .directions-loading-table {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1rem;
          min-height: 200px;
        }
        
        .loading-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
          align-items: center;
        }
        
        .loading-row:last-child {
          margin-bottom: 0;
        }
        
        .loading-cell {
          border-radius: 0.25rem;
          height: 2rem;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .loading-cell-wide {
          flex: 2;
        }
        
        .loading-cell-medium {
          flex: 1.5;
        }
        
        .loading-cell-narrow {
          flex: 0.8;
        }
        
        .skeleton-line {
          width: 80%;
          height: 0.75rem;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 25%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.1) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          border-radius: 0.25rem;
          margin: auto 0;
        }
        
        .loading-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

// Error state component for directions
export const DirectionsErrorPlaceholder: React.FC<{
  universityName: string;
  error: string;
  onRetry: () => void;
}> = ({ universityName, error, onRetry }) => {
  return (
    <div className="directions-error-placeholder">
      {/* Table-like styled dark background */}
      <div className="directions-error-table">
        <div className="error-content">
          <div className="error-icon">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div className="error-text">
            <h4>Ошибка загрузки направлений</h4>
            <p>Не удалось загрузить направления для {universityName}</p>
            <p className="error-details">{error}</p>
          </div>

          <button onClick={onRetry} className="retry-button">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Попробовать снова
          </button>
        </div>
      </div>

      <style jsx>{`
        .directions-error-placeholder {
          margin-top: 1rem;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .directions-error-table {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 2rem;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .error-content {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .error-icon {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }
        
        .error-text h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .error-text p {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        .error-details {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem !important;
          font-family: monospace;
          margin-top: 0.75rem;
        }
        
        .retry-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.375rem;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .retry-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        
        .retry-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

// Critical Loading Screen - takes over entire viewport
interface CriticalLoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export function CriticalLoadingScreen({
  message = 'Загружаем университеты...',
  subMessage = 'Подождите, это займет несколько секунд',
}: CriticalLoadingScreenProps) {
  return (
    <div
      className="critical-loading-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div className="loading-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '600px', width: '100%', padding: '2rem' }}>
        <div className="blob-container" style={{ width: '200px', height: '200px', marginBottom: '2rem', animation: 'blobSpin 8s linear infinite' }}>
          <AnimatedBlob />
        </div>
        <div className="loading-text" style={{ textAlign: 'center', color: '#ffffff' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              background: 'linear-gradient(135deg, #ff5e62, #ff7b5e, #ff9966)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {message}
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{subMessage}</p>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: '@keyframes blobSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }',
          }}
        />
      </div>
      <style jsx>{`
        .critical-loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        
        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 600px;
          width: 100%;
          padding: 2rem;
        }
        
        .blob-container {
          width: 100%;
          max-width: 400px;
          height: 200px;
          margin-bottom: 2rem;
        }
        
        .loading-text {
          text-align: center;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .loading-text h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #ff5e62, #ff7b5e, #ff9966);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 200%;
          animation: textGradient 3s ease-in-out infinite;
        }
        
        .loading-text p {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }
        
        @keyframes textGradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @media (max-width: 640px) {
          .loading-content {
            padding: 1rem;
          }
          
          .blob-container {
            height: 150px;
            margin-bottom: 1.5rem;
          }
          
          .loading-text h2 {
            font-size: 1.25rem;
          }
          
          .loading-text p {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}

// Critical Error Screen - for when university loading fails
interface CriticalErrorScreenProps {
  error: string;
  onRetry: () => void;
  retryCount?: number;
}

export function CriticalErrorScreen({
  error,
  onRetry,
  retryCount = 0,
}: CriticalErrorScreenProps) {
  return (
    <div className="critical-error-screen">
      <div className="error-content">
        <div className="blob-container">
          <AnimatedBlob />
        </div>
        <div className="error-text">
          <div className="error-icon">
            <svg className="w-16 h-16 text-red-400" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2>Проблемы с подключением</h2>
          <p>Не удается загрузить данные о университетах</p>
          {retryCount > 0 && (
            <p className="retry-count">Попытка {retryCount}</p>
          )}
          <p className="error-details">{error}</p>
          <button onClick={onRetry} className="retry-button">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Попробовать снова
          </button>
        </div>
      </div>
      <style jsx>{`
        .critical-error-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        
        .error-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 600px;
          width: 100%;
          padding: 2rem;
        }
        
        .blob-container {
          width: 100%;
          max-width: 400px;
          height: 200px;
          margin-bottom: 2rem;
        }
        
        .error-text {
          text-align: center;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .error-icon {
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }
        
        .error-text h2 {
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .error-text p {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
        }
        
        .retry-count {
          color: rgba(255, 255, 255, 0.5) !important;
          font-size: 0.875rem !important;
          font-style: italic;
        }
        
        .error-details {
          color: rgba(255, 255, 255, 0.6) !important;
          font-size: 0.875rem !important;
          font-family: monospace;
          margin: 1.5rem 0;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          max-width: 400px;
        }
        
        .retry-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.875rem 1.75rem;
          background: linear-gradient(135deg, rgba(255, 94, 98, 0.8), rgba(255, 123, 94, 0.8));
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: rgba(255, 255, 255, 0.95);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .retry-button:hover {
          background: linear-gradient(135deg, rgba(255, 94, 98, 1), rgba(255, 123, 94, 1));
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255, 94, 98, 0.3);
        }
        
        .retry-button:active {
          transform: translateY(0);
        }
        
        @media (max-width: 640px) {
          .error-content {
            padding: 1rem;
          }
          
          .blob-container {
            height: 150px;
            margin-bottom: 1.5rem;
          }
          
          .error-text h2 {
            font-size: 1.5rem;
          }
          
          .error-text p {
            font-size: 0.875rem;
          }
          
          .error-details {
            font-size: 0.75rem !important;
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

// Table Loading Placeholder for ApplicationsList
export const TableLoadingPlaceholder: React.FC = () => {
  return (
    <div className="table-loading-placeholder">
      {/* Spinner and message in center */}
      <div className="loading-content">
        <LoadingSpinner size="lg" />
        <span className="loading-text">Загружаем список абитуриентов...</span>
        <span className="loading-subtext">Обрабатываем данные заявлений</span>
      </div>

      {/* Background table skeleton for visual context */}
      <div className="skeleton-table">
        {/* Data rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="skeleton-row data-row">
            <div className="skeleton-cell narrow">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="skeleton-cell medium">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="skeleton-cell wide">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="skeleton-cell narrow">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="skeleton-cell narrow">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="skeleton-cell narrow">
              <div className="skeleton-shimmer"></div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .table-loading-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .loading-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          z-index: 10;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        }
        
        .loading-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          font-weight: 600;
          text-align: center;
          white-space: nowrap;
        }
        
        .loading-subtext {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          text-align: center;
          margin-top: -0.5rem;
          white-space: nowrap;
        }
        
        .skeleton-table {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          opacity: 0.2;
          overflow: hidden;
        }
        
        .skeleton-row {
          display: grid;
          grid-template-columns: max-content max-content repeat(4, 1fr);
          gap: 0.25rem;
          height: 2rem;
          align-items: center;
          padding: 0 0.5rem;
        }
        
        .data-row {
          opacity: 0.6;
        }
        
        .skeleton-cell {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 0.125rem;
          height: 1.25rem;
          position: relative;
          overflow: hidden;
        }
        
        .skeleton-cell.narrow {
          width: 2rem;
        }
        
        .skeleton-cell.medium {
          width: 4rem;
        }
        
        .skeleton-cell.wide {
          width: 100%;
        }
        
        .skeleton-shimmer {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 85%;
          height: 60%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 25%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.1) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 2.5s infinite;
          border-radius: 0.075rem;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .loading-content {
            padding: 1.5rem;
          }
          
          .loading-text {
            font-size: 1rem;
          }
          
          .loading-subtext {
            font-size: 0.8rem;
          }
          
          .skeleton-cell.narrow {
            width: 1.5rem;
          }
          
          .skeleton-cell.medium {
            width: 3rem;
          }
        }
        
        @media (max-width: 480px) {
          .loading-content {
            padding: 1rem;
          }
          
          .loading-text {
            font-size: 0.9rem;
          }
          
          .loading-subtext {
            font-size: 0.75rem;
          }
          
          .skeleton-row {
            height: 1.75rem;
            gap: 0.125rem;
            padding: 0 0.25rem;
          }
          
          .skeleton-cell {
            height: 1rem;
          }
        }
      `}</style>
    </div>
  );
};