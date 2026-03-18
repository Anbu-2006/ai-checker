import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'violet' | 'cyan' | 'pink' | 'green' | 'amber';
  delay?: number;
}

const colorMap = {
  blue: {
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
    glow: 'rgba(59,130,246,0.15)',
    text: '#60a5fa',
    iconBg: 'rgba(59,130,246,0.15)',
  },
  violet: {
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
    glow: 'rgba(139,92,246,0.15)',
    text: '#a78bfa',
    iconBg: 'rgba(139,92,246,0.15)',
  },
  cyan: {
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.2)',
    glow: 'rgba(6,182,212,0.15)',
    text: '#22d3ee',
    iconBg: 'rgba(6,182,212,0.15)',
  },
  pink: {
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.2)',
    glow: 'rgba(236,72,153,0.15)',
    text: '#f472b6',
    iconBg: 'rgba(236,72,153,0.15)',
  },
  green: {
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
    glow: 'rgba(34,197,94,0.15)',
    text: '#4ade80',
    iconBg: 'rgba(34,197,94,0.15)',
  },
  amber: {
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    glow: 'rgba(245,158,11,0.15)',
    text: '#fbbf24',
    iconBg: 'rgba(245,158,11,0.15)',
  },
};

export default function MetricCard({ title, value, unit, change, icon, color, delay = 0 }: MetricCardProps) {
  const c = colorMap[color];
  const trendUp = change && change > 0;
  const trendDown = change && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-5 relative overflow-hidden"
      style={{ borderColor: c.border }}
    >
      {/* Glow orb */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-40"
        style={{ background: c.glow }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: c.iconBg }}
          >
            <span style={{ color: c.text }}>{icon}</span>
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
              trendUp ? 'bg-emerald-500/10 text-emerald-400' : trendDown ? 'bg-red-500/10 text-red-400' : 'bg-slate-500/10 text-slate-400'
            }`}>
              {trendUp ? <TrendingUp className="w-3 h-3" /> : trendDown ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-heading font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-slate-500">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
}
