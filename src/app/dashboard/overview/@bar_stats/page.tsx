import { BarGraph } from '@/features/overview/components/bar-graph';
import { ChartDataService } from '@/services/chart-data-service';

export default async function BarStats() {
  // 使用服务获取数据
  const chartData = await ChartDataService.getBarChartData();

  // 将获取的数据传递给组件
  return (
    <BarGraph
      data={chartData.data}
      metadata={chartData.metadata}
      totals={chartData.totals}
    />
  );
}
