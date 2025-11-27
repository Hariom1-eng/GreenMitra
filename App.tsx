import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  History, 
  Settings, 
  Leaf, 
  Menu,
  X,
  Droplets,
  Thermometer,
  FlaskConical,
  Activity
} from 'lucide-react';
import { SoilMetrics, TabView } from './types';
import { generateSoilData, getHistoricalData } from './services/mockDataService';
import { MOCK_HISTORY_LENGTH } from './constants';
import { MetricCard } from './components/MetricCard';
import { SoilCharts } from './components/SoilCharts';
import { AIAnalysis } from './components/AIAnalysis';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<TabView>(TabView.DASHBOARD);
  const [metrics, setMetrics] = useState<SoilMetrics>(generateSoilData());
  const [history, setHistory] = useState<SoilMetrics[]>(getHistoricalData(MOCK_HISTORY_LENGTH));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateSoilData();
      setMetrics(newData);
      setHistory(prev => {
        const newHistory = [...prev, newData];
        if (newHistory.length > MOCK_HISTORY_LENGTH) newHistory.shift();
        return newHistory;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: TabView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: TabView.AI_INSIGHTS, label: 'AI Insights', icon: Sprout },
    { id: TabView.HISTORY, label: 'History', icon: History },
    // { id: TabView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 text-emerald-700 font-bold text-xl">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Leaf className="w-6 h-6" />
            </div>
            AgriSoul
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                currentView === item.id 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-xl p-4 text-white">
            <p className="text-xs font-medium text-slate-400 mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold">Sensors Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
            <Leaf className="w-5 h-5" />
            AgriSoul
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white p-4">
             <div className="flex justify-end mb-4">
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-600">
                 <X />
               </button>
             </div>
             <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium ${
                    currentView === item.id 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-slate-500'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {currentView === TabView.DASHBOARD && 'Overview'}
                  {currentView === TabView.AI_INSIGHTS && 'Smart Analysis'}
                  {currentView === TabView.HISTORY && 'Data History'}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
                </p>
              </div>
              
              <div className="flex gap-3">
                 <button 
                  onClick={() => setMetrics(generateSoilData())}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                 >
                   Refresh Data
                 </button>
              </div>
            </div>

            {/* Dashboard View */}
            {currentView === TabView.DASHBOARD && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <MetricCard 
                    label="Nitrogen (N)" 
                    value={metrics.nitrogen} 
                    unit="ppm" 
                    type="nitrogen" 
                    icon={<Activity className="text-emerald-600 w-5 h-5" />}
                    colorClass="bg-emerald-500 text-emerald-600"
                  />
                  <MetricCard 
                    label="Phosphorus (P)" 
                    value={metrics.phosphorus} 
                    unit="ppm" 
                    type="phosphorus" 
                    icon={<Activity className="text-indigo-600 w-5 h-5" />}
                    colorClass="bg-indigo-500 text-indigo-600"
                  />
                  <MetricCard 
                    label="Potassium (K)" 
                    value={metrics.potassium} 
                    unit="ppm" 
                    type="potassium" 
                    icon={<Activity className="text-pink-600 w-5 h-5" />}
                    colorClass="bg-pink-500 text-pink-600"
                  />
                  <MetricCard 
                    label="pH Level" 
                    value={metrics.ph} 
                    unit="pH" 
                    type="ph" 
                    icon={<FlaskConical className="text-teal-600 w-5 h-5" />}
                    colorClass="bg-teal-500 text-teal-600"
                  />
                  <MetricCard 
                    label="Moisture" 
                    value={metrics.moisture} 
                    unit="%" 
                    type="moisture" 
                    icon={<Droplets className="text-blue-600 w-5 h-5" />}
                    colorClass="bg-blue-500 text-blue-600"
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                     <SoilCharts data={history} />
                  </div>
                  <div className="lg:col-span-1">
                    <div className="bg-emerald-900 rounded-xl p-6 text-white h-full relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Thermometer size={100} />
                       </div>
                       <h3 className="font-semibold text-emerald-100 mb-2">Soil Temperature</h3>
                       <div className="text-5xl font-bold mb-4">{metrics.temperature.toFixed(1)}°C</div>
                       <p className="text-sm text-emerald-200/80 leading-relaxed">
                         Optimal for root absorption. Keep monitoring during mid-day peaks to prevent moisture evaporation stress.
                       </p>
                       <div className="mt-8 pt-6 border-t border-emerald-800">
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-emerald-300">Daily Max</span>
                             <span className="font-bold">28.4°C</span>
                          </div>
                          <div className="flex justify-between items-center text-sm mt-2">
                             <span className="text-emerald-300">Daily Min</span>
                             <span className="font-bold">18.2°C</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* AI Insights View */}
            {currentView === TabView.AI_INSIGHTS && (
              <AIAnalysis currentMetrics={metrics} />
            )}

             {/* History View */}
             {currentView === TabView.HISTORY && (
               <div className="space-y-6">
                 <SoilCharts data={history} />
                 <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                   <div className="p-6 border-b border-slate-100">
                     <h3 className="font-semibold text-slate-800">Raw Data Log</h3>
                   </div>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-slate-500">
                       <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                         <tr>
                           <th className="px-6 py-3">Time</th>
                           <th className="px-6 py-3">N (ppm)</th>
                           <th className="px-6 py-3">P (ppm)</th>
                           <th className="px-6 py-3">K (ppm)</th>
                           <th className="px-6 py-3">pH</th>
                           <th className="px-6 py-3">Moisture %</th>
                           <th className="px-6 py-3">Temp °C</th>
                         </tr>
                       </thead>
                       <tbody>
                         {[...history].reverse().map((row, idx) => (
                           <tr key={idx} className="bg-white border-b hover:bg-slate-50">
                             <td className="px-6 py-4 font-medium text-slate-900">
                               {new Date(row.timestamp).toLocaleTimeString()}
                             </td>
                             <td className="px-6 py-4">{row.nitrogen}</td>
                             <td className="px-6 py-4">{row.phosphorus}</td>
                             <td className="px-6 py-4">{row.potassium}</td>
                             <td className="px-6 py-4">{row.ph}</td>
                             <td className="px-6 py-4">{row.moisture}</td>
                             <td className="px-6 py-4">{row.temperature}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </div>
             )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
