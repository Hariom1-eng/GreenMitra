import { SoilMetrics } from '../types';

// Helper to get random number within range
const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

// Initial baseline
let currentMetrics: SoilMetrics = {
  nitrogen: 35,
  phosphorus: 28,
  potassium: 150,
  ph: 6.8,
  moisture: 60,
  temperature: 24,
  timestamp: new Date().toISOString(),
};

export const generateSoilData = (): SoilMetrics => {
  // Drift the values slightly to simulate sensor fluctuation
  const drift = (val: number, spread: number) => {
    const change = (Math.random() - 0.5) * spread;
    return Number((val + change).toFixed(1));
  };

  currentMetrics = {
    nitrogen: Math.max(0, drift(currentMetrics.nitrogen, 2)),
    phosphorus: Math.max(0, drift(currentMetrics.phosphorus, 2)),
    potassium: Math.max(0, drift(currentMetrics.potassium, 5)),
    ph: Math.min(14, Math.max(0, drift(currentMetrics.ph, 0.1))),
    moisture: Math.min(100, Math.max(0, drift(currentMetrics.moisture, 3))),
    temperature: drift(currentMetrics.temperature, 0.5),
    timestamp: new Date().toISOString(),
  };

  return { ...currentMetrics };
};

export const getHistoricalData = (count: number): SoilMetrics[] => {
  const history: SoilMetrics[] = [];
  // Generate past data
  for (let i = 0; i < count; i++) {
    // Reverse simulated generation
    const fakeData = generateSoilData();
    const date = new Date();
    date.setMinutes(date.getMinutes() - (count - i));
    fakeData.timestamp = date.toISOString();
    history.push(fakeData);
  }
  return history;
};
