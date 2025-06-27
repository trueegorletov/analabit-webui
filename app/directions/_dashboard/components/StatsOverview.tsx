'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/useDashboardStats';

interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <Card className="bg-[#25252D] border-none rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 transition-all duration-300 hover:bg-[#2A2A34] hover:scale-105 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(37,37,45,0.6),0_0_20px_rgba(255,255,255,0.1)]">
      <CardContent className="flex flex-col items-center justify-center text-center h-full p-1 sm:p-2">
        <span
          className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-white transition-all duration-300"
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
        >
          {value}
        </span>
        <span className="text-xs text-gray-400 mt-0.5 sm:mt-1 transition-colors duration-300">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}

function AdmissionBlock({
  passingScore,
  admittedRank,
}: {
  passingScore?: number;
  admittedRank?: number;
}) {
  if (!passingScore || !admittedRank) return null;

  return (
    <div className="flex flex-col justify-center space-y-4">
      <div>
        <p className="text-sm text-gray-400">Проходной балл</p>
        <p className="text-4xl font-bold text-white">{passingScore}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Ранг зачисленного</p>
        <p className="text-4xl font-bold text-white">#{admittedRank}</p>
      </div>
    </div>
  );
}

export default function StatsOverview() {
  const stats = useDashboardStats();

  return (
    <div className="w-full mb-8">
      {/* Mobile Layout: Compact circles on left, admission info on right */}
      <div className="md:hidden px-2">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-full gap-4 max-w-md">
            <div className="flex-[2] grid grid-cols-2 gap-3 place-items-center">
              <StatCard value={stats.total} label="Всего" />
              <StatCard value={stats.special} label="Особая" />
              <StatCard value={stats.targeted} label="Целевая" />
              <StatCard value={stats.separate} label="Отдельная" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <AdmissionBlock
                passingScore={stats.passingScore}
                admittedRank={stats.admittedRank}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tablet/Desktop Layout: Responsive grid of circles only */}
      <div className="hidden md:block max-w-4xl mx-auto">
        <div className="grid grid-cols-4 gap-6 lg:gap-8 place-items-center justify-center">
          <StatCard value={stats.total} label="Всего" />
          <StatCard value={stats.special} label="Особая" />
          <StatCard value={stats.targeted} label="Целевая" />
          <StatCard value={stats.separate} label="Отдельная" />
        </div>
      </div>
    </div>
  );
}
