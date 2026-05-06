'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTransactions, type Transaction } from 'components/modules/transaction/hooks/useTransactions';
import { useWallets } from 'components/modules/wallet/hooks/useWallets';
import TransactionList from '@/components/modules/transaction/transactionList';
import TransactionForm from '@/components/modules/transaction/transactionForm';

export default function TransactionsPage() {
  const {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const { wallets } = useWallets();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setSelectedTransaction(null);
  };

  const today = new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
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
        <TransactionList
          transactions={transactions}
          wallets={wallets}
          onEdit={handleEdit}
          onDelete={deleteTransaction}
        />
      )}

      <TransactionForm
        open={formOpen}
        onClose={handleClose}
        transaction={selectedTransaction}
        onCreate={createTransaction}
        onUpdate={updateTransaction}
      />
    </div>
  );
}