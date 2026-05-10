'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Wallet } from 'components/modules/wallet/hooks/useWallets';

type Props = {
  wallets: Wallet[];
  totalBalance: number;
};

const fmt = (n: number) => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

export default function DashboardWallets({ wallets, totalBalance }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Wallets</CardTitle>
          <span className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{fmt(totalBalance)}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {wallets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No wallets yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {wallets.map((wallet) => {
              const pct = totalBalance > 0 ? (Number(wallet.amount) / totalBalance) * 100 : 0;
              return (
                <div key={wallet.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{wallet.name}</span>
                    <span className="text-muted-foreground">{fmt(wallet.amount)}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {pct.toFixed(1)}% of total
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}