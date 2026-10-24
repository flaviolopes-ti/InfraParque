import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Printer, 
  Download, 
  Check, 
  Plane, 
  Laptop, 
  Speaker,
  SlidersHorizontal
} from 'lucide-react';
import { Loan, Asset, UserProfile, SystemSettings, TermTemplate } from '../../types';
import { CautionTermModal } from './CautionTermModal';
import { RpasCautionTermModal } from './RpasCautionTermModal';
import { downloadCsv } from '../../utils/exportUtils';

interface LoansManagerProps {
  loans: Loan[];
  assets: Asset[];
  currentUser: UserProfile;
  systemSettings?: SystemSettings;
  termTemplates?: TermTemplate[];
  onOpenNewLoan: () => void;
  onReturnLoan: (loanId: string, returnCondition: string) => void;
  onOpenTermTemplates?: () => void;
  onOpenVisualIdentity?: () => void;
  onOpenSettings?: () => void;
}

export const LoansManager: React.FC<LoansManagerProps> = ({
  loans,
  assets,
  currentUser,
  systemSettings,
  termTemplates,
  onOpenNewLoan,
  onReturnLoan,
  onOpenTermTemplates,
  onOpenVisualIdentity,
  onOpenSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'atrasado' | 'devolvido'>('todos');
  const [termTypeFilter, setTermTypeFilter] = useState<'todos' | 'rpas_drone' | 'multimidia' | 'geral'>('todos');
  const [selectedTermLoan, setSelectedTermLoan] = useState<Loan | null>(null);
  
  // Return check-in modal state
  const [returningLoan, setReturningLoan] = useState<Loan | null>(null);
  const [returnCondition, setReturnCondition] = useState('Equipamento devolvido íntegro, sem avarias físicas, com todos os cabos, baterias e acessórios do case.');

  // Metrics
  const activeCount = loans.filter(l => l.status === 'ativo').length;
  const overdueCount = loans.filter(l => l.status === 'atrasado').length;
  const returnedCount = loans.filter(l => l.status === 'devolvido').length;
  const rpasCount = loans.filter(l => l.termType === 'rpas_drone' || l.droneKit !== undefined).length;

  const filteredLoans = loans.filter(loan => {
    const query = searchTerm.toLowerCase();
    const matches = 
      loan.protocolNumber.toLowerCase().includes(query) ||
      loan.borrowerName.toLowerCase().includes(query) ||
      loan.borrowerDoc.toLowerCase().includes(query) ||
      loan.borrowerDepartment.toLowerCase().includes(query) ||
      loan.assetName.toLowerCase().includes(query) ||
      loan.assetTag.toLowerCase().includes(query) ||
      loan.assetSerial.toLowerCase().includes(query);

    if (!matches) return false;
    if (statusFilter !== 'todos' && loan.status !== statusFilter) return false;
    if (termTypeFilter !== 'todos' && (loan.termType || 'geral') !== termTypeFilter) return false;

    return true;
  });

  const handleExportCsv = () => {
    const rows = filteredLoans.map(l => ({
      'Protocolo': l.protocolNumber,
      'Tipo de Cautela': l.termType === 'rpas_drone' ? 'RPAS Drone' : l.termType === 'multimidia' ? 'Multimídia' : 'Geral TI',
      'Equipamento': l.assetName,
      'Patrimônio / Tag': l.assetTag,
      'Número de Série': l.assetSerial,
      'Colaborador / Piloto': l.borrowerName,
      'Documento / Matrícula': l.borrowerDoc,
      'Departamento': l.borrowerDepartment,
      'Data Empréstimo': l.loanDate,
      'Prazo Devolução': l.expectedReturnDate,
      'Data Efetiva Devolução': l.actualReturnDate || 'Pendente',
      'Status': l.status,
      'Operador TI': l.operatorName
    }));

    downloadCsv(`relatorio_emprestimos_cautelas_${new Date().toISOString().split('T')[0]}`, rows);
  };

  const handleConfirmReturn = () => {
    if (returningLoan) {
      onReturnLoan(returningLoan.id, returnCondition);
      setReturningLoan(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Gestão de Empréstimos, Cautelas de TI & RPAS
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhamento de Drones com Case de voo, equipamentos multimídia e notebooks sob custódia
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exportar CSV</span>
          </button>

          {(onOpenTermTemplates || onOpenSettings) && (
            <button
              onClick={onOpenTermTemplates || onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Editar versões, títulos e cláusulas dos termos de cautela e RPAS"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modelos dos Termos</span>
            </button>
          )}

          {onOpenVisualIdentity && (
            <button
              onClick={onOpenVisualIdentity}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Configurar logotipo do sistema, brasão dos termos e paleta de cores"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Identidade & Cores</span>
            </button>
          )}

          {currentUser.role !== 'auditor' && (
            <button
              onClick={onOpenNewLoan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Empréstimo / Cautela</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total de Cautelas Emitidas</span>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {loans.length}
          </div>
          <span className="text-[11px] text-slate-500">{rpasCount} missões de RPAS/Drone</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Empréstimos em Aberto</span>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1 tabular-nums">
            {activeCount}
          </div>
          <span className="text-[11px] text-slate-400">Dentro do prazo previsto</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Empréstimos em Atraso</span>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1 tabular-nums">
            {overdueCount}
          </div>
          <span className="text-[11px] text-rose-300 font-semibold">Exige cobrança imediata</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Devoluções Concluídas</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">
            {returnedCount}
          </div>
          <span className="text-[11px] text-emerald-400">Equipamentos restabelecidos</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por protocolo, nome do piloto/colaborador, CPF, matrícula ou tag..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1 rounded text-xs transition-colors ${statusFilter === 'todos' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Todos ({loans.length})
            </button>
            <button
              onClick={() => setStatusFilter('ativo')}
              className={`px-3 py-1 rounded text-xs transition-colors ${statusFilter === 'ativo' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Em Aberto ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('atrasado')}
              className={`px-3 py-1 rounded text-xs transition-colors ${statusFilter === 'atrasado' ? 'bg-slate-800 text-rose-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Atrasados ({overdueCount})
            </button>
            <button
              onClick={() => setStatusFilter('devolvido')}
              className={`px-3 py-1 rounded text-xs transition-colors ${statusFilter === 'devolvido' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Devolvidos ({returnedCount})
            </button>
          </div>

          {/* Term Type Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px]">Tipo de Cautela:</span>
            <div className="flex p-0.5 bg-slate-950 rounded-md border border-slate-800">
              <button
                onClick={() => setTermTypeFilter('todos')}
                className={`px-2 py-1 rounded text-[11px] ${termTypeFilter === 'todos' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Todas
              </button>
              <button
                onClick={() => setTermTypeFilter('rpas_drone')}
                className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${termTypeFilter === 'rpas_drone' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Plane className="w-3 h-3" />
                <span>RPAS Drone</span>
              </button>
              <button
                onClick={() => setTermTypeFilter('multimidia')}
                className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${termTypeFilter === 'multimidia' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Speaker className="w-3 h-3" />
                <span>Multimídia</span>
              </button>
              <button
                onClick={() => setTermTypeFilter('geral')}
                className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${termTypeFilter === 'geral' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Laptop className="w-3 h-3" />
                <span>Geral TI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3 px-4 font-medium">Protocolo & Categoria</th>
                <th className="py-3 px-4 font-medium">Equipamento & Kit</th>
                <th className="py-3 px-4 font-medium">Responsável / Piloto</th>
                <th className="py-3 px-4 font-medium">Data Empréstimo</th>
                <th className="py-3 px-4 font-medium">Prazo Devolução</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Nenhum empréstimo encontrado com os critérios selecionados.
                  </td>
                </tr>
              ) : (
                filteredLoans.map(loan => {
                  const isDrone = loan.termType === 'rpas_drone' || loan.droneKit !== undefined;
                  const isMulti = loan.termType === 'multimidia' || loan.multimediaKit !== undefined;

                  return (
                    <tr key={loan.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400">
                            {loan.protocolNumber}
                          </span>
                          {isDrone && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1 font-mono uppercase">
                              <Plane className="w-2.5 h-2.5" />
                              <span>RPAS</span>
                            </span>
                          )}
                          {isMulti && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1 font-mono uppercase">
                              <Speaker className="w-2.5 h-2.5" />
                              <span>Multimídia</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{loan.assetName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {loan.assetTag} · S/N: {loan.assetSerial}
                        </div>
                        {isDrone && loan.droneKit && (
                          <div className="text-[10px] text-cyan-400/90 font-mono mt-0.5">
                            Case c/ {loan.droneKit.batteriesCount}x bat, Smart Controller, {loan.droneKit.sparePropellersPairs} pares hélices
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-medium">{loan.borrowerName}</div>
                        <div className="text-[11px] text-slate-400">
                          {loan.borrowerDepartment} ({loan.borrowerDoc})
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-300">
                        {new Date(loan.loanDate).toLocaleDateString('pt-BR')}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className={loan.status === 'atrasado' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {new Date(loan.expectedReturnDate).toLocaleDateString('pt-BR')}
                        </span>
                        {loan.status === 'atrasado' && (
                          <span className="block text-[10px] text-rose-400 font-semibold">
                            Prazo Excedido!
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded font-medium ${
                          loan.status === 'atrasado'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800 font-semibold'
                            : loan.status === 'ativo'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        }`}>
                          {loan.status === 'atrasado' ? 'Atrasado' : loan.status === 'ativo' ? 'Em Aberto' : 'Devolvido'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedTermLoan(loan)}
                            title={isDrone ? "Visualizar Termo de Cautela RPAS" : "Visualizar Termo de Cautela"}
                            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-[10px] hidden sm:inline">Termo</span>
                          </button>

                          {loan.status !== 'devolvido' && currentUser.role !== 'auditor' && (
                            <button
                              onClick={() => setReturningLoan(loan)}
                              title="Registrar Devolução do Equipamento"
                              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/40 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Devolver</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Modal (Check-in Checklist) */}
      {returningLoan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Check-in / Devolução de Equipamento
            </h3>

            <div className="p-3 bg-slate-950 rounded-lg text-xs space-y-1 text-slate-300 border border-slate-800">
              <div>Item: <strong className="text-white">{returningLoan.assetName}</strong> ({returningLoan.assetTag})</div>
              <div>Colaborador: <strong className="text-white">{returningLoan.borrowerName}</strong></div>
              <div>Protocolo: <span className="font-mono text-cyan-400">{returningLoan.protocolNumber}</span></div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Laudo Técnico de Devolução / Estado Físico & Acessórios do Case
              </label>
              <textarea
                value={returnCondition}
                onChange={e => setReturnCondition(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setReturningLoan(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReturn}
                className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Confirmar Devolução
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Caution Term Modal (Conditional between RPAS and General) */}
      {selectedTermLoan && (
        selectedTermLoan.termType === 'rpas_drone' || selectedTermLoan.droneKit !== undefined ? (
          <RpasCautionTermModal
            loan={selectedTermLoan}
            systemSettings={systemSettings}
            template={termTemplates?.find(t => t.id === 'termo_rpas')}
            onEditTemplate={onOpenTermTemplates || onOpenSettings}
            onClose={() => setSelectedTermLoan(null)}
          />
        ) : (
          <CautionTermModal
            loan={selectedTermLoan}
            systemSettings={systemSettings}
            template={termTemplates?.find(t => t.id === 'termo_geral')}
            onEditTemplate={onOpenTermTemplates || onOpenSettings}
            onClose={() => setSelectedTermLoan(null)}
          />
        )
      )}

    </div>
  );
};
