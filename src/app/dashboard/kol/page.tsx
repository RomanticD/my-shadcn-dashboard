'use client';

import { useState, useEffect, Suspense } from 'react';
import { KolTokenBarChart } from '@/features/group/kol_trade/components/kol-token-bar-chart';
import { KolActiveBarChart } from '@/features/group/kol_trade/components/kol-active-bar-chart';
import { KolTokenTable } from '@/features/group/kol_trade/components/kol-token-table';
import { KolBarChartSkeleton } from '@/features/group/kol_trade/components/kol-bar-chart-skeleton';
import { SimpleTableSkeleton } from '@/components/ui/table/simple-table-skeleton';
import {
  ChainData,
  generateMockData,
  getTopTokensByBuyCount,
  getMostActiveKols,
  formatTableData
} from '@/constants/mock_kol_api';

export default function KolPage() {
  const [data, setData] = useState<ChainData[]>([]);
  const [topTokens, setTopTokens] = useState<any[]>([]);
  const [mostActiveKols, setMostActiveKols] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to true initially
    setIsLoading(true);

    // In a real app, fetch data from API
    const mockData = generateMockData();

    // Add artificial delay to simulate network request
    setTimeout(() => {
      setData(mockData);

      // Process data for charts and table
      setTopTokens(getTopTokensByBuyCount(mockData));
      setMostActiveKols(getMostActiveKols(mockData));
      setTableData(formatTableData(mockData));

      // Set loading to false after data is processed
      setIsLoading(false);
    }, 2000); // 2 second delay
  }, []);

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h1 className='text-3xl font-bold'>KOL Trading Dashboard</h1>

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
