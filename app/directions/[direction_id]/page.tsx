import { notFound } from 'next/navigation';
import React from 'react';
import DashboardApp from '../_dashboard/DashboardApp';

interface HeadingApiResponse {
  id: number;
  code: string;
  name: string;
  varsity_code: string;
  // Capacity fields for dashboard stats
  regular_capacity: number;
  target_quota_capacity: number;
  dedicated_quota_capacity: number;
  special_quota_capacity: number;
  varsity?: {
    id: number;
    code: string;
    name: string;
  };
}

type Params = { direction_id: string };

export default async function DirectionPage({ params }: { params: Params }) {
  const headingId = Number(params.direction_id);
  if (Number.isNaN(headingId)) {
    return notFound();
  }

  // Fetch heading details on the server to validate existence and get varsity info
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('API base URL is not configured');
    }

    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/headings/${headingId}`, {
      cache: 'no-cache',
    });

    if (!res.ok) {
      return notFound();
    }

    const heading: HeadingApiResponse = await res.json();

    const varsityCode = heading.varsity?.code || heading.varsity_code;
    const varsityName = heading.varsity?.name || varsityCode.toUpperCase();

    return (
      <DashboardApp
        headingId={heading.id}
        headingName={heading.name}
        varsityCode={varsityCode}
        varsityName={varsityName}
        headingData={{
          id: heading.id,
          code: heading.code,
          name: heading.name,
          regularCapacity: heading.regular_capacity,
          targetQuotaCapacity: heading.target_quota_capacity,
          dedicatedQuotaCapacity: heading.dedicated_quota_capacity,
          specialQuotaCapacity: heading.special_quota_capacity,
          varsityCode: varsityCode,
          varsityName: varsityName,
        }}
      />
    );
  } catch {
    return notFound();
  }
}
