'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface TokenBarChartProps {
  data: {
    address: string;
    token_name: string;
    chain: string;
    buy_counts: number;
  }[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-background rounded-md border p-3 shadow-md'>
        <p className='mb-2 font-semibold'>{label}</p>
        <div className='text-sm'>
          <span className='font-medium'>Chain: </span>
          {payload[0]?.payload.chain}
        </div>
        <div className='text-sm'>
          <span className='font-medium'>Address: </span>
          {payload[0]?.payload.address}
        </div>
        <div className='text-sm'>
          <span className='font-medium'>Buy Counts: </span>
          {payload[0]?.value}
        </div>
      </div>
    );
  }
  return null;
};

export function KolTokenBarChart({ data }: TokenBarChartProps) {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Top Tokens by Buy Count</CardTitle>
        <CardDescription>Tokens with the highest buy counts</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <div className='aspect-auto h-[250px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: 70
              }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='token_name'
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor='end'
                height={70}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                label={{
                  value: 'Buy Counts',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey='buy_counts'
                name='Buy Counts'
                fill='#8884d8'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
