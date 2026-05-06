import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export type Transaction = {
  id: string;
  user_id: string;
  wallet_id: string;
  type: 'cash-in' | 'cash-out';
  name: string;
  description: string | null;
  amount: number;
  created_at: string;
};

export type TransactionPayload = {
  wallet_id: string;
  type: 'cash-in' | 'cash-out';
  name: string;
  description?: string;
  amount: number;
};

export type TransactionEditPayload = {
  type: 'cash-in' | 'cash-out';
  name: string;
  description?: string;
};

export function useTransactions() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setTransactions(data ?? []);
    setLoading(false);
  }, []);

  const createTransaction = async (payload: TransactionPayload) => {
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated'); return null; }

    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single();

    if (error) { setError(error.message); return null; }

    // update wallet balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('amount')
      .eq('id', payload.wallet_id)
      .single();

    if (wallet) {
      const newAmount =
        payload.type === 'cash-in'
          ? Number(wallet.amount) + Number(payload.amount)
          : Number(wallet.amount) - Number(payload.amount);

      await supabase
        .from('wallets')
        .update({ amount: newAmount })
        .eq('id', payload.wallet_id);
    }

    setTransactions((prev) => [data, ...prev]);
    return data;
  };

  const updateTransaction = async (id: string, payload: TransactionEditPayload) => {
    setError(null);
    const { data, error } = await supabase
      .from('transactions')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) { setError(error.message); return null; }
    setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
  };

  const deleteTransaction = async (id: string) => {
    setError(null);

    // get transaction first to revert wallet balance
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (!transaction) { setError('Transaction not found'); return false; }

    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) { setError(error.message); return false; }

    // revert wallet balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('amount')
      .eq('id', transaction.wallet_id)
      .single();

    if (wallet) {
      // reverse: cash-in was added so subtract back, cash-out was subtracted so add back
      const revertedAmount =
        transaction.type === 'cash-in'
          ? Number(wallet.amount) - Number(transaction.amount)
          : Number(wallet.amount) + Number(transaction.amount);

      await supabase
        .from('wallets')
        .update({ amount: revertedAmount })
        .eq('id', transaction.wallet_id);
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    return true;
  };

  useEffect(() => {
    fetchTodayTransactions();
  }, [fetchTodayTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTodayTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}