import { notFound } from 'next/navigation'

// Direct import is safe because `DashboardApp` is a client component (`'use client'`).
// Using `next/dynamic` with `ssr: false` inside a server component isn't allowed.
import DashboardApp from '../_dashboard/DashboardApp'

type ParamsPromise = Promise<{ direction_id: string }>

export default async function DirectionPage ({ params }: { params: ParamsPromise }) {
  const { direction_id } = await params
  if (direction_id !== 'demo') return notFound()
  return <DashboardApp />
}

  