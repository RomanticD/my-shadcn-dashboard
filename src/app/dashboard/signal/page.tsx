'use client';

import { useState, Suspense, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SignalLineChart } from './components/signal-line-chart';
import { SignalTable } from './components/signal-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SignalLineChartSkeleton } from './components/signal-line-chart-skeleton';
import { SimpleTableSkeleton } from '@/components/ui/table/simple-table-skeleton';

// Define types for the API response
interface TokenInfo {
  token_name: string;
  chain: string;
  symbol: string;
  first_signal_time: number;
  dog: string | null;
  transaction_amount: number;
  transaction_count: number;
  max_increase: number;
  max_price: number;
  to_zero_seconds: number;
}

interface TimeRangeData {
  time_range: string;
  count: number;
  signal_count: number;
  tokens_info: TokenInfo[];
  total_transaction_amount: number;
  total_transaction_count: number;
  avg_transaction_volume: number;
}

interface ChainData {
  chain_name: string;
  total_signals: TimeRangeData[];
  total_transaction_amount?: number;
  total_transaction_count?: number;
  avg_transaction_volume?: number;
}

interface SignalData {
  store_time: string;
  data_by_chain: ChainData[];
  total_transaction_amount?: number;
  total_transaction_count?: number;
  avg_transaction_volume?: number;
}

interface DayData {
  date: number;
  signals: SignalData;
}

interface ApiResponse {
  code: number;
  description: string;
  data: DayData[];
}

interface ChartData {
  time_range: string;
  count: number;
  signal_count: number;
  total_transaction_amount?: number;
  total_transaction_count?: number;
  avg_transaction_volume?: number;
}

interface DailyChartData {
  [date: string]: {
    solana: ChartData[];
    bsc: ChartData[];
  };
}

interface TokenTableData extends TokenInfo {
  date: string;
  time_range: string;
}

// Helper function to create token info
const createTokenInfo = (
  tokenName: string,
  chain: string,
  symbol: string,
  firstSignalTime: number,
  dog: string | null,
  txAmount: number,
  txCount: number,
  maxIncrease: number,
  maxPrice: number,
  toZeroSeconds: number
): TokenInfo => ({
  token_name: tokenName,
  chain,
  symbol,
  first_signal_time: firstSignalTime,
  dog,
  transaction_amount: txAmount,
  transaction_count: txCount,
  max_increase: maxIncrease,
  max_price: maxPrice,
  to_zero_seconds: toZeroSeconds
});

// Create a full dataset with all time ranges for each day and chain
const generateCompleteChartData = (data: DayData[]): DailyChartData => {
  const timeRanges = Array.from({ length: 24 }, (_, i) => {
    const start = i;
    const end = (i + 1) % 24;
    return `${start}:00-${end}:00`;
  });

  const result: DailyChartData = {};

  data.forEach((dayData) => {
    const date = dayData.signals.store_time;
    result[date] = {
      solana: timeRanges.map((timeRange) => {
        const chainData = dayData.signals.data_by_chain.find(
          (chain) => chain.chain_name === 'solana'
        );
        const timeData = chainData?.total_signals.find(
          (signal) => signal.time_range === timeRange
        );
        return {
          time_range: timeRange,
          count: timeData?.count || 0,
          signal_count: timeData?.signal_count || 0,
          total_transaction_amount: timeData?.total_transaction_amount || 0,
          total_transaction_count: timeData?.total_transaction_count || 0,
          avg_transaction_volume: timeData?.avg_transaction_volume || 0
        };
      }),
      bsc: timeRanges.map((timeRange) => {
        const chainData = dayData.signals.data_by_chain.find(
          (chain) => chain.chain_name === 'bsc'
        );
        const timeData = chainData?.total_signals.find(
          (signal) => signal.time_range === timeRange
        );
        return {
          time_range: timeRange,
          count: timeData?.count || 0,
          signal_count: timeData?.signal_count || 0,
          total_transaction_amount: timeData?.total_transaction_amount || 0,
          total_transaction_count: timeData?.total_transaction_count || 0,
          avg_transaction_volume: timeData?.avg_transaction_volume || 0
        };
      })
    };
  });

  return result;
};

// Extract all token data for the table
const extractAllTokens = (data: DayData[]): TokenTableData[] => {
  const tokens: TokenTableData[] = [];

  data.forEach((dayData) => {
    const date = dayData.signals.store_time;

    dayData.signals.data_by_chain.forEach((chainData) => {
      const chain = chainData.chain_name;

      chainData.total_signals.forEach((signal) => {
        const timeRange = signal.time_range;

        signal.tokens_info.forEach((token) => {
          tokens.push({
            ...token,
            date: date,
            time_range: timeRange
          });
        });
      });
    });
  });

  return tokens;
};

// Function to fetch real data from API
const fetchSignalData = async (): Promise<ApiResponse | null> => {
  try {
    // Calculate timestamp for 3 days ago at 1:00 AM
    const three_days_ago = new Date();
    three_days_ago.setDate(three_days_ago.getDate() - 3);
    three_days_ago.setHours(1, 0, 0, 0);
    const startTimestamp = Math.floor(three_days_ago.getTime() / 1000);

    const response = await fetch(
      `http://172.245.211.10:3222/api/graph/daily-signals?base_time=${startTimestamp}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching signal data:', error);
    return null;
  }
};

// Format timestamp to show only time (hours:minutes:seconds)
const formatTimeOnly = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toTimeString().split(' ')[0];
};

// Format max increase as percentage
const formatAsPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export default function SignalPage() {
  const [chartData, setChartData] = useState<DailyChartData>({});
  const [allTokens, setAllTokens] = useState<TokenTableData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const apiData = await fetchSignalData();

        if (apiData && apiData.data && apiData.data.length > 0) {
          const processedChartData = generateCompleteChartData(apiData.data);
          const processedTokens = extractAllTokens(apiData.data);

          // Sort dates from newest to oldest
          const datesList = apiData.data
            .map((item) => item.signals.store_time)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

          setChartData(processedChartData);
          setAllTokens(processedTokens);
          setDates(datesList);

          // Set the most recent date as the selected date
          if (datesList.length > 0) {
            setSelectedDate(datesList[0]);
          }
        } else {
          console.error(
            'No data received from API or data format is incorrect'
          );
        }
      } catch (error) {
        console.error('Error processing signal data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Signal Dashboard</h1>
        <div className='flex items-center gap-2'>
          {!isLoading && (
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select date' />
              </SelectTrigger>
              <SelectContent>
                {dates.map((date, index) => {
                  const currentDate = new Date(date);
                  const previousDate = new Date(currentDate);
                  previousDate.setDate(previousDate.getDate() - 1);
                  const previousDateStr = previousDate
                    .toISOString()
                    .split('T')[0];

                  return (
                    <SelectItem key={date} value={date}>
                      {previousDateStr}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {isLoading ? (
          <>
            <SignalLineChartSkeleton />
            <SignalLineChartSkeleton />
          </>
        ) : (
          <>
            <SignalLineChart
              data={chartData[selectedDate]?.solana || []}
              title={`Solana Signals (${new Date(new Date(selectedDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]})`}
              subtext='Count and signal count by time range'
            />
            <SignalLineChart
              data={chartData[selectedDate]?.bsc || []}
              title={`BSC Signals (${new Date(new Date(selectedDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]})`}
              subtext='Count and signal count by time range'
            />
          </>
        )}
      </div>

      <div className='mt-4'>
        {isLoading ? (
          <SimpleTableSkeleton columnCount={8} rowCount={10} />
        ) : (
          <SignalTable
            data={allTokens}
            selectedDate={selectedDate}
            formatTimeOnly={formatTimeOnly}
            formatAsPercentage={formatAsPercentage}
          />
        )}
      </div>
    </div>
  );
}
