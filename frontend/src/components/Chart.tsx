import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const modelColors: Record<string, string> = {
  gpt4: '#3b82f6',
  claude3: '#8b5cf6',
  llama3: '#06b6d4',
  mistral: '#f472b6',
};

const modelNames: Record<string, string> = {
  gpt4: 'GPT-4 Turbo',
  claude3: 'Claude 3 Opus',
  llama3: 'Llama 3 70B',
  mistral: 'Mistral Large',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-xs" style={{ background: 'rgba(15,23,42,0.9)' }}>
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-300">{modelNames[entry.name] || entry.name}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

interface LatencyChartProps {
  data: Array<Record<string, any>>;
}

export function LatencyChart({ data }: LatencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.06)" />
        <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value: string) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{modelNames[value] || value}</span>}
        />
        {Object.keys(modelColors).map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={modelColors[key]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ThroughputChart({ data }: LatencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.06)" />
        <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value: string) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{modelNames[value] || value}</span>}
        />
        {Object.entries(modelColors).map(([key, color]) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            fill={color}
            fillOpacity={0.06}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function QualityRadarChart({ data }: LatencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="rgba(139,92,246,0.1)" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
        {Object.entries(modelColors).map(([key, color]) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={color}
            fill={color}
            fillOpacity={0.08}
            strokeWidth={2}
          />
        ))}
        <Legend
          formatter={(value: string) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{modelNames[value] || value}</span>}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function TokenUsageChart({ data }: LatencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.06)" />
        <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
        <Tooltip
          formatter={(value: unknown, name: unknown) => [
            `${(Number(value) / 1000000).toFixed(2)}M`,
            modelNames[String(name)] || String(name),
          ]}
          contentStyle={{
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '12px',
            fontSize: '12px',
          }}
        />
        <Legend
          formatter={(value: string) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{modelNames[value] || value}</span>}
        />
        {Object.entries(modelColors).map(([key, color]) => (
          <Bar key={key} dataKey={key} fill={color} radius={[4, 4, 0, 0]} opacity={0.8} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
