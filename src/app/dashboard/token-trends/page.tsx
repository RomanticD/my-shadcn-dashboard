'use client';

import { useState, Suspense, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Icons } from '@/components/icons';
import { tokenTrendsData } from '@/constants/tokenTrendsData';
import { TokenTrendsLineChartSkeleton } from './components/token-trends-line-chart-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

// Convert timestamp to formatted date
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0];
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, isVolume }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-background rounded-md border p-3 shadow-md'>
        <p className='mb-2 font-bold'>{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className='text-sm'>
            <span style={{ color: entry.color }}>●</span> {entry.name}:{' '}
            {isVolume
              ? new Intl.NumberFormat('zh-CN', {
                  maximumFractionDigits: 2
                }).format(entry.value)
              : entry.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Token Trends Line Chart component
function TokenTrendsLineChart({
  data,
  title,
  subtext,
  dataKeyA,
  dataKeyB,
  colorA,
  colorB,
  labelA,
  labelB,
  isVolume = false
}: {
  data: any[];
  title: string;
  subtext: string;
  dataKeyA: string;
  dataKeyB: string;
  colorA: string;
  colorB: string;
  labelA: string;
  labelB: string;
  isVolume?: boolean;
}) {
  const chartConfig: ChartConfig = {
    [dataKeyA]: {
      label: labelA,
      color: colorA
    },
    [dataKeyB]: {
      label: labelB,
      color: colorB
    }
  };

  return (
    <Card className='@container/card w-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtext}</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[300px] w-full'
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
                dataKey='range'
                tickLine={false}
                axisLine={false}
                minTickGap={32}
              />
              <YAxis
                yAxisId='left'
                orientation='left'
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
              />
              <YAxis
                yAxisId='right'
                orientation='right'
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip isVolume={isVolume} />} />
              <Legend />
              <Line
                yAxisId='left'
                type='monotone'
                dataKey={dataKeyA}
                name={labelA}
                stroke={colorA}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  strokeWidth: 0
                }}
              />
              <Line
                yAxisId='right'
                type='monotone'
                dataKey={dataKeyB}
                name={labelB}
                stroke={colorB}
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

export default function TokenTrendsPage() {
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [dateItems, setDateItems] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedDateId, setSelectedDateId] = useState<string>('');
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [selectedDateData, setSelectedDateData] = useState<any>(null);
  const [tokenOptions, setTokenOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Set loading to true initially
    setIsLoading(true);

    // Add artificial delay to simulate network request
    setTimeout(() => {
      const items = tokenTrendsData.data.items.map((item) => ({
        value: item.date.toString(),
        label: formatDate(item.date)
      }));

      setDateItems(items);
      setSelectedDateId(items[0].value);

      const dateData = tokenTrendsData.data.items.find(
        (item) => item.date.toString() === items[0].value
      );

      setSelectedDateData(dateData);

      const options =
        dateData?.tokens.map((token: any, index: number) => ({
          value: index.toString(),
          label: token.token_name
        })) || [];

      setTokenOptions(options);

      const token = dateData?.tokens[0];
      setSelectedToken(token);

      const data = token?.time_range || [];
      setChartData(data);

      // Set loading to false after data is processed
      setIsLoading(false);
    }, 2000); // 2 second delay
  }, []);

  // Handle date change
  const handleDateChange = (value: string) => {
    setSelectedDateId(value);

    const dateData = tokenTrendsData.data.items.find(
      (item) => item.date.toString() === value
    );

    setSelectedDateData(dateData);

    const options =
      dateData?.tokens.map((token: any, index: number) => ({
        value: index.toString(),
        label: token.token_name
      })) || [];

    setTokenOptions(options);
    setSelectedTokenIndex(0);

    const token = dateData?.tokens[0];
    setSelectedToken(token);

    const data = token?.time_range || [];
    setChartData(data);
  };

  // Handle token change
  const handleTokenChange = (value: string) => {
    const index = parseInt(value);
    setSelectedTokenIndex(index);

    const token = selectedDateData?.tokens[index];
    setSelectedToken(token);

    const data = token?.time_range || [];
    setChartData(data);
  };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>代币趋势</h1>
        <div className='flex items-center gap-2'>
          {!isLoading ? (
            <Select value={selectedDateId} onValueChange={handleDateChange}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='选择日期' />
              </SelectTrigger>
              <SelectContent>
                {dateItems.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Skeleton className='h-10 w-[180px]' />
          )}
        </div>
      </div>

      {!isLoading && selectedDateData && (
        <div className='mt-4 flex flex-wrap items-center gap-4'>
          <Select
            value={selectedTokenIndex.toString()}
            onValueChange={handleTokenChange}
          >
            <SelectTrigger className='w-[240px]'>
              <SelectValue placeholder='选择代币' />
            </SelectTrigger>
            <SelectContent>
              {tokenOptions.map((token) => (
                <SelectItem key={token.value} value={token.value}>
                  {token.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedToken && (
            <Button
              variant='outline'
              onClick={() =>
                window.open(
                  `https://debot.ai/token/${selectedToken.chain}/${selectedToken.token_address}`,
                  '_blank'
                )
              }
              className='flex items-center gap-2'
            >
              <span>查看代币详情</span>
              <Icons.arrowRight className='h-4 w-4' />
            </Button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className='grid grid-cols-1 gap-4'>
          <TokenTrendsLineChartSkeleton />
          <TokenTrendsLineChartSkeleton />
        </div>
      ) : selectedToken ? (
        <>
          <div className='grid grid-cols-1 gap-4'>
            <TokenTrendsLineChart
              data={chartData}
              title='交易量数据对比'
              subtext='GMGN 和 Debot 平台交易量对比'
              dataKeyA='gmgn_volume'
              dataKeyB='debot_volume'
              colorA='#2563eb'
              colorB='#f59e0b'
              labelA='GMGN 交易量'
              labelB='Debot 交易量'
              isVolume={true}
            />

            <TokenTrendsLineChart
              data={chartData}
              title='交易数据对比'
              subtext='GMGN 和 Debot 平台交易数对比'
              dataKeyA='gmgn_count'
              dataKeyB='debot_count'
              colorA='#10b981'
              colorB='#ef4444'
              labelA='GMGN 交易数'
              labelB='Debot 交易数'
            />
          </div>

          <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>GMGN 总交易量</CardDescription>
                <CardTitle className='text-2xl'>
                  {new Intl.NumberFormat('zh-CN', {
                    maximumFractionDigits: 2
                  }).format(selectedToken.gmgn_total_volume)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>GMGN 总交易数</CardDescription>
                <CardTitle className='text-2xl'>
                  {selectedToken.gmgn_total_trades}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Debot 总交易量</CardDescription>
                <CardTitle className='text-2xl'>
                  {new Intl.NumberFormat('zh-CN', {
                    maximumFractionDigits: 2
                  }).format(selectedToken.debot_total_volume)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Debot 总交易数</CardDescription>
                <CardTitle className='text-2xl'>
                  {selectedToken.debot_total_trades}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
