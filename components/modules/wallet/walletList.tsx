'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import type { Wallet } from './hooks/useWallets';

type Props = {
  wallets: Wallet[];
  onEdit: (wallet: Wallet) => void;
  onDelete: (id: string) => Promise<boolean>;
};

export default function WalletList({ wallets, onEdit, onDelete }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Wallet | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await onDelete(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  if (wallets.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        No wallets yet. Create one to get started.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">{wallet.name}</CardTitle>
              {wallet.description && (
                <p className="text-sm text-muted-foreground">{wallet.description}</p>
              )}
            </CardHeader>
            <CardContent className="flex items-end justify-between pt-0">
              <span className="text-2xl font-bold">
                ₱{Number(wallet.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(wallet)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(wallet)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deleteTarget?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the wallet and all its transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}