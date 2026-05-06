'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useWallets, type Wallet } from 'components/modules/wallet/hooks/useWallets';
import type { Transaction, TransactionPayload, TransactionEditPayload } from 'components/modules/transaction/hooks/useTransactions';

type Props = {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  onCreate: (payload: TransactionPayload) => Promise<unknown>;
  onUpdate: (id: string, payload: TransactionEditPayload) => Promise<unknown>;
};

const defaultCreate: TransactionPayload = {
  wallet_id: '',
  type: 'cash-in',
  name: '',
  description: '',
  amount: 0,
};

export default function TransactionForm({ open, onClose, transaction, onCreate, onUpdate }: Props) {
  const { wallets } = useWallets();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [form, setForm] = useState(defaultCreate);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!transaction;

  useEffect(() => {
    if (transaction) {
      setForm({
        wallet_id: transaction.wallet_id,
        type: transaction.type,
        name: transaction.name,
        description: transaction.description ?? '',
        amount: transaction.amount,
      });
      setSelectedWallet(null);
    } else {
      setForm(defaultCreate);
      setSelectedWallet(null);
    }
  }, [transaction, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSelectWallet = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setForm((prev) => ({ ...prev, wallet_id: wallet.id }));
  };

  const isValid = isEdit
    ? !!form.name.trim()
    : !!form.name.trim() && !!form.wallet_id && form.amount > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    if (isEdit && transaction) {
      await onUpdate(transaction.id, {
        type: form.type,
        name: form.name,
        description: form.description,
      });
    } else {
      await onCreate(form);
    }
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">

          {/* Wallet picker — create only */}
          {!isEdit && (
            <div className="flex flex-col gap-1.5">
              <Label>Wallet <span className="text-destructive">*</span></Label>
              {wallets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No wallets found. Create one first.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      type="button"
                      onClick={() => handleSelectWallet(wallet)}
                      className={cn(
                        'rounded-md border px-3 py-2 text-left text-sm transition-colors',
                        selectedWallet?.id === wallet.id
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border hover:border-primary/50 hover:bg-muted'
                      )}
                    >
                      <p className="font-medium truncate">{wallet.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ₱{Number(wallet.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Locked wallet display — edit only */}
          {isEdit && (
            <div className="flex flex-col gap-1.5">
              <Label>Wallet</Label>
              <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                {wallets.find((w) => w.id === transaction?.wallet_id)?.name ?? transaction?.wallet_id}
                <span className="ml-2 text-xs">(locked)</span>
              </div>
            </div>
          )}

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <Label>Type <span className="text-destructive">*</span></Label>
            <Select
              value={form.type}
              onValueChange={(val) => setForm((prev) => ({ ...prev, type: val as 'cash-in' | 'cash-out' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash-in">Cash In</SelectItem>
                <SelectItem value="cash-out">Cash Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Groceries"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional"
              value={form.description ?? ''}
              onChange={handleChange}
              rows={2}
            />
          </div>

          {/* Amount — create only */}
          {!isEdit && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount">Amount <span className="text-destructive">*</span></Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={0.01}
                step="0.01"
                value={form.amount}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Locked amount display — edit only */}
          {isEdit && (
            <div className="flex flex-col gap-1.5">
              <Label>Amount</Label>
              <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                ₱{Number(transaction?.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                <span className="ml-2 text-xs">(locked)</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !isValid}>
            {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}