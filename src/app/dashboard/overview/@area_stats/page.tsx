import { AreaGraph } from '@/features/overview/components/area-graph';
import { AreaChartDataService } from '@/services/area-chart-data-service';

export default async function AreaStats() {
  // Fetch data using the AreaChartDataService
  const response = await AreaChartDataService.getAreaChartData();

  // Pass both data and metadata to the AreaGraph component
  return <AreaGraph data={response.data} metadata={response.metadata} />;
}
