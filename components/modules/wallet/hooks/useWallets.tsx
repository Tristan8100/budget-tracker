import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export type Wallet = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  amount: number;
  created_at: string;
};

export type WalletPayload = {
  name: string;
  description?: string;
  amount?: number;
};

export function useWallets() {
  const supabase = createClient();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setWallets(data ?? []);
    setLoading(false);
  }, []);

  const createWallet = async (payload: WalletPayload) => {
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated'); return null; }
    const { data, error } = await supabase
      .from('wallets')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single();
    if (error) { setError(error.message); return null; }
    setWallets((prev) => [data, ...prev]);
    return data;
  };

  const updateWallet = async (id: string, payload: Partial<WalletPayload>) => {
    setError(null);
    const { data, error } = await supabase
      .from('wallets')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) { setError(error.message); return null; }
    setWallets((prev) => prev.map((w) => (w.id === id ? data : w)));
    return data;
  };

  const deleteWallet = async (id: string) => {
    setError(null);
    const { error } = await supabase.from('wallets').delete().eq('id', id);
    if (error) { setError(error.message); return false; }
    setWallets((prev) => prev.filter((w) => w.id !== id));
    return true;
  };

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return { wallets, loading, error, fetchWallets, createWallet, updateWallet, deleteWallet };
}