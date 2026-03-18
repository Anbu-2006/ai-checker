import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitCompareArrows,
  Trophy,
  ArrowDown,
  ArrowUp,
  Check,
} from 'lucide-react';
import { QualityRadarChart } from '../components/Chart';
import { comparisonData, qualityRadar, models } from '../lib/mockData';

const modelColors: Record<string, string> = {
  gpt4: '#3b82f6',
  claude3: '#8b5cf6',
  llama3: '#06b6d4',
  mistral: '#f472b6',
};

const modelNames: Record<string, string> = {
  gpt4: 'GPT-4o (Omni)',
  claude3: 'Claude 3.7 Sonnet',
  llama3: 'Llama 3.3 70B',
  mistral: 'Mistral Large 2',
};

export default function Comparison() {
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt4', 'claude3', 'llama3', 'mistral']);

  const toggleModel = (id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? (prev.length > 2 ? prev.filter((m) => m !== id) : prev) : [...prev, id]
    );
  };

  const getBestValue = (metric: typeof comparisonData[0]) => {
    const vals = selectedModels.map((id) => metric[id as keyof typeof metric] as number);
    return metric.lower ? Math.min(...vals) : Math.max(...vals);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-heading font-bold text-white"
          >
            Multi-Model <span className="gradient-text">Comparison</span>
          </motion.h2>
          <p className="text-slate-400 mt-1">Side-by-side benchmark analysis across {selectedModels.length} models</p>
        </div>
      </div>

      {/* Model Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <GitCompareArrows className="w-4 h-4 text-violet-400" />
          <h3 className="font-heading font-semibold text-white text-sm">Select Models to Compare</h3>
          <span className="text-xs text-slate-500 ml-2">(minimum 2)</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(modelNames).map(([id, name]) => (
            <button
              key={id}
              onClick={() => toggleModel(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                selectedModels.includes(id)
                  ? 'border-transparent text-white'
                  : 'border-white/10 text-slate-400 hover:bg-white/[0.03]'
              }`}
              style={
                selectedModels.includes(id)
                  ? { background: `${modelColors[id]}20`, borderColor: `${modelColors[id]}40`, color: modelColors[id] }
                  : undefined
              }
            >
              {selectedModels.includes(id) && <Check className="w-3.5 h-3.5" />}
              {name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-5 border-b border-white/5">
          <h3 className="font-heading font-semibold text-white">Detailed Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="text-left py-3 px-5">Metric</th>
                {selectedModels.map((id) => (
                  <th key={id} className="text-center py-3 px-5">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: modelColors[id] }} />
                      <span className="text-slate-300">{modelNames[id]}</span>
                    </div>
                  </th>
                ))}
                <th className="text-center py-3 px-5">Best</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row) => {
                const best = getBestValue(row);
                return (
                  <tr key={row.metric} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-5 font-medium text-slate-300">{row.metric}</td>
                    {selectedModels.map((id) => {
                      const val = row[id as keyof typeof row] as number;
                      const isBest = val === best;
                      return (
                        <td key={id} className="py-3 px-5 text-center">
                          <span className={`inline-flex items-center gap-1 ${isBest ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                            {isBest && <Trophy className="w-3 h-3" />}
                            {typeof val === 'number' && val >= 1000 ? val.toLocaleString() : val}
                            <span className="text-slate-600 text-xs">{row.unit}</span>
                          </span>
                        </td>
                      );
                    })}
                    <td className="py-3 px-5 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        {row.lower ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                        {row.lower ? 'Lower' : 'Higher'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quality Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-white">Quality Comparison Radar</h3>
          <span className="text-xs text-slate-500">Multi-dimensional quality scores</span>
        </div>
        <QualityRadarChart data={qualityRadar} />
      </motion.div>

      {/* Score Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedModels.map((id, idx) => {
          const model = models.find((m) => m.id === id);
          const color = modelColors[id];
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="glass-card p-5 relative overflow-hidden"
              style={{ borderColor: `${color}30` }}
            >
              <div
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20"
                style={{ background: color }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                  <h4 className="font-heading font-semibold text-white text-sm">{modelNames[id]}</h4>
                </div>
                <div className="space-y-2">
                  {comparisonData.slice(0, 4).map((row) => (
                    <div key={row.metric} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{row.metric}</span>
                      <span className="text-slate-300 font-medium">{row[id as keyof typeof row] as number} {row.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}