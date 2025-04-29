// src/services/area-chart-data-service.ts
import { delay } from '@/constants/mock-api';
import { AreaChartDataPoint, AreaChartResponse } from '@/models/chart';

// Mock API service class for area chart data
export class AreaChartDataService {
  // Get area chart data method
  static async getAreaChartData(): Promise<AreaChartResponse> {
    // Simulate API delay
    await delay(2000);

    // Mock data
    const chartData: AreaChartDataPoint[] = [
      { month: 'January', desktop: 186, mobile: 80 },
      { month: 'February', desktop: 305, mobile: 200 },
      { month: 'March', desktop: 237, mobile: 120 },
      { month: 'April', desktop: 73, mobile: 190 },
      { month: 'May', desktop: 209, mobile: 130 },
      { month: 'June', desktop: 214, mobile: 140 }
    ];

    // Return the complete response
    return {
      metadata: {
        title: 'Area Chart - Stacked',
        description: 'Showing total visitors for the last 6 months',
        insight: {
          text: 'Trending up by 5.2% this month',
          trend: 'up',
          percentage: 5.2
        }
      },
      data: chartData
    };
  }
}
