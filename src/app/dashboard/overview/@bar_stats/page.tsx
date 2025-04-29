import { BarGraph } from '@/features/overview/components/bar-graph';
import { BarChartDataService } from '@/services/bar-chart-data-service';

export default async function BarStats() {
  // Fetch data using the service
  const chartData = await BarChartDataService.getBarChartData();

  // Pass the data to the component
  return (
    <BarGraph
      data={chartData.data}
      metadata={chartData.metadata}
      totals={chartData.totals}
    />
  );
}
