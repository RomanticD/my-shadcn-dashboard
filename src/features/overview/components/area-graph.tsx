'use client';

import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import { IconTrendingUp } from '@tabler/icons-react';

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
import {
  ChartSelector,
  ChartSelectorOption
} from '@/components/ui/chart-selector';
import { TradeChartData } from '@/models/chart';

interface AreaGraphProps {
  data: TradeChartData;
}

// Platform colors for the chart - updated with more distinct colors
const platformColors = {
  debot: { color: '#4CAF50', opacity: 0.7 }, // Green
  gmgn: { color: '#2196F3', opacity: 0.7 }, // Blue
  photon: { color: '#FF9800', opacity: 0.7 }, // Orange
  pepe: { color: '#9C27B0', opacity: 0.7 }, // Purple
  axiom: { color: '#F44336', opacity: 0.7 } // Red
};

// Generate dynamic chart config based on platforms
const generateChartConfig = (platforms: string[]): ChartConfig => {
  const config: ChartConfig = {
    volume: {
      label: 'Volume'
    },
    count: {
      label: 'Transactions'
    }
  };

  platforms.forEach((platform) => {
    config[`${platform}_volume`] = {
      label: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Volume`,
      color:
        platformColors[platform as keyof typeof platformColors]?.color ||
        'var(--primary)'
    };

    config[`${platform}_count`] = {
      label: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Transactions`,
      color:
        platformColors[platform as keyof typeof platformColors]?.color ||
        'var(--primary)'
    };
  });

  return config;
};

// Format large numbers for display
const formatYAxis = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

export function AreaGraph({ data }: AreaGraphProps) {
  const { metadata, platforms } = data;

  // All hooks must be called unconditionally at the top level
  const [activeMetric, setActiveMetric] = useState<'volume' | 'count'>(
    'volume'
  );
  const [isClient, setIsClient] = useState(false);

  // Generate chart configuration with useMemo
  const chartConfig = useMemo(
    () => generateChartConfig(platforms),
    [platforms]
  );

  // Create selector options with useMemo
  const selectorOptions = useMemo(() => {
    return [
      {
        key: 'volume',
        label: 'Trade Volume',
        value: Object.values(data.totals.volume).reduce(
          (sum, value) => sum + value,
          0
        )
      },
      {
        key: 'count',
        label: 'Transaction Count',
        value: Object.values(data.totals.count).reduce(
          (sum, value) => sum + value,
          0
        )
      }
    ] as ChartSelectorOption[];
  }, [data.totals]);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return early if not client-side yet
  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card'>
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
          activeKey={activeMetric}
          onSelect={(key) => setActiveMetric(key as 'volume' | 'count')}
        />
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={data.data}
            margin={{
              left: 0,
              right: 12,
              top: 20,
              bottom: 0
            }}
          >
            <defs>
              {platforms.map((platform) => (
                <linearGradient
                  key={platform}
                  id={`fill_${platform}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='5%'
                    stopColor={
                      platformColors[platform as keyof typeof platformColors]
                        ?.color || 'var(--primary)'
                    }
                    stopOpacity={
                      platformColors[platform as keyof typeof platformColors]
                        ?.opacity || 0.8
                    }
                  />
                  <stop
                    offset='95%'
                    stopColor={
                      platformColors[platform as keyof typeof platformColors]
                        ?.color || 'var(--primary)'
                    }
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='formattedDate'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator='dot'
                  className='w-[180px]' // Increased width for better spacing
                  labelFormatter={(value) => {
                    const dataPoint = data.data.find(
                      (p) => p.formattedDate === value
                    );
                    if (dataPoint) {
                      const date = new Date(dataPoint.date * 1000);
                      return date.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      });
                    }
                    return value;
                  }}
                />
              }
            />
            <Legend />
            {platforms.map((platform) => (
              <Area
                key={platform}
                name={platform.charAt(0).toUpperCase() + platform.slice(1)}
                type='monotone'
                dataKey={`${platform}_${activeMetric}`}
                stroke={
                  platformColors[platform as keyof typeof platformColors]
                    ?.color || 'var(--primary)'
                }
                fill={`url(#fill_${platform})`}
                stackId='1'
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              {metadata.insight?.text || 'Trading activity trending up'}{' '}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              {data.data.length > 0 && (
                <>
                  {new Date(data.data[0].date * 1000).toLocaleDateString(
                    'en-US',
                    { month: 'long' }
                  )}{' '}
                  -{' '}
                  {new Date(
                    data.data[data.data.length - 1].date * 1000
                  ).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
