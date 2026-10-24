import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Filter, 
  User, 
  Clock, 
  Terminal, 
  FileCode,
  Layers,
  ChevronRight
} from 'lucide-react';
import { AuditLog, UserProfile } from '../../types';
import { downloadCsv } from '../../utils/exportUtils';

interface AuditLogsViewProps {
  logs: AuditLog[];
  currentUser: UserProfile;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  logs,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('todos');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter(l => {
    const query = searchTerm.toLowerCase();
    const matches = 
      l.summary.toLowerCase().includes(query) ||
      l.userName.toLowerCase().includes(query) ||
      l.action.toLowerCase().includes(query) ||
      l.entityId.toLowerCase().includes(query);

    if (!matches) return false;
    if (entityFilter !== 'todos' && l.entityType !== entityFilter) return false;

    return true;
  });

  const handleExportCsv = () => {
    const rows = filteredLogs.map(l => ({
      'ID Log': l.id,
      'Timestamp': l.timestamp,
      'Usuário': l.userName,
      'Perfil RBAC': l.userRole,
      'Ação': l.action,
      'Entidade': l.entityType,
      'ID Entidade': l.entityId,
      'Resumo': l.summary,
      'IP': l.ipAddress
    }));
    downloadCsv(`trilha_auditoria_completa_${new Date().toISOString().split('T')[0]}`, rows);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Trilha de Auditoria & Conformidade Regulatória
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro cronológico imutável para compliance governamental e auditorias externas
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Exportar Trilha CSV</span>
        </button>
      </div>

      {/* Compliance Banner for Public and Enterprise bodies */}
      <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/40 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <strong className="text-emerald-300">Garantia de Não-Repúdio:</strong> Todas as alterações em números de série, contratos de locação, garantias, cadastros e termos de cautela são carimbadas com timestamp ISO-8601, ID de sessão do operador e endereço IP.
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuário, ação, tag de patrimônio ou palavra-chave..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Entidade:</span>
          <select
            value={entityFilter}
            onChange={e => setEntityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden"
          >
            <option value="todos">Todas as entidades</option>
            <option value="Asset">Ativos / Equipamentos</option>
            <option value="Loan">Empréstimos / Cautelas</option>
            <option value="Supply">Suprimentos / Reposição</option>
            <option value="System">Sistema / Acesso</option>
            <option value="Import">Importação de Planilha</option>
          </select>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-slate-800/80">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Nenhum registro de auditoria corresponde aos filtros atuais.
            </div>
          ) : (
            filteredLogs.map(log => (
              <div 
                key={log.id} 
                onClick={() => setSelectedLog(log)}
                className="p-4 hover:bg-slate-800/50 transition-colors flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 text-cyan-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {log.action}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {log.entityType} · {log.entityId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1">
                      {log.summary}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>Operador: <strong className="text-slate-300">{log.userName}</strong> ({log.userRole})</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-500">IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs text-slate-400 block">
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal for Selected Log */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <FileCode className="w-4 h-4 text-cyan-400" />
              Detalhes Técnicos da Auditoria ({selectedLog.id})
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Ação:</span>
                <span className="font-mono text-cyan-400 font-bold">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="font-mono text-slate-200">{selectedLog.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Usuário:</span>
                <span>{selectedLog.userName} ({selectedLog.userRole})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IP Origem:</span>
                <span className="font-mono text-slate-400">{selectedLog.ipAddress}</span>
              </div>
            </div>

            {selectedLog.details && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Payload / Metadados:</span>
                <pre className="p-3 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto max-h-48">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
