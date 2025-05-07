import { delay } from '@/constants/mock-api';
import { PieChartDataPoint, PieChartResponse } from '@/models/chart';

// Mock API service class for pie chart data
export class PieChartDataService {
  // Get pie chart data method
  static async getPieChartData(): Promise<PieChartResponse> {
    // Simulate API delay
    await delay(1500);

    // Mock data
    const chartData: PieChartDataPoint[] = [
      { browser: 'chrome', visitors: 275, fill: 'var(--primary)' },
      { browser: 'safari', visitors: 200, fill: 'var(--primary-light)' },
      { browser: 'firefox', visitors: 287, fill: 'var(--primary-lighter)' },
      { browser: 'edge', visitors: 173, fill: 'var(--primary-dark)' },
      { browser: 'other', visitors: 190, fill: 'var(--primary-darker)' }
    ];

    // Calculate total
    const total = chartData.reduce((acc, curr) => acc + curr.visitors, 0);

    // Return the complete response
    return {
      metadata: {
        title: 'Pie Chart - Donut with Text',
        description: 'Total visitors by browser for the last 6 months',
        insight: {
          text: `Chrome leads with ${((chartData[0].visitors / total) * 100).toFixed(1)}%`,
          trend: 'up',
          percentage: (chartData[0].visitors / total) * 100
        }
      },
      data: chartData,
      total
    };
  }
}
