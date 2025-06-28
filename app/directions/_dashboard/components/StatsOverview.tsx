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
    <Card className="bg-[#25252D] border-none rounded-full aspect-square w-full max-w-20 sm:max-w-24 md:max-w-28 lg:max-w-32 transition-all duration-300 hover:bg-[#2A2A34] hover:scale-105 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(37,37,45,0.6),0_0_20px_rgba(255,255,255,0.1)]">
      <CardContent className="flex flex-col items-center justify-center text-center h-full p-1 sm:p-2">
        <span
          className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-white transition-all duration-300"
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

export default function StatsOverview() {
  const stats = useDashboardStats();

  return (
    <div className="w-full mb-8">
      {/* Mobile/Small Tablet Layout: 2x2 centered grid */}
      <div className="md:hidden flex justify-center px-4">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-sm">
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
