'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

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
import {
  ChartSelector,
  ChartSelectorOption
} from '@/components/ui/chart-selector';
import { BarChartDataPoint, ChartMetadata } from '@/models/chart';

export const description = 'An interactive bar chart';

interface BarGraphProps {
  data: BarChartDataPoint[];
  metadata: ChartMetadata;
  totals: {
    desktop: number;
    mobile: number;
  };
}

const chartConfig = {
  views: {
    label: 'Page Views'
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--primary)'
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--primary)'
  },
  error: {
    label: 'Error',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function BarGraph({ data, metadata, totals }: BarGraphProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('desktop');

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (activeChart === 'error') {
      throw new Error('Mocking Error');
    }
  }, [activeChart]);

  if (!isClient) {
    return null;
  }

  // Create options for the chart selector
  const selectorOptions: ChartSelectorOption[] = [
    {
      key: 'desktop',
      label: chartConfig.desktop.label,
      value: totals.desktop
    },
    {
      key: 'mobile',
      label: chartConfig.mobile.label,
      value: totals.mobile
    },
    {
      key: 'error',
      label: chartConfig.error.label,
      value: 0
    }
  ].filter((option) => totals[option.key as keyof typeof totals] !== undefined);

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>{metadata.title}</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              {metadata.description}
            </span>
            <span className='@[540px]/card:hidden'>
              {metadata.description.split(' ').slice(0, 3).join(' ')}...
            </span>
          </CardDescription>
        </div>
        <ChartSelector
          options={selectorOptions}
          activeKey={activeChart}
          onSelect={(key) => setActiveChart(key as keyof typeof chartConfig)}
        />
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill='url(#fillBar)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
