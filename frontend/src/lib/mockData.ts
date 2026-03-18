export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  type: 'api' | 'local';
  status: 'connected' | 'disconnected' | 'testing';
  apiKey?: string;
  endpoint?: string;
  contextWindow: number;
  costPer1kTokens: number;
}

export interface MetricData {
  name: string;
  latency: number;
  tokensPerSec: number;
  throughput: number;
  cost: number;
  quality: number;
  uptime: number;
  contextWindow: number;
  errorRate: number;
}

export interface BenchmarkRun {
  id: string;
  date: string;
  models: string[];
  status: 'completed' | 'running' | 'failed';
  duration: string;
  avgLatency: number;
  avgThroughput: number;
  score: number;
}

export const models: ModelConfig[] = [
  {
    id: 'gpt4',
    name: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    type: 'api',
    status: 'connected',
    contextWindow: 128000,
    costPer1kTokens: 0.005,
  },
  {
    id: 'claude3',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    type: 'api',
    status: 'connected',
    contextWindow: 200000,
    costPer1kTokens: 0.003,
  },
  {
    id: 'llama3',
    name: 'Llama 3.3 70B (Local)',
    provider: 'Meta (Ollama)',
    type: 'local',
    status: 'connected',
    contextWindow: 131072,
    costPer1kTokens: 0,
  },
  {
    id: 'gemini',
    name: 'Gemini 2.0 Flash',
    provider: 'Google Cloud',
    type: 'api',
    status: 'connected',
    contextWindow: 1048576,
    costPer1kTokens: 0.0001,
  },
  {
    id: 'mistral',
    name: 'Mistral Large 2',
    provider: 'Mistral AI',
    type: 'api',
    status: 'connected',
    contextWindow: 128000,
    costPer1kTokens: 0.002,
  },
  {
    id: 'qwen',
    name: 'Qwen 2.5 72B (Local)',
    provider: 'Alibaba (Ollama)',
    type: 'local',
    status: 'connected',
    contextWindow: 131072,
    costPer1kTokens: 0,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek-R1 (Reasoning)',
    provider: 'DeepSeek (Local/API)',
    type: 'local',
    status: 'connected',
    contextWindow: 131072,
    costPer1kTokens: 0.00055,
  },
];

export const liveMetrics: Record<string, MetricData> = {
  gpt4: {
    name: 'GPT-4o (Omni)',
    latency: 180,
    tokensPerSec: 105,
    throughput: 96.2,
    cost: 1.25,
    quality: 96.8,
    uptime: 99.98,
    contextWindow: 128000,
    errorRate: 0.04,
  },
  claude3: {
    name: 'Claude 3.7 Sonnet',
    latency: 195,
    tokensPerSec: 92,
    throughput: 95.4,
    cost: 1.80,
    quality: 97.5,
    uptime: 99.99,
    contextWindow: 200000,
    errorRate: 0.02,
  },
  llama3: {
    name: 'Llama 3.3 70B (Local)',
    latency: 85,
    tokensPerSec: 110,
    throughput: 94.0,
    cost: 0,
    quality: 92.5,
    uptime: 99.99,
    contextWindow: 131072,
    errorRate: 0.01,
  },
  mistral: {
    name: 'Mistral Large 2',
    latency: 220,
    tokensPerSec: 84,
    throughput: 91.2,
    cost: 1.10,
    quality: 93.1,
    uptime: 99.95,
    contextWindow: 128000,
    errorRate: 0.08,
  },
  deepseek: {
    name: 'DeepSeek-R1 (Reasoning)',
    latency: 110,
    tokensPerSec: 98,
    throughput: 95.8,
    cost: 0.55,
    quality: 97.2,
    uptime: 99.97,
    contextWindow: 131072,
    errorRate: 0.02,
  },
};

export const latencyTimeSeries = [
  { time: '00:00', gpt4: 320, claude3: 260, llama3: 115, mistral: 290 },
  { time: '01:00', gpt4: 345, claude3: 275, llama3: 122, mistral: 310 },
  { time: '02:00', gpt4: 330, claude3: 285, llama3: 118, mistral: 295 },
  { time: '03:00', gpt4: 360, claude3: 290, llama3: 130, mistral: 320 },
  { time: '04:00', gpt4: 335, claude3: 270, llama3: 125, mistral: 305 },
  { time: '05:00', gpt4: 325, claude3: 265, llama3: 110, mistral: 285 },
  { time: '06:00', gpt4: 350, claude3: 280, llama3: 128, mistral: 315 },
  { time: '07:00', gpt4: 340, claude3: 275, llama3: 120, mistral: 300 },
  { time: '08:00', gpt4: 355, claude3: 295, llama3: 135, mistral: 325 },
  { time: '09:00', gpt4: 370, claude3: 300, llama3: 140, mistral: 340 },
  { time: '10:00', gpt4: 345, claude3: 288, llama3: 125, mistral: 310 },
  { time: '11:00', gpt4: 338, claude3: 278, llama3: 118, mistral: 298 },
];

export const throughputTimeSeries = [
  { time: '00:00', gpt4: 88, claude3: 91, llama3: 84, mistral: 86 },
  { time: '01:00', gpt4: 89, claude3: 92, llama3: 85, mistral: 87 },
  { time: '02:00', gpt4: 87, claude3: 90, llama3: 83, mistral: 85 },
  { time: '03:00', gpt4: 86, claude3: 89, llama3: 82, mistral: 84 },
  { time: '04:00', gpt4: 90, claude3: 93, llama3: 86, mistral: 88 },
  { time: '05:00', gpt4: 91, claude3: 94, llama3: 87, mistral: 89 },
  { time: '06:00', gpt4: 89, claude3: 91, llama3: 85, mistral: 87 },
  { time: '07:00', gpt4: 88, claude3: 92, llama3: 84, mistral: 86 },
  { time: '08:00', gpt4: 85, claude3: 88, llama3: 81, mistral: 83 },
  { time: '09:00', gpt4: 83, claude3: 86, llama3: 79, mistral: 81 },
  { time: '10:00', gpt4: 87, claude3: 90, llama3: 83, mistral: 85 },
  { time: '11:00', gpt4: 89, claude3: 92, llama3: 85, mistral: 87 },
];

export const qualityRadar = [
  { metric: 'Accuracy', gpt4: 94, claude3: 96, llama3: 88, mistral: 91 },
  { metric: 'Reasoning', gpt4: 95, claude3: 97, llama3: 86, mistral: 90 },
  { metric: 'Code Gen', gpt4: 93, claude3: 92, llama3: 84, mistral: 89 },
  { metric: 'Creativity', gpt4: 90, claude3: 94, llama3: 82, mistral: 88 },
  { metric: 'Instruction', gpt4: 96, claude3: 97, llama3: 90, mistral: 92 },
  { metric: 'Safety', gpt4: 95, claude3: 98, llama3: 91, mistral: 93 },
];

export const benchmarkHistory: BenchmarkRun[] = [
  { id: 'bm-001', date: '2025-01-15 14:32', models: ['GPT-4 Turbo', 'Claude 3 Opus'], status: 'completed', duration: '4m 22s', avgLatency: 310, avgThroughput: 90.6, score: 95.4 },
  { id: 'bm-002', date: '2025-01-15 12:18', models: ['Llama 3 70B', 'Mistral Large', 'GPT-4 Turbo'], status: 'completed', duration: '6m 45s', avgLatency: 257, avgThroughput: 87.4, score: 91.5 },
  { id: 'bm-003', date: '2025-01-14 22:05', models: ['Claude 3 Opus', 'Gemini Pro'], status: 'completed', duration: '3m 58s', avgLatency: 275, avgThroughput: 88.9, score: 93.1 },
  { id: 'bm-004', date: '2025-01-14 18:41', models: ['GPT-4 Turbo', 'Llama 3 70B'], status: 'completed', duration: '3m 12s', avgLatency: 220, avgThroughput: 87.3, score: 91.5 },
  { id: 'bm-005', date: '2025-01-14 15:20', models: ['All Models'], status: 'failed', duration: '2m 03s', avgLatency: 0, avgThroughput: 0, score: 0 },
  { id: 'bm-006', date: '2025-01-13 09:55', models: ['Mistral Large', 'Claude 3 Opus', 'Qwen 2.5 72B'], status: 'completed', duration: '7m 18s', avgLatency: 295, avgThroughput: 86.2, score: 90.8 },
  { id: 'bm-007', date: '2025-01-13 08:12', models: ['GPT-4 Turbo'], status: 'completed', duration: '2m 30s', avgLatency: 340, avgThroughput: 89.2, score: 94.7 },
  { id: 'bm-008', date: '2025-01-12 21:44', models: ['Llama 3 70B', 'Qwen 2.5 72B'], status: 'running', duration: '—', avgLatency: 0, avgThroughput: 0, score: 0 },
];

export const comparisonData = [
  { metric: 'Latency (ms)', gpt4: 340, claude3: 280, llama3: 120, mistral: 310, unit: 'ms', lower: true },
  { metric: 'Tokens/sec', gpt4: 42, claude3: 56, llama3: 78, mistral: 48, unit: 'tok/s', lower: false },
  { metric: 'Throughput (%)', gpt4: 89.2, claude3: 92.1, llama3: 85.4, mistral: 87.6, unit: '%', lower: false },
  { metric: 'Cost/1K tokens ($)', gpt4: 0.01, claude3: 0.015, llama3: 0, mistral: 0.008, unit: '$', lower: true },
  { metric: 'Quality Score', gpt4: 94.7, claude3: 96.2, llama3: 88.3, mistral: 91.5, unit: '/100', lower: false },
  { metric: 'Uptime (%)', gpt4: 99.95, claude3: 99.98, llama3: 99.99, mistral: 99.92, unit: '%', lower: false },
  { metric: 'Context Window', gpt4: 128000, claude3: 200000, llama3: 8192, mistral: 32000, unit: 'tokens', lower: false },
  { metric: 'Error Rate (%)', gpt4: 0.12, claude3: 0.05, llama3: 0.02, mistral: 0.18, unit: '%', lower: true },
];

export const tokenUsageData = [
  { date: 'Jan 8', gpt4: 2450000, claude3: 1800000, llama3: 3200000, mistral: 950000 },
  { date: 'Jan 9', gpt4: 2800000, claude3: 2100000, llama3: 3500000, mistral: 1100000 },
  { date: 'Jan 10', gpt4: 2600000, claude3: 1950000, llama3: 3100000, mistral: 1020000 },
  { date: 'Jan 11', gpt4: 3100000, claude3: 2400000, llama3: 3800000, mistral: 1250000 },
  { date: 'Jan 12', gpt4: 2900000, claude3: 2200000, llama3: 3400000, mistral: 1180000 },
  { date: 'Jan 13', gpt4: 3300000, claude3: 2500000, llama3: 4000000, mistral: 1300000 },
  { date: 'Jan 14', gpt4: 3050000, claude3: 2350000, llama3: 3700000, mistral: 1220000 },
];

export const architectureModules = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    description: 'Unified entry point for all external API integrations. Handles rate limiting, request queuing, and response caching.',
    tech: ['Express.js', 'Redis', 'Nginx'],
    connections: ['auth', 'benchmark-engine', 'storage'],
    status: 'active',
  },
  {
    id: 'auth',
    name: 'Authentication & Authorization',
    description: 'JWT-based auth with role-based access control. Supports API key management, OAuth2, and team-level permissions.',
    tech: ['JWT', 'OAuth2', 'RBAC'],
    connections: ['api-gateway', 'storage'],
    status: 'active',
  },
  {
    id: 'benchmark-engine',
    name: 'Benchmarking Engine',
    description: 'Core orchestration engine that manages test suites, parallel execution, statistical analysis, and result aggregation.',
    tech: ['Bull Queue', 'Workers', 'Stats.js'],
    connections: ['api-gateway', 'model-connector', 'storage', 'analytics'],
    status: 'active',
  },
  {
    id: 'model-connector',
    name: 'Model Connectors',
    description: 'Pluggable adapter layer for API-based models (OpenAI, Anthropic, Google) and local LLMs (Ollama, vLLM, llama.cpp).',
    tech: ['OpenAI SDK', 'Ollama API', 'vLLM'],
    connections: ['benchmark-engine'],
    status: 'active',
  },
  {
    id: 'storage',
    name: 'Data Storage Layer',
    description: 'Hybrid storage with PostgreSQL for structured data, TimescaleDB for time-series metrics, and S3 for report artifacts.',
    tech: ['PostgreSQL', 'TimescaleDB', 'S3'],
    connections: ['api-gateway', 'auth', 'benchmark-engine', 'analytics'],
    status: 'active',
  },
  {
    id: 'analytics',
    name: 'Analytics Engine',
    description: 'Real-time analytics processing with streaming aggregation, anomaly detection, and predictive cost modeling.',
    tech: ['Apache Kafka', 'ClickHouse', 'ML Pipelines'],
    connections: ['benchmark-engine', 'storage'],
    status: 'upgrade',
  },
];
