import { AreaGraph } from '@/features/overview/components/area-graph';
import { TradeLineChartService } from '@/services/trade-line-chart-service';

export default async function AreaStats() {
  // Fetch data using the service
  const chartData = await TradeLineChartService.getTradeLineChartData();

  // Pass the data to the component
  return <AreaGraph data={chartData} />;
}
