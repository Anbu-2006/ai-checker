import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  History as HistoryIcon,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  Play,
  RotateCcw,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { benchmarkHistory } from '../lib/mockData';

export default function History() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = benchmarkHistory.filter((run) => {
    const matchesSearch =
      run.id.toLowerCase().includes(search.toLowerCase()) ||
      run.models.join(' ').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (status: string) => {
    if (status === 'completed')
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      );
    if (status === 'running')
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Loader2 className="w-3 h-3 animate-spin" /> Running
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
        <XCircle className="w-3 h-3" /> Failed
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-heading font-bold text-white"
        >
          Benchmark <span className="gradient-text">History</span>
        </motion.h2>
        <p className="text-slate-400 mt-1">Track and review all benchmark runs</p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or model name..."
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* History List */}
      <div className="space-y-3">
        {filtered.map((run, idx) => (
          <motion.div
            key={run.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="glass-card overflow-hidden"
          >
            <button
              onClick={() => setExpandedRow(expandedRow === run.id ? null : run.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center bg-violet-500/10">
                  <HistoryIcon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-semibold text-white text-sm">{run.id}</span>
                    {statusBadge(run.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{run.date} · {run.models.join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {run.status === 'completed' && (
                  <div className="hidden md:flex items-center gap-6 text-xs">
                    <div className="text-center">
                      <p className="text-slate-500">Duration</p>
                      <p className="text-slate-300 font-medium">{run.duration}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500">Avg Latency</p>
                      <p className="text-slate-300 font-medium">{run.avgLatency}ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500">Score</p>
                      <p className="text-white font-bold">{run.score}</p>
                    </div>
                  </div>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedRow === run.id ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {expandedRow === run.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-white/5"
              >
                <div className="p-5 bg-white/[0.01]">
                  {run.status === 'completed' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800/30 rounded-xl p-3">
                          <p className="text-xs text-slate-500 mb-1">Duration</p>
                          <p className="text-lg font-heading font-bold text-white">{run.duration}</p>
                        </div>
                        <div className="bg-slate-800/30 rounded-xl p-3">
                          <p className="text-xs text-slate-500 mb-1">Avg Latency</p>
                          <p className="text-lg font-heading font-bold text-blue-400">{run.avgLatency}ms</p>
                        </div>
                        <div className="bg-slate-800/30 rounded-xl p-3">
                          <p className="text-xs text-slate-500 mb-1">Throughput</p>
                          <p className="text-lg font-heading font-bold text-violet-400">{run.avgThroughput}%</p>
                        </div>
                        <div className="bg-slate-800/30 rounded-xl p-3">
                          <p className="text-xs text-slate-500 mb-1">Overall Score</p>
                          <p className="text-lg font-heading font-bold gradient-text">{run.score}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 transition-all">
                          <Play className="w-3.5 h-3.5" /> Re-run
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-white/10 text-slate-400 hover:bg-white/[0.03] transition-all">
                          <ExternalLink className="w-3.5 h-3.5" /> View Details
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-white/10 text-slate-400 hover:bg-white/[0.03] transition-all">
                          <RotateCcw className="w-3.5 h-3.5" /> Restore
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ) : run.status === 'running' ? (
                    <div className="flex items-center gap-3 text-sm text-blue-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Benchmark in progress... Results will appear here when complete.
                    </div>
                  ) : (
                    <div className="text-sm text-red-400">
                      Benchmark failed due to connection timeout. Please check model configurations and try again.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}