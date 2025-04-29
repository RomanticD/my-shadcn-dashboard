import { LineGraph } from '@/features/overview/components/line-graph';
import { delay } from '@/constants/mock-api';

// Mock API function to simulate a real API request
async function fetchLineChartData() {
  // Simulate network delay
  await delay(1500);

  // Mock API response
  const response = {
    code: 200,
    description: 'Successfully generated mock line chart data',
    data: {
      title: {
        text: 'Weekly Trend Analysis',
        subtext: 'User Activity Metrics'
      },
      xAxis: {
        name: 'Category',
        data: [
          { value: 1711920000000, name: null },
          { value: 1712006400000, name: null },
          { value: 1712092800000, name: null },
          { value: 1712179200000, name: null },
          { value: 1712265600000, name: null },
          { value: 1712352000000, name: null },
          { value: 1712438400000, name: null }
        ]
      },
      yAxis: {
        name: 'Value',
        data: [
          { value: 0, name: null },
          { value: 20, name: null },
          { value: 40, name: null },
          { value: 60, name: null },
          { value: 80, name: null },
          { value: 100, name: null },
          { value: 120, name: null },
          { value: 140, name: null }
        ]
      },
      legend: null,
      series: [
        {
          type: 'line',
          data: [
            { value: 150, name: null },
            { value: 230, name: null },
            { value: 224, name: null },
            { value: 218, name: null },
            { value: 135, name: null },
            { value: 147, name: null },
            { value: 260, name: null }
          ]
        }
      ]
    }
  };

  return response;
}

export default async function LineStats() {
  const response = await fetchLineChartData();

  // Transform the API response into the format needed by LineGraph
  const chartData = response.data.xAxis.data.map((item, index) => {
    return {
      timestamp: item.value,
      value: response.data.series[0].data[index].value,
      date: new Date(item.value).toISOString()
    };
  });

  return (
    <LineGraph
      data={chartData}
      title={response.data.title.text}
      subtext={response.data.title.subtext}
    />
  );
}
