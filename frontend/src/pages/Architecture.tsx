import { motion } from 'framer-motion';
import {
  Server,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Zap,
  Shield,
  Database,
  Cpu,
  Globe,
  BarChart3,
  Layers,
} from 'lucide-react';
import { architectureModules } from '../lib/mockData';

const iconMap: Record<string, React.ReactNode> = {
  'api-gateway': <Globe className="w-5 h-5" />,
  'auth': <Shield className="w-5 h-5" />,
  'benchmark-engine': <Zap className="w-5 h-5" />,
  'model-connector': <Cpu className="w-5 h-5" />,
  'storage': <Database className="w-5 h-5" />,
  'analytics': <BarChart3 className="w-5 h-5" />,
};

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'api-gateway': { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', text: '#60a5fa', glow: 'rgba(59,130,246,0.2)' },
  'auth': { bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.25)', text: '#f472b6', glow: 'rgba(236,72,153,0.2)' },
  'benchmark-engine': { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', text: '#a78bfa', glow: 'rgba(139,92,246,0.2)' },
  'model-connector': { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)', text: '#22d3ee', glow: 'rgba(6,182,212,0.2)' },
  'storage': { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', text: '#4ade80', glow: 'rgba(34,197,94,0.2)' },
  'analytics': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24', glow: 'rgba(245,158,11,0.2)' },
};

export default function Architecture() {
  return (
    <div className="space-y-8">
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-heading font-bold text-white"
        >
          Backend <span className="gradient-text">Architecture</span>
        </motion.h2>
        <p className="text-slate-400 mt-1">Component structure for API integrations, benchmarking engine, and data pipeline</p>
      </div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Layers className="w-5 h-5 text-violet-400" />
          <h3 className="font-heading font-semibold text-white">System Overview</h3>
        </div>

        {/* Architecture Diagram */}
        <div className="relative">
          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: '600px' }}>
            {/* API Gateway -> Auth */}
            <line x1="25%" y1="120" x2="75%" y2="120" stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4,4" />
            {/* API Gateway -> Benchmark Engine */}
            <line x1="25%" y1="140" x2="25%" y2="260" stroke="rgba(59,130,246,0.15)" strokeWidth="1" strokeDasharray="4,4" />
            {/* Benchmark Engine -> Model Connector */}
            <line x1="50%" y1="300" x2="50%" y2="420" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="4,4" />
            {/* Benchmark Engine -> Storage */}
            <line x1="30%" y1="300" x2="15%" y2="420" stroke="rgba(34,197,94,0.15)" strokeWidth="1" strokeDasharray="4,4" />
            {/* Benchmark Engine -> Analytics */}
            <line x1="70%" y1="300" x2="85%" y2="420" stroke="rgba(245,158,11,0.15)" strokeWidth="1" strokeDasharray="4,4" />
          </svg>

          {/* Layer Labels */}
          <div className="relative z-10">
            {/* Layer 1: Gateway & Auth */}
            <div className="mb-2">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-3">Gateway Layer</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {architectureModules.filter(m => ['api-gateway', 'auth'].includes(m.id)).map((mod) => {
                  const c = colorMap[mod.id];
                  return (
                    <div
                      key={mod.id}
                      className="glass-card p-4 relative overflow-hidden"
                      style={{ borderColor: c.border }}
                    >
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-30" style={{ background: c.glow }} />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.bg, color: c.text }}>
                            {iconMap[mod.id]}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-heading font-semibold text-white text-sm">{mod.name}</h4>
                          </div>
                          {mod.status === 'active' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Rocket className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{mod.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {mod.tech.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layer 2: Core Engine */}
            <div className="mb-2 mt-8">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-3">Core Engine Layer</p>
              <div className="max-w-2xl mx-auto">
                {architectureModules.filter(m => m.id === 'benchmark-engine').map((mod) => {
                  const c = colorMap[mod.id];
                  return (
                    <div
                      key={mod.id}
                      className="glass-card p-5 relative overflow-hidden"
                      style={{ borderColor: c.border }}
                    >
                      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-xl opacity-30" style={{ background: c.glow }} />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg, color: c.text }}>
                            {iconMap[mod.id]}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-heading font-semibold text-white">{mod.name}</h4>
                            <p className="text-xs text-slate-500">Central orchestration</p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{mod.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {mod.tech.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layer 3: Connectors & Storage */}
            <div className="mt-8">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-3">Data & Integration Layer</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {architectureModules.filter(m => ['model-connector', 'storage', 'analytics'].includes(m.id)).map((mod) => {
                  const c = colorMap[mod.id];
                  return (
                    <div
                      key={mod.id}
                      className="glass-card p-4 relative overflow-hidden"
                      style={{ borderColor: c.border }}
                    >
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-30" style={{ background: c.glow }} />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.bg, color: c.text }}>
                            {iconMap[mod.id]}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-heading font-semibold text-white text-sm">{mod.name}</h4>
                          </div>
                          {mod.status === 'active' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Rocket className="w-3 h-3" /> Upgrade
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{mod.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {mod.tech.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Connection Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="font-heading font-semibold text-white mb-4">Module Connections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {architectureModules.map((mod) => {
            const c = colorMap[mod.id];
            return (
              <div key={mod.id} className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: c.bg, color: c.text }}>
                    {iconMap[mod.id]}
                  </div>
                  <span className="text-sm font-medium text-white">{mod.name}</span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider">Connects to:</p>
                  {mod.connections.map((conn) => {
                    const connMod = architectureModules.find((m) => m.id === conn);
                    const cc = colorMap[conn];
                    return (
                      <div key={conn} className="flex items-center gap-2 text-xs">
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                        <span style={{ color: cc?.text || '#94a3b8' }}>{connMod?.name || conn}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Upgrade Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
        style={{ borderColor: 'rgba(245,158,11,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5 text-amber-400" />
          <h3 className="font-heading font-semibold text-white">Upgrade-Ready Modules</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'Analytics Engine v2',
              desc: 'Real-time streaming analytics with ML-powered anomaly detection and predictive cost modeling.',
              status: 'Ready to upgrade',
              tech: ['Apache Kafka', 'ClickHouse', 'ML Pipelines'],
            },
            {
              name: 'Federated Benchmarking',
              desc: 'Distributed benchmark execution across multiple regions and cloud providers for latency mapping.',
              status: 'Planned',
              tech: ['Kubernetes', 'gRPC', 'Edge Nodes'],
            },
            {
              name: 'Custom Test Suites',
              desc: 'User-defined benchmark scenarios with domain-specific evaluation criteria and custom prompts.',
              status: 'In development',
              tech: ['YAML Config', 'Template Engine', 'Scoring DSL'],
            },
            {
              name: 'A/B Testing Framework',
              desc: 'Automated A/B testing for model versions with statistical significance analysis and rollout management.',
              status: 'Planned',
              tech: ['Feature Flags', 'Stats Engine', 'CI/CD Hooks'],
            },
          ].map((mod, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-800/30 border border-amber-500/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-semibold text-white text-sm">{mod.name}</h4>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                  mod.status === 'Ready to upgrade' ? 'bg-emerald-500/10 text-emerald-400' :
                  mod.status === 'In development' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-slate-500/10 text-slate-400'
                }`}>
                  {mod.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{mod.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {mod.tech.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}