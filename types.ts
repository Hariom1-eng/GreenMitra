export interface SoilMetrics {
  nitrogen: number; // ppm
  phosphorus: number; // ppm
  potassium: number; // ppm
  ph: number; // 0-14
  moisture: number; // %
  temperature: number; // Celsius
  timestamp: string;
}

export interface SoilAnalysisResult {
  healthScore: number;
  status: 'Critical' | 'Poor' | 'Average' | 'Good' | 'Excellent';
  summary: string;
  recommendations: string[];
  suitableCrops: string[];
  fertilizerPlan: string;
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  AI_INSIGHTS = 'AI_INSIGHTS',
  SETTINGS = 'SETTINGS'
}
