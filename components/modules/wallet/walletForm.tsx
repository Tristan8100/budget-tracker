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
import type { Wallet, WalletPayload } from './hooks/useWallets';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: WalletPayload) => Promise<unknown>;
  wallet?: Wallet | null; // if provided = edit mode
};

const defaultForm: WalletPayload = { name: '', description: '', amount: 0 };

export default function WalletForm({ open, onClose, onSubmit, wallet }: Props) {
  const [form, setForm] = useState<WalletPayload>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (wallet) {
      setForm({ name: wallet.name, description: wallet.description ?? '', amount: wallet.amount });
    } else {
      setForm(defaultForm);
    }
  }, [wallet, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{wallet ? 'Edit Wallet' : 'New Wallet'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Main Account"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional description"
              value={form.description ?? ''}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Initial Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={0}
              step="0.01"
              value={form.amount}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !form.name.trim()}>
            {submitting ? 'Saving...' : wallet ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}