import React from 'react';
import type { UniversityDirectionsState } from '@/hooks/useUniversitiesData';
import type { Varsity } from '@/domain/models';
import { UniversityBlock } from './UniversityBlock';

interface UniversityBlocksWrapperProps {
    universities: Varsity[];
    directionsCache: { [key: string]: UniversityDirectionsState };
    fetchUniversityDirections: (code: string) => void;
    universityPalettes: { [key: string]: { grad: string; glow: string } };
}

const UniversityBlocksWrapper = ({
    universities,
    directionsCache,
    fetchUniversityDirections,
    universityPalettes,
}: UniversityBlocksWrapperProps) => {
    return (
        <div className="dashboard-container-secondary">
            <h2 className="text-2xl font-bold mb-4">Популярные вузы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {universities.map((university) => (
                    <UniversityBlock
                        key={university.code}
                        university={university}
                        palette={universityPalettes[university.code]}
                        directionsState={directionsCache[university.code]}
                        onFetchDirections={async () => await fetchUniversityDirections(university.code)}
                    />
                ))}
            </div>
        </div>
    );
};

export default UniversityBlocksWrapper;
