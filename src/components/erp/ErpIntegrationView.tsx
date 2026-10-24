import React, { useState } from 'react';
import { 
  Network, 
  Key, 
  RefreshCw, 
  Check, 
  Copy, 
  Send, 
  Server, 
  CheckCircle2, 
  Terminal, 
  Code2,
  ExternalLink
} from 'lucide-react';
import { ErpConfig, UserProfile, Asset } from '../../types';

interface ErpIntegrationViewProps {
  erpConfig: ErpConfig;
  onSaveConfig: (config: ErpConfig) => void;
  currentUser: UserProfile;
  assets: Asset[];
}

export const ErpIntegrationView: React.FC<ErpIntegrationViewProps> = ({
  erpConfig,
  onSaveConfig,
  currentUser,
  assets
}) => {
  const [config, setConfig] = useState<ErpConfig>(erpConfig);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState<'assets' | 'movements' | 'orders'>('assets');
  const [isTestingSync, setIsTestingSync] = useState(false);
  const [syncResponse, setSyncResponse] = useState<any>(null);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(config.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = 'erp_live_sec_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const updated = { ...config, apiKey: newKey };
    setConfig(updated);
    onSaveConfig(updated);
  };

  const handleTriggerSync = () => {
    setIsTestingSync(true);
    setSyncResponse(null);

    setTimeout(() => {
      setIsTestingSync(false);
      const nowIso = new Date().toISOString();
      const updated = { ...config, lastSyncAt: nowIso };
      setConfig(updated);
      onSaveConfig(updated);

      setSyncResponse({
        status: 200,
        statusText: 'OK',
        erpSystem: config.systemType,
        transactionId: 'TX-' + Math.floor(100000 + Math.random() * 900000),
        syncedRecords: assets.length,
        timestamp: nowIso,
        payloadSummary: {
          ativosCadastrados: assets.length,
          proprios: assets.filter(a => a.ownership === 'proprio').length,
          alugados: assets.filter(a => a.ownership === 'alugado').length,
          suprimentosCriticos: assets.filter(a => a.type === 'suprimento' && (a.suppliesInfo?.currentStock || 0) <= (a.suppliesInfo?.minStockThreshold || 0)).length
        },
        message: `Sincronização bidirecional concluída com sucesso no ${config.systemType}. Contas contábeis de patrimônio e ordens de suprimentos atualizadas.`
      });
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Integração via API com Sistemas ERP Corporativos
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Conexão REST padronizada com SAP S/4HANA, TOTVS Protheus, Senior ERP e APIs legadas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ERP Conectado: {config.systemType}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Configuration & API Key */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Parâmetros do Conector ERP
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Sistema ERP Alvo
              </label>
              <select
                value={config.systemType}
                onChange={e => {
                  const updated = { ...config, systemType: e.target.value as any };
                  setConfig(updated);
                  onSaveConfig(updated);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
              >
                <option value="SAP S/4HANA">SAP S/4HANA</option>
                <option value="TOTVS Protheus">TOTVS Protheus</option>
                <option value="Senior ERP">Senior ERP (Sapiens)</option>
                <option value="Generic REST API">Custom REST JSON API</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                URL Base do Gateway / Webhook
              </label>
              <input
                type="text"
                value={config.apiUrl}
                onChange={e => {
                  const updated = { ...config, apiUrl: e.target.value };
                  setConfig(updated);
                  onSaveConfig(updated);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300"
              />
            </div>

            {/* API Key */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Chave de API (Bearer Token)
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateKey}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300"
                >
                  Regerar Chave
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="password"
                  value={config.apiKey}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                  title="Copiar Chave de API"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sync trigger button */}
            <button
              onClick={handleTriggerSync}
              disabled={isTestingSync}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isTestingSync ? 'animate-spin' : ''}`} />
              <span>{isTestingSync ? 'Sincronizando com ERP...' : 'Testar Sincronização em Tempo Real'}</span>
            </button>

            {config.lastSyncAt && (
              <p className="text-[10px] text-slate-500 font-mono text-center">
                Último sync: {new Date(config.lastSyncAt).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Endpoint Playground & Documentation */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  Endpoints da API REST para Integração Externa
                </h3>
                <p className="text-[11px] text-slate-400">
                  Consulte ou envie dados com autenticação via cabeçalho <code className="text-cyan-400 font-mono">Authorization: Bearer {'<CHAVE_API>'}</code>
                </p>
              </div>
            </div>

            {/* Endpoint tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs">
              <button
                onClick={() => setActiveEndpoint('assets')}
                className={`px-3 py-1.5 rounded-lg font-mono font-medium ${
                  activeEndpoint === 'assets' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                GET /api/v1/assets
              </button>
              <button
                onClick={() => setActiveEndpoint('movements')}
                className={`px-3 py-1.5 rounded-lg font-mono font-medium ${
                  activeEndpoint === 'movements' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                GET /api/v1/movements
              </button>
              <button
                onClick={() => setActiveEndpoint('orders')}
                className={`px-3 py-1.5 rounded-lg font-mono font-medium ${
                  activeEndpoint === 'orders' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                POST /api/v1/replenish/orders
              </button>
            </div>

            {/* Endpoint Specification Sample */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] space-y-2 text-slate-300">
              <div className="text-cyan-400">
                curl -X {activeEndpoint === 'orders' ? 'POST' : 'GET'} "{config.apiUrl}/{activeEndpoint}" \
              </div>
              <div className="text-slate-400 pl-4">
                -H "Authorization: Bearer {config.apiKey.substring(0, 14)}..." \
              </div>
              <div className="text-slate-400 pl-4">
                -H "Content-Type: application/json"
              </div>
            </div>

            {/* Live Sync Result Box */}
            {syncResponse && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Resposta do ERP ({syncResponse.erpSystem}) - 200 OK
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    TX: {syncResponse.transactionId}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {syncResponse.message}
                </p>
                <pre className="p-3 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-48">
                  {JSON.stringify(syncResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
