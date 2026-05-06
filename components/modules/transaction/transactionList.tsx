'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import type { Transaction } from 'components/modules/transaction/hooks/useTransactions';
import type { Wallet} from 'components/modules/wallet/hooks/useWallets';

type Props = {
  transactions: Transaction[];
  wallets: Wallet[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<boolean>;
};

export default function TransactionList({ transactions, wallets, onEdit, onDelete }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getWalletName = (wallet_id: string) =>
    wallets.find((w) => w.id === wallet_id)?.name ?? wallet_id;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await onDelete(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        No transactions today yet.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{getWalletName(t.wallet_id)}</TableCell>
                <TableCell>
                  <Badge variant={t.type === 'cash-in' ? 'default' : 'destructive'}>
                    {t.type === 'cash-in' ? 'Cash In' : 'Cash Out'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                  {t.description ?? '—'}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  <span className={t.type === 'cash-in' ? 'text-green-600' : 'text-red-500'}>
                    {t.type === 'cash-in' ? '+' : '-'}₱
                    {Number(t.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(t)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(t)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deleteTarget?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the transaction and revert the wallet balance.
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