import {
  ChartMetadata,
  PlatformTradeData,
  ProcessedTradeDataPoint,
  TradeChartData,
  TradeLineChartResponse
} from '@/models/chart';

// Service class for trade line chart data
export class TradeLineChartService {
  private static API_URL = 'http://localhost:3222/api/graph/trade-line';

  // Get trade line chart data
  static async getTradeLineChartData(): Promise<TradeChartData> {
    try {
      const response = await fetch(this.API_URL);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseData: TradeLineChartResponse = await response.json();

      if (responseData.code !== 200) {
        throw new Error(
          `API returned error code ${responseData.code}: ${responseData.description}`
        );
      }

      return this.processTradeLineData(responseData.data);
    } catch (error) {
      console.error('Error fetching trade line chart data:', error);
      throw error;
    }
  }

  // Process the raw API data into a format suitable for the chart
  private static processTradeLineData(
    data: PlatformTradeData[]
  ): TradeChartData {
    const platforms = data.map((item) => item.platform);
    const processedData: ProcessedTradeDataPoint[] = [];
    const volumeTotals: Record<string, number> = {};
    const countTotals: Record<string, number> = {};
    const avgCountTotals: Record<string, number> = {};

    // Initialize totals
    platforms.forEach((platform) => {
      volumeTotals[platform] = 0;
      countTotals[platform] = 0;
      avgCountTotals[platform] = 0;
    });

    // Get all unique dates across all platforms
    const allDates = new Set<number>();
    data.forEach((platformData) => {
      platformData.volume.forEach((point) => allDates.add(point.date));
      platformData.count.forEach((point) => allDates.add(point.date));
      platformData.avg_count.forEach((point) => allDates.add(point.date));
    });

    // Sort dates in ascending order
    const sortedDates = Array.from(allDates).sort((a, b) => a - b);

    // Create processed data points for each date
    sortedDates.forEach((date) => {
      const dataPoint: ProcessedTradeDataPoint = {
        date,
        formattedDate: this.formatDate(date)
      };

      // Add volume and count data for each platform
      data.forEach((platformData) => {
        const platform = platformData.platform;

        // Find volume data for this date and platform
        const volumePoint = platformData.volume.find((p) => p.date === date);
        if (volumePoint) {
          dataPoint[`${platform}_volume`] = Math.round(volumePoint.value);
          volumeTotals[platform] += volumePoint.value;
        } else {
          dataPoint[`${platform}_volume`] = 0;
        }

        // Find count data for this date and platform
        const countPoint = platformData.count.find((p) => p.date === date);
        if (countPoint) {
          dataPoint[`${platform}_count`] = Math.round(countPoint.value);
          countTotals[platform] += countPoint.value;
        } else {
          dataPoint[`${platform}_count`] = 0;
        }

        // Find avg_count data for this date and platform
        const avgCountPoint = platformData.avg_count.find(
          (p) => p.date === date
        );
        if (avgCountPoint) {
          dataPoint[`${platform}_avg_count`] = Math.round(avgCountPoint.value);
          avgCountTotals[platform] += avgCountPoint.value;
        } else {
          dataPoint[`${platform}_avg_count`] = 0;
        }
      });

      processedData.push(dataPoint);
    });

    // Round the totals
    platforms.forEach((platform) => {
      volumeTotals[platform] = Math.round(volumeTotals[platform]);
      countTotals[platform] = Math.round(countTotals[platform]);
      avgCountTotals[platform] = Math.round(avgCountTotals[platform]);
    });

    const metadata: ChartMetadata = {
      title: 'Trading Platform Activity',
      description: 'Volume and transaction count across platforms',
      insight: {
        text: 'Trading volume trending up this month',
        trend: 'up'
      }
    };

    return {
      metadata,
      data: processedData,
      platforms,
      totals: {
        volume: volumeTotals,
        count: countTotals,
        avg_count: avgCountTotals
      }
    };
  }

  // Format timestamp to readable date
  private static formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
