'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardStats } from '@/presentation/hooks/useDashboardStats';
import type { Heading } from '@/domain/models';

interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <Card
      className="relative w-full rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/0 backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:border-white/25 hover:bg-gradient-to-br hover:from-white/15 hover:via-white/8 hover:to-white/0 hover:shadow-[0_10px_28px_rgba(0,0,0,0.55)]"
      style={{ WebkitBackdropFilter: 'blur(12px)' }}
    >
      <CardContent className="flex flex-col items-center justify-center text-center p-1 sm:p-4">
        <span
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white transition-all duration-300"
          style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.6)' }}
        >
          {value}
        </span>
        <span className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-1.5 transition-colors duration-300">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}

interface StatsOverviewProps {
  headingId?: number;
  varsityCode?: string;
  headingData?: Heading;
}

export default function StatsOverview({ headingId, varsityCode, headingData }: StatsOverviewProps) {
  const { stats } = useDashboardStats({ headingId, varsityCode, headingData });

  return (
    <div className="w-full mb-8">
      {/* Mobile/Small-Tablet Layout: full-width 2×2 grid with equal gaps */}
      <div className="md:hidden px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-2 w-full">
          <StatCard value={stats.total} label="Всего" />
          <StatCard value={stats.special} label="Особая" />
          <StatCard value={stats.targeted} label="Целевая" />
          <StatCard value={stats.separate} label="Отдельная" />
        </div>
      </div>

      {/* Desktop Layout: 4 circles in a row */}
      <div className="hidden md:block max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-6 lg:gap-8">
          <StatCard value={stats.total} label="Всего" />
          <StatCard value={stats.special} label="Особая" />
          <StatCard value={stats.targeted} label="Целевая" />
          <StatCard value={stats.separate} label="Отдельная" />
        </div>
      </div>
    </div>
  );
}
