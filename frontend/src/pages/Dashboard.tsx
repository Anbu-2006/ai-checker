import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Clock,
  Zap,
  Activity,
  DollarSign,
  Star,
  ArrowUpCircle,
  Maximize,
  AlertTriangle,
  Play,
  Plug,
  Plus
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { LatencyChart, ThroughputChart, QualityRadarChart, TokenUsageChart } from '../components/Chart';
import {
  latencyTimeSeries,
  throughputTimeSeries,
  qualityRadar,
  tokenUsageData,
  liveMetrics,
  models as initialModels,
} from '../lib/mockData';


interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [models, setModels] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('aiModels');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [prompt, setPrompt] = useState('Explain quantum computing to a 5-year-old.');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState<any[]>(() => {
    const savedRes = localStorage.getItem('aiBenchmarkHistory');
    return savedRes ? JSON.parse(savedRes) : [];
  });

  useEffect(() => {
    localStorage.setItem('aiBenchmarkHistory', JSON.stringify(benchmarkResults));
  }, [benchmarkResults]);

  const runBenchmark = async () => {
    if (models.length === 0) return alert('Add at least one model in Setup first.');
    setIsBenchmarking(true);
    try {
      const res = await axios.post('http://localhost:5000/api/benchmarks/run', {
        models,
        prompt
      });
      if (res.data.success) {
        setBenchmarkResults(res.data.results);
      }
    } catch (e) {
      console.error(e);
      alert('Error running benchmark');
    }
    setIsBenchmarking(false);
  };

  const connectedModels = models; // Assuming all added are "connected"
  const defaultMetrics = { latency: 0, tokensPerSec: 0, throughput: 0, cost: 0, quality: 0, contextWindow: 0, errorRate: 0, uptime: 0 };
  const getPrimaryMetrics = () => {
    if (benchmarkResults.length > 0) {
      const best = benchmarkResults[0]; // just picking the first model for overall dashboard view
      return {
        latency: best.latency,
        tokensPerSec: best.tokensPerSecond,
        throughput: best.throughput,
        cost: best.cost,
        quality: 95, // Mocking quality for now
        contextWindow: 128000,
        errorRate: 0,
        uptime: 99.99
      };
    }
    return defaultMetrics;
  };

  const m = getPrimaryMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-heading font-bold text-white"
          >
            Performance <span className="gradient-text">Dashboard</span>
          </motion.h2>
          <p className="text-slate-400 mt-1">Real-time metrics across {connectedModels.length} active models</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 metric-indicator" />
            <span className="text-xs font-medium text-emerald-400">Live</span>
          </div>
        </div>
      </div>

      {models.length === 0 ? (
        <div className="glass-card p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto border-violet-500/20 shadow-lg mt-12 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4 text-violet-400">
            <Plug className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-heading font-bold text-white mb-2">No Models Configured</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Connect your local LLMs (via Ollama or custom endpoints) or cloud APIs (OpenAI, Anthropic, Groq) to start benchmarking and comparing latency, cost, and speed.
          </p>
          <button
            onClick={() => onNavigate('models')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            <Plus className="w-4 h-4" /> Add Your First Model
          </button>
        </div>
      ) : (
        <>
          {/* Benchmark Action Area */}
          <div className="glass-card p-6 flex flex-col md:flex-row gap-4 items-center">
             <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Enter test prompt..."
                className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
             />
             <button 
               onClick={runBenchmark} disabled={isBenchmarking}
               className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
               style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
             >
               {isBenchmarking ? <AlertTriangle className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
               {isBenchmarking ? 'Running Benchmarks...' : 'Run Benchmark'}
             </button>
          </div>

          {benchmarkResults.length > 0 && (
             <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Recent Run Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {benchmarkResults.map((res: any) => (
                      <div key={res.modelId} className="bg-slate-800/50 p-4 rounded-lg">
                         <p className="font-bold text-violet-400">{res.modelName}</p>
                         <p className="text-sm text-slate-300">Latency: {res.latency} ms | Speed: {res.tokensPerSecond} tok/s | Cost: ${res.cost}</p>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Avg Latency"
              value={m.latency}
              unit="ms"
              change={-3.2}
              icon={<Clock className="w-5 h-5" />}
              color="blue"
              delay={0}
            />
            <MetricCard
              title="Tokens/sec"
              value={m.tokensPerSec}
              unit="tok/s"
              change={5.1}
              icon={<Zap className="w-5 h-5" />}
              color="violet"
              delay={0.05}
            />
            <MetricCard
              title="Throughput"
              value={m.throughput}
              unit="%"
              change={1.8}
              icon={<Activity className="w-5 h-5" />}
              color="cyan"
              delay={0.1}
            />
            <MetricCard
              title="Cost/1K tokens"
              value={`$${m.cost}`}
              change={-2.4}
              icon={<DollarSign className="w-5 h-5" />}
              color="pink"
              delay={0.15}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Quality Score"
              value={m.quality}
              unit="/100"
              change={0.9}
              icon={<Star className="w-5 h-5" />}
              color="amber"
              delay={0.2}
            />
            <MetricCard
              title="Uptime"
              value={m.uptime}
              unit="%"
              change={0.01}
              icon={<ArrowUpCircle className="w-5 h-5" />}
              color="green"
              delay={0.25}
            />
            <MetricCard
              title="Context Window"
              value={m.contextWindow.toLocaleString()}
              unit="tokens"
              icon={<Maximize className="w-5 h-5" />}
              color="blue"
              delay={0.3}
            />
            <MetricCard
              title="Error Rate"
              value={m.errorRate}
              unit="%"
              change={-12.0}
              icon={<AlertTriangle className="w-5 h-5" />}
              color="pink"
              delay={0.35}
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-white">Latency Over Time</h3>
                <span className="text-xs text-slate-500">ms · 12h window</span>
              </div>
              <LatencyChart data={latencyTimeSeries} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-white">Throughput Trends</h3>
                <span className="text-xs text-slate-500">% · 12h window</span>
              </div>
              <ThroughputChart data={throughputTimeSeries} />
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-white">Quality Radar</h3>
                <span className="text-xs text-slate-500">Multi-dimensional scoring</span>
              </div>
              <QualityRadarChart data={qualityRadar} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-white">Token Usage</h3>
                <span className="text-xs text-slate-500">7-day volume</span>
              </div>
              <TokenUsageChart data={tokenUsageData} />
            </motion.div>
          </div>

          {/* Active Models Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-white">Active Models</h3>
              <span className="text-xs text-slate-500">{connectedModels.length} connected</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                    <th className="text-left py-3 px-4">Model</th>
                    <th className="text-left py-3 px-4">Provider</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-right py-3 px-4">Latency</th>
                    <th className="text-right py-3 px-4">Tok/s</th>
                    <th className="text-right py-3 px-4">Quality</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((model) => {
                    const result = benchmarkResults.find((r: any) => r.modelId === model.id);
                    const metrics = result ? {
                      latency: `${result.latency}ms`,
                      tokensPerSec: result.tokensPerSecond,
                      quality: 95,
                    } : (liveMetrics[model.id] ? {
                      latency: `${liveMetrics[model.id].latency}ms`,
                      tokensPerSec: liveMetrics[model.id].tokensPerSec,
                      quality: liveMetrics[model.id].quality,
                    } : {
                      latency: '—',
                      tokensPerSec: '—',
                      quality: '—'
                    });
                    return (
                      <tr key={model.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-medium text-white">{model.name}</td>
                        <td className="py-3 px-4 text-slate-400">{model.provider}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                            model.type === 'api' ? 'bg-blue-500/10 text-blue-400' : 'bg-cyan-500/10 text-cyan-400'
                          }`}>
                            {model.type === 'api' ? 'API' : 'Local'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-300">{metrics.latency}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{metrics.tokensPerSec}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{metrics.quality}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${
                            model.status === 'connected'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : model.status === 'testing'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-slate-500/10 text-slate-400'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              model.status === 'connected' ? 'bg-emerald-400' : model.status === 'testing' ? 'bg-amber-400' : 'bg-slate-500'
                            }`} />
                            {model.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}