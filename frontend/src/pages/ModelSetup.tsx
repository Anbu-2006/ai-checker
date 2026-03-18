import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Globe,
  Server,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  TestTube,
  Cpu,
  Wifi,
} from 'lucide-react';
import { models as initialModels, type ModelConfig } from '../lib/mockData';

export default function ModelSetup() {
  const [modelList, setModelList] = useState<ModelConfig[]>(() => {
    try {
      const saved = localStorage.getItem('aiModels');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [newModel, setNewModel] = useState({ name: '', provider: '', type: 'api' as 'api' | 'local', endpoint: '', apiKey: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [testingModel, setTestingModel] = useState<string | null>(null);
  const [detectedProvider, setDetectedProvider] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    localStorage.setItem('aiModels', JSON.stringify(modelList));
  }, [modelList]);

  const toggleKeyVisibility = (id: string) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const testConnection = (id: string) => {
    setTestingModel(id);
    setModelList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'testing' as const } : m))
    );
    setTimeout(() => {
      setModelList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'connected' as const } : m))
      );
      setTestingModel(null);
    }, 2000);
  };

  const autoDetectModel = async () => {
    setIsDetecting(true);
    setDetectedProvider(null);
    setAvailableModels([]);
    try {
      const res = await axios.post('http://localhost:5000/api/detect', {
        apiKey: newModel.apiKey,
        endpoint: newModel.endpoint || undefined
      });
      if (res.data.success) {
        setDetectedProvider(res.data.provider);
        setAvailableModels(res.data.modelsAvailable);
        setNewModel(prev => ({ 
          ...prev, 
          provider: res.data.provider, 
          type: res.data.type,
          name: res.data.modelsAvailable[0] || 'Detected-Model'
        }));
      }
    } catch (e: any) {
      alert(e.response?.data?.error || 'Detection failed');
    }
    setIsDetecting(false);
  };

  const removeModel = async (id: string) => {
    setModelList((prev) => prev.filter((m) => m.id !== id));
  };

  const addModel = async () => {
    if (!newModel.name || !newModel.provider) return;
    const mData = {
      id: Date.now().toString(),
      name: newModel.name,
      provider: newModel.provider,
      type: newModel.type,
      status: 'disconnected' as const,
      endpoint: newModel.endpoint || undefined,
      apiKey: newModel.apiKey || undefined,
      contextWindow: 32000,
      costPer1kTokens: newModel.type === 'local' ? 0 : 0.01,
    };
    setModelList((prev) => [...prev, mData]);
    setNewModel({ name: '', provider: '', type: 'api', endpoint: '', apiKey: '' });
    setShowAddForm(false);
    setAvailableModels([]);
    setDetectedProvider(null);
  };

  const statusIcon = (status: string) => {
    if (status === 'connected') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (status === 'testing') return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
    return <XCircle className="w-4 h-4 text-slate-500" />;
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
            Model <span className="gradient-text">Setup</span>
          </motion.h2>
          <p className="text-slate-400 mt-1">Configure API keys and local LLM connections</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          <Plus className="w-4 h-4" />
          Add Model
        </button>
      </div>

      {/* Add Model Form Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl border-violet-500/30"
          >
            <h3 className="font-heading font-semibold text-white mb-4 text-lg">Add New Model</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Auto-Detect Provider (API Key or Endpoint)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newModel.apiKey || newModel.endpoint}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.startsWith('http')) setNewModel({ ...newModel, endpoint: val, apiKey: '' });
                      else setNewModel({ ...newModel, apiKey: val, endpoint: '' });
                    }}
                    placeholder="Paste API Key (sk-...) or Local HTTP Endpoint"
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
                  />
                  <button
                    onClick={autoDetectModel}
                    disabled={isDetecting}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isDetecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Detect & Check'}
                  </button>
                </div>
              </div>

              {detectedProvider && (
                <div className="col-span-1 md:col-span-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-emerald-400 text-sm font-medium">Provider Detected: {detectedProvider}</div>
                    <div className="text-emerald-500/70 text-xs">Available models: {availableModels.join(', ')}</div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Model Name (or select available)</label>
                {availableModels.length > 0 ? (
                  <select
                    value={newModel.name}
                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50"
                    >
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newModel.name}
                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                    placeholder="e.g., GPT-4o, DeepSeek V3"
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
                  />
                )}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Provider</label>
                <input
                  type="text"
                  value={newModel.provider}
                  onChange={(e) => setNewModel({ ...newModel, provider: e.target.value })}
                  placeholder="e.g., OpenAI, Ollama"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Connection Type</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewModel({ ...newModel, type: 'api' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      newModel.type === 'api'
                        ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                        : 'border-white/10 text-slate-400 hover:bg-white/[0.03]'
                    }`}
                  >
                    <Globe className="w-4 h-4" /> API
                  </button>
                  <button
                    onClick={() => setNewModel({ ...newModel, type: 'local' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      newModel.type === 'local'
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                        : 'border-white/10 text-slate-400 hover:bg-white/[0.03]'
                    }`}
                  >
                    <Server className="w-4 h-4" /> Local
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
                  {newModel.type === 'api' ? 'API Endpoint' : 'Local Endpoint'}
                </label>
                <input
                  type="text"
                  value={newModel.endpoint}
                  onChange={(e) => setNewModel({ ...newModel, endpoint: e.target.value })}
                  placeholder={newModel.type === 'api' ? 'https://api.openai.com/v1' : 'http://localhost:11434'}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
                />
              </div>
              {newModel.type === 'api' && (
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">API Key</label>
                  <input
                    type="password"
                    value={newModel.apiKey}
                    onChange={(e) => setNewModel({ ...newModel, apiKey: e.target.value })}
                    placeholder="sk-... or your API key"
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-white/10 hover:bg-white/[0.03] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addModel}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                Add Model
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Model Cards */}
      {modelList.length === 0 ? (
        <div className="glass-card p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto border-violet-500/20 shadow-lg mt-12 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4 text-violet-400">
            <Server className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-heading font-bold text-white mb-2">No Connected Models</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            You haven't configured any API keys or local LLM connections yet. Click "Add Model" above to set up your first provider.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {modelList.map((model, idx) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-5 relative overflow-hidden"
            >
              {/* Decorative glow */}
              <div
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30"
                style={{
                  background: model.type === 'api' ? '#3b82f6' : '#06b6d4',
                }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: model.type === 'api' ? 'rgba(59,130,246,0.15)' : 'rgba(6,182,212,0.15)',
                      }}
                    >
                      {model.type === 'api' ? (
                        <Globe className="w-5 h-5" style={{ color: '#60a5fa' }} />
                      ) : (
                        <Cpu className="w-5 h-5" style={{ color: '#22d3ee' }} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-white text-sm">{model.name}</h4>
                      <p className="text-xs text-slate-500">{model.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcon(model.status)}
                    <button
                      onClick={() => removeModel(model.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Type</span>
                    <span className={`px-2 py-0.5 rounded-md font-medium ${
                      model.type === 'api' ? 'bg-blue-500/10 text-blue-400' : 'bg-cyan-500/10 text-cyan-400'
                    }`}>
                      {model.type === 'api' ? 'API' : 'Local'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Context Window</span>
                    <span className="text-slate-300">{model.contextWindow.toLocaleString()} tokens</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Cost / 1K tokens</span>
                    <span className="text-slate-300">{model.costPer1kTokens > 0 ? `$${model.costPer1kTokens}` : 'Free'}</span>
                  </div>
                </div>

                {/* API Key (for API models) */}
                {model.type === 'api' && (
                  <div className="mb-4">
                    <label className="block text-xs text-slate-500 mb-1.5">API Key</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-400 font-mono truncate">
                        {showKey[model.id] ? 'sk-proj-abc123...xyz789' : '••••••••••••••••'}
                      </div>
                      <button
                        onClick={() => toggleKeyVisibility(model.id)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showKey[model.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Endpoint (for local models) */}
                {model.type === 'local' && (
                  <div className="mb-4">
                    <label className="block text-xs text-slate-500 mb-1.5">Endpoint</label>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="text-xs text-slate-400 font-mono">http://localhost:11434</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => testConnection(model.id)}
                    disabled={testingModel === model.id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 transition-all disabled:opacity-50"
                  >
                    {testingModel === model.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <TestTube className="w-3.5 h-3.5" />
                    )}
                    Test Connection
                  </button>
                  <button className="px-3 py-2 rounded-xl text-xs font-medium border border-white/10 text-slate-400 hover:bg-white/[0.03] transition-all">
                    Configure
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}