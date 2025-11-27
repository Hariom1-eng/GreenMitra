import React, { useState } from 'react';
import { SoilMetrics, SoilAnalysisResult } from '../types';
import { analyzeSoilHealth } from '../services/geminiService';
import { Bot, Sprout, Loader2, AlertCircle, CheckCircle, Droplets, ListChecks } from 'lucide-react';

interface AIAnalysisProps {
  currentMetrics: SoilMetrics;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ currentMetrics }) => {
  const [analysis, setAnalysis] = useState<SoilAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeSoilHealth(currentMetrics);
      setAnalysis(result);
    } catch (err: any) {
      setError("Failed to generate analysis. Please ensure your API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Bot size={120} />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Bot className="w-6 h-6" />
            Gemini Soil Intelligence
          </h2>
          <p className="text-emerald-100 max-w-xl mb-6">
            Use advanced AI to analyze your soil's nutrient composition, receive crop recommendations, and generate a customized fertilizer plan.
          </p>
          
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sprout className="w-5 h-5" />}
            {loading ? 'Analyzing Soil Data...' : 'Generate Health Report'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Main Score Card */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                 <circle
                   cx="64"
                   cy="64"
                   r="56"
                   stroke={analysis.healthScore > 75 ? "#10b981" : analysis.healthScore > 50 ? "#f59e0b" : "#ef4444"}
                   strokeWidth="12"
                   fill="none"
                   strokeDasharray={351}
                   strokeDashoffset={351 - (351 * analysis.healthScore) / 100}
                   strokeLinecap="round"
                 />
               </svg>
               <span className="absolute text-3xl font-bold text-slate-800">{analysis.healthScore}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{analysis.status} Condition</h3>
            <p className="text-slate-500 mt-2 text-sm">{analysis.summary}</p>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
             {/* Recommendations */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <ListChecks className="w-5 h-5 text-emerald-600" />
                  Actionable Recommendations
                </h4>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
                      <div className="min-w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                      {rec}
                    </li>
                  ))}
                </ul>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <Sprout className="w-5 h-5 text-emerald-600" />
                    Suitable Crops
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.suitableCrops.map((crop, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">
                        {crop}
                      </span>
                    ))}
                  </div>
               </div>

               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <Droplets className="w-5 h-5 text-sky-600" />
                    Fertilizer Plan
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {analysis.fertilizerPlan}
                  </p>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
