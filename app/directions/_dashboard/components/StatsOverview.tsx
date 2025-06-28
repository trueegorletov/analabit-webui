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
    <Card className="bg-gradient-to-br from-[#1A1A20] to-[#15151A] border border-white/10 rounded-xl w-full transition-all duration-300 hover:from-[#1F1F26] hover:to-[#1A1A20] hover:scale-105 hover:border-white/20 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_24px_rgba(255,255,255,0.08)]">
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

export default function StatsOverview() {
  const stats = useDashboardStats();

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
