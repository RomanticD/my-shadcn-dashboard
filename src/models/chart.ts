// src/models/chart.ts
// Base interfaces for all chart data types

export interface ChartMetadata {
  title: string;
  description: string;
  insight?: {
    text: string;
    trend: 'up' | 'down' | 'neutral';
    percentage?: number;
  };
}

// Bar Chart related interfaces
export interface BarChartDataPoint {
  date: string;
  desktop: number;
  mobile: number;
}

export interface BarChartResponse {
  metadata: ChartMetadata;
  data: BarChartDataPoint[];
  totals: {
    desktop: number;
    mobile: number;
  };
}

// Area Chart related interfaces
export interface AreaChartDataPoint {
  month: string;
  desktop: number;
  mobile: number;
}

export interface AreaChartResponse {
  metadata: ChartMetadata;
  data: AreaChartDataPoint[];
}

// Line Chart related interfaces
export interface LineChartDataPoint {
  timestamp: number;
  value: number;
  date: string;
}

export interface LineChartResponse {
  metadata: ChartMetadata;
  data: LineChartDataPoint[];
}

// Pie Chart related interfaces
export interface PieChartDataPoint {
  browser: string;
  visitors: number;
  fill: string;
}

export interface PieChartResponse {
  metadata: ChartMetadata;
  data: PieChartDataPoint[];
  total: number;
}
