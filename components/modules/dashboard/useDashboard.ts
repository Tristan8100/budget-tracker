import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Wallet } from '../wallet/hooks/useWallets';
import type { Transaction } from '../transaction/hooks/useTransactions';

export type DateRange = 'today' | 'week' | 'month' | 'custom';

export type DailyFlow = {
  date: string; // 'MMM DD'
  cashIn: number;
  cashOut: number;
};

export type DashboardStats = {
  totalBalance: number;
  wallets: Wallet[];
  totalCashIn: number;
  totalCashOut: number;
  netFlow: number;
  transactionCount: number;
  biggestExpense: Transaction | null;
  mostActiveWallet: { wallet: Wallet; count: number } | null;
  dailyFlow: DailyFlow[];
};

function getRangeStart(range: DateRange, customStart?: Date): Date {
  const now = new Date();
  if (range === 'today') {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (range === 'week') {
    const d = new Date(now);
    d.setDate(now.getDate() - 6);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (range === 'month') {
    const d = new Date(now);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (range === 'custom' && customStart) return customStart;
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getRangeEnd(range: DateRange, customEnd?: Date): Date {
  if (range === 'custom' && customEnd) return customEnd;
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

export function useDashboard() {
  const supabase = createClient();
  const [range, setRange] = useState<DateRange>('today');
  const [customStart, setCustomStart] = useState<Date | undefined>();
  const [customEnd, setCustomEnd] = useState<Date | undefined>();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const start = getRangeStart(range, customStart);
    const end = getRangeEnd(range, customEnd);

    // wallets
    const { data: wallets, error: walletErr } = await supabase
      .from('wallets')
      .select('*')
      .order('created_at', { ascending: false });

    if (walletErr) { setError(walletErr.message); setLoading(false); return; }

    // transactions in range
    const { data: transactions, error: txErr } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: true });

    if (txErr) { setError(txErr.message); setLoading(false); return; }

    const walletList: Wallet[] = wallets ?? [];
    const txList: Transaction[] = transactions ?? [];

    const totalBalance = walletList.reduce((sum, w) => sum + Number(w.amount), 0);

    const cashInTxs = txList.filter((t) => t.type === 'cash-in');
    const cashOutTxs = txList.filter((t) => t.type === 'cash-out');

    const totalCashIn = cashInTxs.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalCashOut = cashOutTxs.reduce((sum, t) => sum + Number(t.amount), 0);
    const netFlow = totalCashIn - totalCashOut;

    const biggestExpense = cashOutTxs.length > 0
      ? cashOutTxs.reduce((max, t) => Number(t.amount) > Number(max.amount) ? t : max, cashOutTxs[0])
      : null;

    // most active wallet
    const walletTxCount: Record<string, number> = {};
    txList.forEach((t) => {
      walletTxCount[t.wallet_id] = (walletTxCount[t.wallet_id] ?? 0) + 1;
    });
    const topWalletId = Object.entries(walletTxCount).sort((a, b) => b[1] - a[1])[0];
    const mostActiveWallet = topWalletId
      ? { wallet: walletList.find((w) => w.id === topWalletId[0])!, count: topWalletId[1] }
      : null;

    // daily flow grouped by date
    const flowMap: Record<string, { cashIn: number; cashOut: number }> = {};
    txList.forEach((t) => {
      const label = new Date(t.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
      if (!flowMap[label]) flowMap[label] = { cashIn: 0, cashOut: 0 };
      if (t.type === 'cash-in') flowMap[label].cashIn += Number(t.amount);
      else flowMap[label].cashOut += Number(t.amount);
    });
    const dailyFlow: DailyFlow[] = Object.entries(flowMap).map(([date, v]) => ({ date, ...v }));

    setStats({
      totalBalance,
      wallets: walletList,
      totalCashIn,
      totalCashOut,
      netFlow,
      transactionCount: txList.length,
      biggestExpense,
      mostActiveWallet,
      dailyFlow,
    });

    setLoading(false);
  }, [range, customStart, customEnd]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    stats,
    loading,
    error,
    range,
    setRange,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    fetchDashboard,
  };
}