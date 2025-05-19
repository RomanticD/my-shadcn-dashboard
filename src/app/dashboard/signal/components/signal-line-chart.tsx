'use client';

import {
  Line,
  LineChart,
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
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface SignalLineChartProps {
  data: {
    time_range: string;
    count: number;
    signal_count: number;
    total_transaction_amount?: number;
    total_transaction_count?: number;
    avg_transaction_volume?: number;
  }[];
  title: string;
  subtext: string;
}

// Custom tooltip component with Chinese labels
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-background rounded-md border p-3 shadow-md'>
        <p className='mb-2 font-bold'>{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className='text-sm'>
            <span style={{ color: entry.color }}>●</span>{' '}
            {entry.name === 'count' ? '统计数量: ' : '信号数量: '}
            {entry.value}
          </div>
        ))}
        {payload[0] && payload[0].payload && (
          <>
            {payload[0].payload.total_transaction_amount !== undefined && (
              <div className='mt-2 text-sm'>
                <span className='font-medium'>总交易量:</span>{' '}
                {new Intl.NumberFormat('zh-CN', {
                  maximumFractionDigits: 2
                }).format(payload[0].payload.total_transaction_amount)}
              </div>
            )}
            {payload[0].payload.total_transaction_count !== undefined && (
              <div className='text-sm'>
                <span className='font-medium'>总交易数:</span>{' '}
                {new Intl.NumberFormat('zh-CN').format(
                  payload[0].payload.total_transaction_count
                )}
              </div>
            )}
            {payload[0].payload.avg_transaction_volume !== undefined && (
              <div className='text-sm'>
                <span className='font-medium'>平均交易量:</span>{' '}
                {new Intl.NumberFormat('zh-CN', {
                  maximumFractionDigits: 2
                }).format(payload[0].payload.avg_transaction_volume)}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
  return null;
};

export function SignalLineChart({
  data,
  title,
  subtext
}: SignalLineChartProps) {
  const chartConfig: ChartConfig = {
    count: {
      label: 'Count',
      color: '#2563eb'
    },
    signal_count: {
      label: 'Signal Count',
      color: '#f59e0b'
    }
  };

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtext}</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: 10
              }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='time_range'
                tickLine={false}
                axisLine={false}
                minTickGap={32}
              />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type='monotone'
                dataKey='count'
                name='Count'
                stroke={chartConfig.count.color}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  strokeWidth: 0
                }}
              />
              <Line
                type='monotone'
                dataKey='signal_count'
                name='Signal Count'
                stroke={chartConfig.signal_count.color}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  strokeWidth: 0
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
