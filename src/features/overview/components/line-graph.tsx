'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { LineChartDataPoint } from '@/models/chart';

interface LineGraphProps {
  data: LineChartDataPoint[];
  title: string;
  subtext: string;
}

const chartConfig = {
  value: {
    label: 'Value',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function LineGraph({ data, title, subtext }: LineGraphProps) {
  // Format the date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate average value for the footer display
  const avgValue =
    data.reduce((sum, item) => sum + item.value, 0) / data.length;

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
                right: 12,
                left: 12,
                bottom: 10
              }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='timestamp'
                tickFormatter={formatDate}
                tickLine={false}
                axisLine={false}
                minTickGap={32}
              />
              <YAxis hide={false} tickLine={false} axisLine={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return formatDate(Number(value));
                    }}
                  />
                }
              />
              <defs>
                <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--primary)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--primary)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Line
                type='monotone'
                dataKey='value'
                stroke='var(--primary)'
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 2 }}
                fill='url(#colorValue)'
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Average value: {avgValue.toFixed(2)}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Last 7 days activity
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
