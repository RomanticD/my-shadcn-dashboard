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
}

interface SignalData {
  store_time: string;
  data_by_chain: ChainData[];
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

// Generate mock data that covers all 24 hours
const generateMockData = (): ApiResponse => {
  const dates = ['2025-05-18', '2025-05-19', '2025-05-20'];
  const baseTimestamp = 1747440000; // Base timestamp for May 18, 2025
  const dayInSeconds = 86400;

  // Dog types
  const dogTypes = ['金狗', '银狗', '铜狗', null];

  // Chain names
  const chains = ['solana', 'bsc'];

  // Generate data for each day
  return {
    code: 200,
    description: 'Successfully fetched daily signal data.',
    data: dates.map((date, dateIndex) => {
      const dayTimestamp = baseTimestamp + dateIndex * dayInSeconds;

      return {
        date: dayTimestamp,
        signals: {
          store_time: date,
          data_by_chain: chains.map((chain) => {
            // Create time ranges data for each hour of the day
            const timeRanges = Array.from({ length: 24 }, (_, i) => {
              const startHour = i;
              const endHour = (i + 1) % 24;
              const timeRange = `${startHour}:00-${endHour}:00`;

              // Generate random count based on time of day
              // Make some hours busier than others
              let count = 0;
              let signalCount = 0;

              // More activity during market hours (9am-5pm)
              if (startHour >= 9 && startHour < 17) {
                count = Math.floor(Math.random() * 15) + 5; // 5-20
              } else if (startHour >= 20 || startHour < 4) {
                // Less activity during night
                count = Math.floor(Math.random() * 5) + 1; // 1-5
              } else {
                // Moderate activity during other hours
                count = Math.floor(Math.random() * 8) + 2; // 2-10
              }

              // Sometimes signal count is same as count, sometimes less
              signalCount = Math.floor(Math.random() * (count + 1));

              // If count is zero, make sure signal count is also zero
              if (count === 0) signalCount = 0;

              // Generate tokens for this time range
              const tokensInfo: TokenInfo[] = Array.from(
                { length: signalCount },
                (_, tokenIndex) => {
                  const tokenTimestamp =
                    dayTimestamp +
                    startHour * 3600 +
                    Math.floor(Math.random() * 3600);
                  const randomDog =
                    dogTypes[Math.floor(Math.random() * dogTypes.length)];

                  // Generate token name based on chain
                  let tokenName = '';
                  if (chain === 'solana') {
                    tokenName = `${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
                  } else {
                    tokenName = `0x${Math.random().toString(16).substring(2, 42)}`;
                  }

                  // Generate symbol
                  const symbol = `${chain.toUpperCase().substring(0, 3)}${Math.floor(Math.random() * 1000)}`;

                  // Generate transaction amount and count
                  const txAmount = Math.random() * 10000 + 100;
                  const txCount = Math.floor(Math.random() * 100) + 5;

                  // Generate max increase and price
                  const maxIncrease = Math.random() * 10;
                  const maxPrice = Math.random() * 0.001;

                  // Generate to_zero_seconds (50% chance to be zeroed)
                  const toZeroSeconds =
                    Math.random() > 0.5
                      ? Math.floor(Math.random() * 100000)
                      : 0;

                  return createTokenInfo(
                    tokenName,
                    chain,
                    symbol,
                    tokenTimestamp,
                    randomDog,
                    txAmount,
                    txCount,
                    maxIncrease,
                    maxPrice,
                    toZeroSeconds
                  );
                }
              );

              // Calculate total transaction statistics
              const totalTxAmount = tokensInfo.reduce(
                (sum, token) => sum + token.transaction_amount,
                0
              );
              const totalTxCount = tokensInfo.reduce(
                (sum, token) => sum + token.transaction_count,
                0
              );
              const avgTxVolume =
                totalTxCount > 0 ? totalTxAmount / totalTxCount : 0;

              return {
                time_range: timeRange,
                count: count,
                signal_count: signalCount,
                tokens_info: tokensInfo,
                total_transaction_amount: totalTxAmount,
                total_transaction_count: totalTxCount,
                avg_transaction_volume: avgTxVolume
              };
            });

            return {
              chain_name: chain,
              total_signals: timeRanges
            };
          })
        }
      };
    })
  };
};

// Generate mock data
const mockData = generateMockData();

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

export default function SignalPage() {
  const [chartData, setChartData] = useState<DailyChartData>({});
  const [allTokens, setAllTokens] = useState<TokenTableData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to true initially
    setIsLoading(true);

    // Add artificial delay to simulate network request
    setTimeout(() => {
      const processedChartData = generateCompleteChartData(mockData.data);
      const processedTokens = extractAllTokens(mockData.data);
      const initialDate = mockData.data[0].signals.store_time;
      const datesList = mockData.data.map((item) => item.signals.store_time);

      setChartData(processedChartData);
      setAllTokens(processedTokens);
      setSelectedDate(initialDate);
      setDates(datesList);

      // Set loading to false after data is processed
      setIsLoading(false);
    }, 2000); // 2 second delay
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
                {dates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
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
              title={`Solana Signals (${selectedDate})`}
              subtext='Count and signal count by time range'
            />
            <SignalLineChart
              data={chartData[selectedDate]?.bsc || []}
              title={`BSC Signals (${selectedDate})`}
              subtext='Count and signal count by time range'
            />
          </>
        )}
      </div>

      <div className='mt-4'>
        {isLoading ? (
          <SimpleTableSkeleton columnCount={8} rowCount={10} />
        ) : (
          <SignalTable data={allTokens} selectedDate={selectedDate} />
        )}
      </div>
    </div>
  );
}
