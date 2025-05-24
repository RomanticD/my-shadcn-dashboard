'use client';

import { useState, useEffect } from 'react';
import { KolTokenBarChart } from '@/features/group/kol_trade/components/kol-token-bar-chart';
import { KolActiveBarChart } from '@/features/group/kol_trade/components/kol-active-bar-chart';
import { KolTokenTable } from '@/features/group/kol_trade/components/kol-token-table';
import { KolBarChartSkeleton } from '@/features/group/kol_trade/components/kol-bar-chart-skeleton';
import { SimpleTableSkeleton } from '@/components/ui/table/simple-table-skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ChainData {
  chain: string;
  store_time: string;
  tokens: Record<string, any>;
}

interface ApiResponse {
  code: number;
  description: string;
  data: {
    all_days_data: Array<{
      date: number;
      chains: Array<{
        chain: string;
        store_time: string;
        tokens: Array<{
          token_address: string;
          kols_details: Array<{
            address: string;
            twitter_name: string;
            twitter_username: string;
            avatar: string;
            holding_time: number;
            buy_count: number;
            sell_count: number;
            buy_volume: number;
            sell_volume: number;
          }>;
          avg_buy_count: number;
          avg_sell_count: number;
          avg_buy_volume: number;
          avg_sell_volume: number;
          is_signaled: boolean;
        }>;
      }>;
    }>;
  };
}

// Function to generate dates for dropdown
const generateDateOptions = () => {
  const options = [];
  const today = new Date();

  for (let i = 1; i <= 3; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    options.push(formattedDate);
  }

  return options;
};

// Data transformation functions
const getTopTokensByBuyCount = (apiData: ApiResponse) => {
  if (!apiData.data?.all_days_data?.length) return [];

  const tokenMap = new Map();

  apiData.data.all_days_data.forEach((dayData) => {
    dayData.chains.forEach((chainData) => {
      chainData.tokens.forEach((token) => {
        // Sum up buy counts across all KOLs
        const totalBuyCount = token.kols_details.reduce(
          (sum, kol) => sum + kol.buy_count,
          0
        );

        tokenMap.set(token.token_address, {
          address: token.token_address,
          token_name: token.token_address.substring(0, 8) + '...', // No token name in API, using truncated address
          chain: chainData.chain,
          buy_counts:
            (tokenMap.get(token.token_address)?.buy_counts || 0) + totalBuyCount
        });
      });
    });
  });

  return Array.from(tokenMap.values())
    .sort((a, b) => b.buy_counts - a.buy_counts)
    .slice(0, 10);
};

const getMostActiveKols = (apiData: ApiResponse) => {
  if (!apiData.data?.all_days_data?.length) return [];

  const kolMap = new Map();

  apiData.data.all_days_data.forEach((dayData) => {
    dayData.chains.forEach((chainData) => {
      chainData.tokens.forEach((token) => {
        token.kols_details.forEach((kol) => {
          const key = `${chainData.chain}_${kol.address}`;

          if (kolMap.has(key)) {
            const existing = kolMap.get(key);
            kolMap.set(key, {
              ...existing,
              buy_counts: existing.buy_counts + kol.buy_count
            });
          } else {
            kolMap.set(key, {
              id: key,
              name: kol.twitter_name || 'Unknown',
              username: kol.twitter_username || 'unknown',
              buy_counts: kol.buy_count
            });
          }
        });
      });
    });
  });

  return Array.from(kolMap.values())
    .sort((a, b) => b.buy_counts - a.buy_counts)
    .slice(0, 10);
};

const formatTableData = (apiData: ApiResponse) => {
  if (!apiData.data?.all_days_data?.length) return [];

  const result: Array<{
    token_address: string;
    token_name: string;
    symbol: string;
    chain: string;
    is_signaled: boolean;
    buy_sum_counts: number;
    avg_buy_count: number;
    avg_sell_count: number;
    avg_buy_volume: number;
    avg_sell_volume: number;
    kols_details: Array<{
      chain: string;
      address: string;
      twitter_username: string;
      twitter_name: string;
      avatar: string;
      store_time: string;
      buy_counts: number;
      sell_counts: number;
      buy_volume: number;
      sell_volume: number;
      holding_time: number;
    }>;
  }> = [];

  apiData.data.all_days_data.forEach((dayData) => {
    dayData.chains.forEach((chainData) => {
      chainData.tokens.forEach((token) => {
        const kols_details = token.kols_details.map((kol) => ({
          chain: chainData.chain,
          address: kol.address,
          twitter_username: kol.twitter_username || 'unknown',
          twitter_name: kol.twitter_name || 'Unknown',
          avatar: kol.avatar || 'https://github.com/shadcn.png',
          store_time: chainData.store_time,
          buy_counts: kol.buy_count,
          sell_counts: kol.sell_count,
          buy_volume: kol.buy_volume,
          sell_volume: Math.abs(kol.sell_volume),
          holding_time: kol.holding_time
        }));

        result.push({
          token_address: token.token_address,
          token_name: token.token_address.substring(0, 8) + '...', // No token name in API, using truncated address
          symbol: chainData.chain.toUpperCase(),
          chain: chainData.chain,
          is_signaled: token.is_signaled,
          buy_sum_counts: kols_details.reduce(
            (sum, kol) => sum + kol.buy_counts,
            0
          ),
          avg_buy_count: token.avg_buy_count,
          avg_sell_count: token.avg_sell_count,
          avg_buy_volume: token.avg_buy_volume,
          avg_sell_volume: Math.abs(token.avg_sell_volume),
          kols_details: kols_details
        });
      });
    });
  });

  return result;
};

export default function KolPage() {
  const dateOptions = generateDateOptions();
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  const [allData, setAllData] = useState<ApiResponse | null>(null);
  const [topTokens, setTopTokens] = useState<any[]>([]);
  const [mostActiveKols, setMostActiveKols] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data only once when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Calculate timestamp for 3 days ago at 1:00 AM
        const three_days_ago = new Date();
        three_days_ago.setDate(three_days_ago.getDate() - 3);
        three_days_ago.setHours(1, 0, 0, 0);
        const startTimestamp = Math.floor(three_days_ago.getTime() / 1000);

        const response = await fetch(
          `/api/graph/kol_daily?base_ts=${startTimestamp}`
        );
        const apiData: ApiResponse = await response.json();

        setAllData(apiData);

        // Initial processing with default selected date
        processDataForSelectedDate(apiData, selectedDate);
      } catch (error) {
        console.error('Failed to fetch KOL data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array - only run once

  // Filter data by selected date without making new API calls
  const processDataForSelectedDate = (apiData: ApiResponse, date: string) => {
    if (!apiData?.data?.all_days_data?.length) return;

    // Convert selected date to timestamp for comparison
    const selectedDateObj = new Date(date);
    selectedDateObj.setHours(0, 0, 0, 0);
    const selectedDateTs = Math.floor(selectedDateObj.getTime() / 1000);

    // Filter the data for the selected date
    const filteredData = {
      ...apiData,
      data: {
        ...apiData.data,
        all_days_data: apiData.data.all_days_data.filter((dayData) => {
          const dayDate = new Date(dayData.date * 1000);
          const dayDateStart = new Date(dayDate);
          dayDateStart.setHours(0, 0, 0, 0);
          const dayTs = Math.floor(dayDateStart.getTime() / 1000);
          return dayTs === selectedDateTs;
        })
      }
    };

    // Process filtered data for charts and table
    setTopTokens(getTopTokensByBuyCount(filteredData));
    setMostActiveKols(getMostActiveKols(filteredData));
    setTableData(formatTableData(filteredData));
  };

  // Handle date change by filtering existing data
  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    if (allData) {
      setIsLoading(true);
      processDataForSelectedDate(allData, value);
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>KOL Trading Dashboard</h1>
        <div className='flex items-center'>
          <Select value={selectedDate} onValueChange={handleDateChange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select Date' />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {isLoading ? (
          <>
            <KolBarChartSkeleton />
            <KolBarChartSkeleton />
          </>
        ) : (
          <>
            <KolTokenBarChart data={topTokens} />
            <KolActiveBarChart data={mostActiveKols} />
          </>
        )}
      </div>

      <div className='mt-4'>
        {isLoading ? (
          <SimpleTableSkeleton columnCount={6} rowCount={8} />
        ) : (
          <KolTokenTable data={tableData} />
        )}
      </div>
    </div>
  );
}
