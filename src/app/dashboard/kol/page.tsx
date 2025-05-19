'use client';

import { useState, useEffect } from 'react';
import { KolTokenBarChart } from '@/features/group/kol_trade/components/kol-token-bar-chart';
import { KolActiveBarChart } from '@/features/group/kol_trade/components/kol-active-bar-chart';
import { KolTokenTable } from '@/features/group/kol_trade/components/kol-token-table';
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

  useEffect(() => {
    // In a real app, fetch data from API
    const mockData = generateMockData();
    setData(mockData);

    // Process data for charts and table
    setTopTokens(getTopTokensByBuyCount(mockData));
    setMostActiveKols(getMostActiveKols(mockData));
    setTableData(formatTableData(mockData));
  }, []);

  return (
    <div className='container mx-auto mb-4 space-y-6 p-6 pb-8'>
      <h1 className='text-3xl font-bold'>KOL Trading Dashboard</h1>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <KolTokenBarChart data={topTokens} />
        <KolActiveBarChart data={mostActiveKols} />
      </div>

      <div className='bg-background rounded-lg border shadow-sm'>
        <KolTokenTable data={tableData} />
      </div>
    </div>
  );
}
