import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileDown,
  FileText,
  FileSpreadsheet,
  FileJson,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  BarChart3,
  Table,
  Image,
  Share2,
  Mail,
  Copy,
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  format: string;
  lastGenerated: string;
  size: string;
}

const templates: ReportTemplate[] = [
  {
    id: 'perf-summary',
    name: 'Performance Summary',
    description: 'Comprehensive overview of all model benchmarks with key metrics and trends.',
    icon: <BarChart3 className="w-5 h-5" />,
    format: 'PDF',
    lastGenerated: '2 hours ago',
    size: '2.4 MB',
  },
  {
    id: 'comparison-report',
    name: 'Multi-Model Comparison',
    description: 'Detailed side-by-side analysis of selected models across all metrics.',
    icon: <Table className="w-5 h-5" />,
    format: 'PDF',
    lastGenerated: '1 day ago',
    size: '3.1 MB',
  },
  {
    id: 'raw-data',
    name: 'Raw Benchmark Data',
    description: 'Complete raw data export with all measurements, timestamps, and metadata.',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    format: 'CSV',
    lastGenerated: '3 hours ago',
    size: '890 KB',
  },
  {
    id: 'json-export',
    name: 'JSON Data Export',
    description: 'Structured JSON export for programmatic access to benchmark results.',
    icon: <FileJson className="w-5 h-5" />,
    format: 'JSON',
    lastGenerated: '5 hours ago',
    size: '1.2 MB',
  },
  {
    id: 'visual-report',
    name: 'Visual Report Pack',
    description: 'High-resolution charts and graphs suitable for presentations and publications.',
    icon: <Image className="w-5 h-5" />,
    format: 'PNG+PDF',
    lastGenerated: '6 hours ago',
    size: '8.7 MB',
  },
  {
    id: 'exec-summary',
    name: 'Executive Summary',
    description: 'Concise one-page summary with key findings and recommendations for stakeholders.',
    icon: <FileText className="w-5 h-5" />,
    format: 'PDF',
    lastGenerated: '1 day ago',
    size: '450 KB',
  },
];

const recentExports = [
  { name: 'Q4-2024-Benchmark-Report.pdf', date: 'Jan 15, 2025', size: '2.4 MB', format: 'PDF' },
  { name: 'Model-Comparison-GPT4-Claude3.csv', date: 'Jan 14, 2025', size: '345 KB', format: 'CSV' },
  { name: 'Full-Benchmark-Data.json', date: 'Jan 13, 2025', size: '1.2 MB', format: 'JSON' },
  { name: 'Presentation-Charts.zip', date: 'Jan 12, 2025', size: '8.7 MB', format: 'ZIP' },
];

export default function Reports() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('last-7-days');

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      
      let filename = 'report.txt';
      let content = 'Mock report content';
      let contentType = 'text/plain';
      
      if (id === 'perf-summary') {
        filename = 'NeuralBench-Performance-Summary.txt';
        content = `=======================================\nNEURALBENCH PERFORMANCE SUMMARY REPORT\n=======================================\nGenerated on: ${new Date().toLocaleString()}\nDate Range: ${dateRange}\n\nKey Findings:\n- Claude 3 Opus remains the most accurate model across logical reasoning.\n- Llama 3 70B (Local) provides outstanding latency metrics (under 130ms average) at zero usage cost.\n- GPT-4 Turbo leads token throughput volume.\n\nThank you for using NeuralBench.`;
      } else if (id === 'comparison-report') {
        filename = 'NeuralBench-Comparison-Matrix.csv';
        content = `Metric,GPT-4 Turbo,Claude 3 Opus,Llama 3 70B,Mistral Large,Unit,Direction\nLatency,340,280,120,310,ms,lower_is_better\nTokens/sec,42,56,78,48,tok/s,higher_is_better\nThroughput,89.2,92.1,85.4,87.6,%,higher_is_better\nCost per 1k tokens,0.01,0.015,0.0,0.008,$,lower_is_better\nQuality Score,94.7,96.2,88.3,91.5,/100,higher_is_better\nUptime,99.95,99.98,99.99,99.92,%,higher_is_better`;
        contentType = 'text/csv';
      } else if (id === 'raw-data') {
        filename = 'NeuralBench-Raw-Data.csv';
        content = `Timestamp,Model,Provider,LatencyMs,TokensPerSec,ThroughputPercent,Cost\n2025-01-15 14:32:00,GPT-4 Turbo,OpenAI,340,42,89.2,0.01\n2025-01-15 14:32:00,Claude 3 Opus,Anthropic,280,56,92.1,0.015\n2025-01-15 12:18:00,Llama 3 70B,Local,120,78,85.4,0.0\n2025-01-15 12:18:00,Mistral Large,Mistral,310,48,87.6,0.008`;
        contentType = 'text/csv';
      } else if (id === 'json-export') {
        filename = 'NeuralBench-Raw-Export.json';
        content = JSON.stringify({
          exportedAt: new Date().toISOString(),
          dateRange: dateRange,
          metrics: {
            gpt4: { latency: 340, tokensPerSec: 42, costPer1k: 0.01 },
            claude3: { latency: 280, tokensPerSec: 56, costPer1k: 0.015 },
            llama3: { latency: 120, tokensPerSec: 78, costPer1k: 0.0 },
            mistral: { latency: 310, tokensPerSec: 48, costPer1k: 0.008 }
          }
        }, null, 2);
        contentType = 'application/json';
      } else if (id === 'visual-report') {
        filename = 'NeuralBench-Visual-Pack-Instructions.txt';
        content = `NEURALBENCH VISUAL REPORT PACK\n\nVisual assets are compiled in high-definition SVG/PNG formats inside the download package.\nTo regenerate live charts, sync with ClickHouse analytics pipeline.`;
      } else if (id === 'exec-summary') {
        filename = 'NeuralBench-Executive-Summary.txt';
        content = `=======================================\nNEURALBENCH EXECUTIVE BRIEF\n=======================================\n- Recommendation: Migrate production chat pipelines to Claude 3.5 Sonnet for optimal cost/quality balance.\n- Recommendation: Deploy local Llama 3 70B cache nodes for low-latency auto-complete suggestions.`;
      }
      
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, 2500);
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
            Exportable <span className="gradient-text">Reports</span>
          </motion.h2>
          <p className="text-slate-400 mt-1">Generate and download benchmark reports in multiple formats</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50"
          >
            <option value="last-24-hours">Last 24 hours</option>
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="custom">Custom range</option>
          </select>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {templates.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-5 relative overflow-hidden group"
          >
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 bg-violet-500" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-500/10 text-violet-400">
                  {template.icon}
                </div>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {template.format}
                </span>
              </div>

              <h4 className="font-heading font-semibold text-white text-sm mb-1">{template.name}</h4>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{template.description}</p>

              <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {template.lastGenerated}
                </div>
                <div>{template.size}</div>
              </div>

              <button
                onClick={() => handleGenerate(template.id)}
                disabled={generating === template.id}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-[1.02] disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                {generating === template.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Exports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-white">Recent Exports</h3>
          <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all</button>
        </div>
        <div className="space-y-3">
          {recentExports.map((exp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800/50">
                  <FileDown className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{exp.name}</p>
                  <p className="text-xs text-slate-500">{exp.date} · {exp.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Share & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-blue-400" />
            <h3 className="font-heading font-semibold text-white text-sm">Email Reports</h3>
          </div>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="recipient@company.com"
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
            />
            <select className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50">
              <option>Performance Summary</option>
              <option>Multi-Model Comparison</option>
              <option>Executive Summary</option>
              <option>Custom Report</option>
            </select>
            <div className="flex gap-2">
              <select className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50">
                <option>One-time</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
              <button
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                Schedule
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-violet-400" />
            <h3 className="font-heading font-semibold text-white text-sm">Scheduled Reports</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Weekly Performance Digest', schedule: 'Every Monday, 9:00 AM', format: 'PDF' },
              { name: 'Monthly Executive Summary', schedule: '1st of each month', format: 'PDF' },
              { name: 'Daily Data Export', schedule: 'Every day, 11:59 PM', format: 'CSV' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
                <div>
                  <p className="text-sm text-white font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.schedule}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400">
                    {item.format}
                  </span>
                  <div className="w-8 h-4 rounded-full bg-emerald-500/20 relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}