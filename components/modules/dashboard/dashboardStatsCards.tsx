'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ArrowLeftRight, Receipt, Zap, Wallet } from 'lucide-react';
import type { DashboardStats } from 'components/modules/dashboard/useDashboard';

type Props = {
  stats: DashboardStats;
};

const fmt = (n: number) =>
  '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });

export default function DashboardStatsCards({ stats }: Props) {
  const cards = [
    {
      title: 'Total Cash In',
      value: fmt(stats.totalCashIn),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      title: 'Total Cash Out',
      value: fmt(stats.totalCashOut),
      icon: TrendingDown,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
    {
      title: 'Net Flow',
      value: fmt(Math.abs(stats.netFlow)),
      prefix: stats.netFlow >= 0 ? '+' : '-',
      icon: ArrowLeftRight,
      color: stats.netFlow >= 0 ? 'text-green-600' : 'text-red-500',
      bg: stats.netFlow >= 0 ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30',
    },
    {
      title: 'Transactions',
      value: stats.transactionCount.toString(),
      icon: Receipt,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Biggest Expense',
      value: stats.biggestExpense ? fmt(Number(stats.biggestExpense.amount)) : '—',
      sub: stats.biggestExpense?.name ?? '',
      icon: Zap,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
    },
    {
      title: 'Most Active Wallet',
      value: stats.mostActiveWallet ? stats.mostActiveWallet.wallet?.name ?? '—' : '—',
      sub: stats.mostActiveWallet ? `${stats.mostActiveWallet.count} transactions` : '',
      icon: Wallet,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${card.color}`}>
                {card.prefix ?? ''}{card.value}
              </p>
              {card.sub && (
                <p className="text-xs text-muted-foreground mt-1 truncate">{card.sub}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}