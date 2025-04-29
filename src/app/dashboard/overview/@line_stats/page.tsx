import { LineGraph } from '@/features/overview/components/line-graph';
import { LineChartDataService } from '@/services/line-chart-data-service';

export default async function LineStats() {
  // Fetch data using the service
  const response = await LineChartDataService.getLineChartData();

  return (
    <LineGraph
      data={response.data}
      title={response.metadata.title}
      subtext={response.metadata.description}
    />
  );
}
