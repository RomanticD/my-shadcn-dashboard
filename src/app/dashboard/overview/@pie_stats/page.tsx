import { PieGraph } from '@/features/overview/components/pie-graph';
import { PieChartDataService } from '@/services/pie-chart-data-service';

export default async function PieStats() {
  // Fetch data using the service
  const response = await PieChartDataService.getPieChartData();

  // Pass the data to the component
  return (
    <PieGraph
      data={response.data}
      metadata={response.metadata}
      total={response.total}
    />
  );
}
