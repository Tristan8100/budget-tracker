'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyFlow } from 'components/modules/dashboard/useDashboard';

type Props = {
  data: DailyFlow[];
};

const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 0 });

export default function DashboardChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cash Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
            No data for this period.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cash Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fontSize: 11 }}
              width={80}
              className="text-muted-foreground"
            />
            <Tooltip
              formatter={(value: any) => fmt(value)}
              contentStyle={{
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
            <Legend />
            <Bar dataKey="cashIn" name="Cash In" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cashOut" name="Cash Out" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}