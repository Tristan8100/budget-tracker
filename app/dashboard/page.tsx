'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDashboard, type DateRange } from 'components/modules/dashboard/useDashboard';
import DashboardStatsCards from '@/components/modules/dashboard/dashboardStatsCards';
import DashboardChart from '@/components/modules/dashboard/dashboardChart';
import DashboardWallets from '@/components/modules/dashboard/dashboardWallet,';

const RANGES: { label: string; value: DateRange }[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Custom', value: 'custom' },
];

export default function DashboardPage() {
  const {
    stats,
    loading,
    error,
    range,
    setRange,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
  } = useDashboard();

  const today = new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
        </div>

        {/* Range filter */}
        <div className="flex flex-wrap items-center gap-2">
          {RANGES.map((r) => (
            <Button
              key={r.value}
              size="sm"
              variant={range === r.value ? 'default' : 'outline'}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom date inputs */}
      {range === 'custom' && (
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">From</label>
            <Input
              type="date"
              className="w-40"
              value={customStart ? customStart.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const d = new Date(e.target.value);
                d.setHours(0, 0, 0, 0);
                setCustomStart(d);
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">To</label>
            <Input
              type="date"
              className="w-40"
              value={customEnd ? customEnd.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const d = new Date(e.target.value);
                d.setHours(23, 59, 59, 999);
                setCustomEnd(d);
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      {loading || !stats ? (
        <div className="text-center py-16 text-muted-foreground text-sm">Loading...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stat cards */}
          <DashboardStatsCards stats={stats} />

          {/* Chart + Wallets side by side on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardChart data={stats.dailyFlow} />
            </div>
            <div>
              <DashboardWallets wallets={stats.wallets} totalBalance={stats.totalBalance} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}