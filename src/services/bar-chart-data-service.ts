// src/services/bar-chart-data-service.ts
import { delay } from '@/constants/mock-api';
import {
  BarChartDataPoint,
  BarChartResponse,
  ChartMetadata
} from '@/models/chart';

// Mock API service class for bar chart data
export class BarChartDataService {
  // Get bar chart data method
  static async getBarChartData(): Promise<BarChartResponse> {
    // Simulate API delay
    await delay(1500);

    // Mock data - this could be replaced with an actual API call later
    const chartData: BarChartDataPoint[] = [
      { date: '2024-04-01', desktop: 222, mobile: 150 },
      { date: '2024-04-02', desktop: 97, mobile: 180 },
      { date: '2024-04-03', desktop: 167, mobile: 120 },
      { date: '2024-04-04', desktop: 242, mobile: 260 },
      { date: '2024-04-05', desktop: 373, mobile: 290 },
      { date: '2024-04-06', desktop: 301, mobile: 340 },
      { date: '2024-04-07', desktop: 245, mobile: 180 },
      { date: '2024-04-08', desktop: 409, mobile: 320 },
      { date: '2024-04-09', desktop: 59, mobile: 110 },
      { date: '2024-04-10', desktop: 261, mobile: 190 },
      { date: '2024-04-11', desktop: 327, mobile: 350 },
      { date: '2024-04-12', desktop: 292, mobile: 210 },
      { date: '2024-04-13', desktop: 342, mobile: 380 },
      { date: '2024-04-14', desktop: 137, mobile: 220 },
      { date: '2024-04-15', desktop: 120, mobile: 170 },
      { date: '2024-04-16', desktop: 138, mobile: 190 },
      { date: '2024-04-17', desktop: 446, mobile: 360 },
      { date: '2024-04-18', desktop: 364, mobile: 410 },
      { date: '2024-04-19', desktop: 243, mobile: 180 },
      { date: '2024-04-20', desktop: 89, mobile: 150 },
      { date: '2024-04-21', desktop: 327, mobile: 350 },
      { date: '2024-04-22', desktop: 292, mobile: 210 },
      { date: '2024-04-23', desktop: 342, mobile: 380 },
      { date: '2024-04-24', desktop: 137, mobile: 220 },
      { date: '2024-04-25', desktop: 120, mobile: 170 },
      { date: '2024-04-26', desktop: 138, mobile: 190 },
      { date: '2024-04-27', desktop: 446, mobile: 360 },
      { date: '2024-04-28', desktop: 364, mobile: 410 },
      { date: '2024-04-29', desktop: 243, mobile: 180 },
      { date: '2024-04-30', desktop: 89, mobile: 150 },
      { date: '2024-06-30', desktop: 446, mobile: 400 }
    ];

    // Calculate totals
    const totals = chartData.reduce(
      (acc, curr) => {
        return {
          desktop: acc.desktop + curr.desktop,
          mobile: acc.mobile + curr.mobile
        };
      },
      { desktop: 0, mobile: 0 }
    );

    // Return complete response
    return {
      metadata: {
        title: 'Bar Chart - Interactive',
        description: 'Total for the last 3 months',
        insight: {
          text: 'Desktop traffic increased by 15% over previous period',
          trend: 'up',
          percentage: 15
        }
      },
      data: chartData,
      totals
    };
  }
}
