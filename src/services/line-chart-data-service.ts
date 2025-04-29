// src/services/line-chart-data-service.ts
import { delay } from '@/constants/mock-api';
import { LineChartDataPoint, LineChartResponse } from '@/models/chart';

// Mock API service class for line chart data
export class LineChartDataService {
  // Get line chart data method
  static async getLineChartData(): Promise<LineChartResponse> {
    // Simulate API delay
    await delay(1500);

    // Calculate dates for the last 7 days
    const now = new Date();
    const timestamps: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      timestamps.push(date.getTime());
    }

    // Generate data points
    const data: LineChartDataPoint[] = timestamps.map((timestamp) => {
      return {
        timestamp,
        value: Math.floor(Math.random() * 150) + 120, // Random value between 120-270
        date: new Date(timestamp).toISOString()
      };
    });

    // Return the complete response
    return {
      metadata: {
        title: 'Weekly Trend Analysis',
        description: 'User Activity Metrics',
        insight: {
          text: 'Activity trending up by 12% this week',
          trend: 'up',
          percentage: 12
        }
      },
      data
    };
  }
}
