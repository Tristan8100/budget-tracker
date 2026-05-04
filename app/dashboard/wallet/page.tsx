'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useWallets, Wallet } from '@/components/modules/wallet/hooks/useWallets';
import WalletList from '@/components/modules/wallet/walletList';
import WalletForm from '@/components/modules/wallet/walletForm';

export default function WalletsPage() {
  const { wallets, loading, error, createWallet, updateWallet, deleteWallet } = useWallets();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const handleEdit = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setSelectedWallet(null);
  };

  const handleSubmit = async (payload: Parameters<typeof createWallet>[0]) => {
    if (selectedWallet) {
      await updateWallet(selectedWallet.id, payload);
    } else {
      await createWallet(payload);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Wallets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your wallets</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Wallet
        </Button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-sm">Loading...</div>
      ) : (
        <WalletList wallets={wallets} onEdit={handleEdit} onDelete={deleteWallet} />
      )}

      <WalletForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        wallet={selectedWallet}
      />
    </div>
  );
}