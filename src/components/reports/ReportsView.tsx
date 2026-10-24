import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  Layers, 
  DollarSign, 
  ArrowLeftRight, 
  Boxes,
  FileSpreadsheet
} from 'lucide-react';
import { Asset, Movement, Loan, AuditLog, UserProfile } from '../../types';
import { downloadCsv, downloadExcel } from '../../utils/exportUtils';
import { StorageManager } from '../../utils/storage';

interface ReportsViewProps {
  assets: Asset[];
  movements: Movement[];
  loans: Loan[];
  auditLogs: AuditLog[];
  currentUser: UserProfile;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  assets,
  movements,
  loans,
  auditLogs,
  currentUser
}) => {
  const systemSettings = StorageManager.getSystemSettings();
  const [selectedReport, setSelectedReport] = useState<'mensal_mov' | 'inventario' | 'alugados' | 'suprimentos' | 'auditoria'>('mensal_mov');
  const [selectedMonth, setSelectedMonth] = useState('2026-10'); // YYYY-MM
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>('todos');

  // Filter movements for the monthly report
  const filteredMovements = movements.filter(m => {
    const matchesMonth = m.timestamp.startsWith(selectedMonth);
    const matchesType = movementTypeFilter === 'todos' || m.type === movementTypeFilter;
    return matchesMonth && matchesType;
  });

  // Calculate monthly stats
  const totalEntradas = filteredMovements.filter(m => m.type === 'entrada' || m.type === 'reposicao_automatica').reduce((acc, m) => acc + m.quantity, 0);
  const totalSaidas = filteredMovements.filter(m => m.type === 'saida' || m.type === 'baixa').reduce((acc, m) => acc + m.quantity, 0);
  const totalEmprestimos = filteredMovements.filter(m => m.type === 'emprestimo').reduce((acc, m) => acc + m.quantity, 0);
  const totalDevolucoes = filteredMovements.filter(m => m.type === 'devolucao').reduce((acc, m) => acc + m.quantity, 0);

  // Print PDF
  const handlePrintPdf = () => {
    window.print();
  };

  // Export CSV
  const handleExportCsv = () => {
    if (selectedReport === 'mensal_mov') {
      const rows = filteredMovements.map(m => ({
        'Data / Hora': new Date(m.timestamp).toLocaleString('pt-BR'),
        'Tipo': m.type,
        'Patrimônio': m.assetTag,
        'Equipamento / Item': m.assetName,
        'Quantidade': m.quantity,
        'Origem': m.origin || 'N/A',
        'Destino': m.destination || 'N/A',
        'Motivo / Justificativa': m.reason,
        'Responsável': m.responsibleName,
        'Documento Referência': m.referenceDoc || 'N/A'
      }));
      downloadCsv(`relatorio_movimentacoes_${selectedMonth}`, rows);
    } else if (selectedReport === 'inventario') {
      const rows = assets.map(a => ({
        'Tag': a.tag,
        'Nome': a.name,
        'Categoria': a.category,
        'Regime': a.ownership,
        'Marca': a.brand,
        'Modelo': a.model,
        'Serial S/N': a.serialNumber,
        'Garantia': a.warrantyExpiresAt,
        'Status': a.status,
        'Prédio': a.location.building,
        'Departamento': a.location.department,
        'Valor Compra': a.purchaseValue || 0
      }));
      downloadCsv(`inventario_geral_parque_${new Date().toISOString().split('T')[0]}`, rows);
    } else if (selectedReport === 'alugados') {
      const rows = assets.filter(a => a.ownership === 'alugado').map(a => ({
        'Tag': a.tag,
        'Equipamento': a.name,
        'Empresa': a.rentalInfo?.rentalCompany || '',
        'Contrato': a.rentalInfo?.contractNumber || '',
        'Início Locação': a.rentalInfo?.rentalStartDate || '',
        'Fim Locação': a.rentalInfo?.rentalEndDate || '',
        'Mensalidade (R$)': a.rentalInfo?.monthlyCost || 0,
        'Status': a.status
      }));
      downloadCsv(`relatorio_equipamentos_alugados`, rows);
    } else if (selectedReport === 'auditoria') {
      const rows = auditLogs.map(l => ({
        'Timestamp': l.timestamp,
        'Usuário': l.userName,
        'Papel (RBAC)': l.userRole,
        'Ação': l.action,
        'Entidade': l.entityType,
        'ID Entidade': l.entityId,
        'Resumo': l.summary,
        'IP': l.ipAddress
      }));
      downloadCsv(`trilha_auditoria_${new Date().toISOString().split('T')[0]}`, rows);
    }
  };

  // Export full multi-sheet Excel
  const handleExportFullExcel = () => {
    const sheets = [
      {
        name: 'Movimentações',
        data: movements.map(m => ({
          Data: new Date(m.timestamp).toLocaleDateString('pt-BR'),
          Tipo: m.type,
          Tag: m.assetTag,
          Item: m.assetName,
          Qtd: m.quantity,
          Origem: m.origin,
          Destino: m.destination,
          Responsável: m.responsibleName,
          Motivo: m.reason
        }))
      },
      {
        name: 'Inventário Geral',
        data: assets.map(a => ({
          Tag: a.tag,
          Nome: a.name,
          Tipo: a.type,
          Propriedade: a.ownership,
          Marca: a.brand,
          Modelo: a.model,
          Serial: a.serialNumber,
          Garantia: a.warrantyExpiresAt,
          Status: a.status,
          Departamento: a.location.department
        }))
      },
      {
        name: 'Empréstimos',
        data: loans.map(l => ({
          Protocolo: l.protocolNumber,
          TipoCautela: l.termType === 'rpas_drone' ? 'RPAS Drone (Case)' : l.termType === 'multimidia' ? 'Multimídia' : 'Geral TI',
          Item: l.assetName,
          Tag: l.assetTag,
          Colaborador: l.borrowerName,
          Depto: l.borrowerDepartment,
          DataEmprestimo: l.loanDate,
          Prazo: l.expectedReturnDate,
          Status: l.status
        }))
      }
    ];

    downloadExcel(`relatorio_consolidado_parque_ti_${new Date().toISOString().split('T')[0]}`, sheets);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Controls Header (Hidden during print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Central de Relatórios Gerenciais & Exportação
          </h2>
          <p className="text-xs text-slate-400">
            Exportação em formatos abertos (PDF & CSV / Excel) para auditorias corporativas e governamentais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleExportFullExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar Excel Completo (.xlsx)</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Gerar PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector (no-print) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 no-print">
        <button
          onClick={() => setSelectedReport('mensal_mov')}
          className={`p-3 rounded-xl border text-left transition-colors ${
            selectedReport === 'mensal_mov'
              ? 'bg-slate-800 border-cyan-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-xs font-semibold block">Movimentação Mensal</span>
          <span className="text-[11px] text-slate-400">Entradas, saídas e transferências</span>
        </button>

        <button
          onClick={() => setSelectedReport('inventario')}
          className={`p-3 rounded-xl border text-left transition-colors ${
            selectedReport === 'inventario'
              ? 'bg-slate-800 border-cyan-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-xs font-semibold block">Inventário Físico & Status</span>
          <span className="text-[11px] text-slate-400">Posição consolidada do parque</span>
        </button>

        <button
          onClick={() => setSelectedReport('alugados')}
          className={`p-3 rounded-xl border text-left transition-colors ${
            selectedReport === 'alugados'
              ? 'bg-slate-800 border-cyan-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-xs font-semibold block">Ativos Alugados & Custos</span>
          <span className="text-[11px] text-slate-400">Contratos e despesas de locação</span>
        </button>

        <button
          onClick={() => setSelectedReport('auditoria')}
          className={`p-3 rounded-xl border text-left transition-colors ${
            selectedReport === 'auditoria'
              ? 'bg-slate-800 border-cyan-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-xs font-semibold block">Trilha de Auditoria</span>
          <span className="text-[11px] text-slate-400">Conformidade e logs imutáveis</span>
        </button>
      </div>

      {/* Filter bar for Month / Type (no-print) */}
      {selectedReport === 'mensal_mov' && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 no-print text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-medium">Mês de Referência:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 font-medium">Tipo:</span>
              <select
                value={movementTypeFilter}
                onChange={e => setMovementTypeFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-slate-200"
              >
                <option value="todos">Todas as movimentações</option>
                <option value="entrada">Entradas</option>
                <option value="saida">Saídas / Consumo</option>
                <option value="emprestimo">Empréstimos</option>
                <option value="devolucao">Devoluções</option>
                <option value="reposicao_automatica">Reposições Automáticas</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-400">+{totalEntradas} entradas</span>
            <span className="text-amber-400">-{totalSaidas} saídas</span>
            <span className="text-purple-400">{totalEmprestimos} empréstimos</span>
            <span className="text-cyan-400">{totalDevolucoes} devoluções</span>
          </div>
        </div>
      )}

      {/* FORMAL REPORT CANVAS (Print Ready & High Definition) */}
      <div className="p-8 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl print-full font-sans text-xs space-y-6">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {systemSettings.termsLogoUrl ? (
              <img
                src={systemSettings.termsLogoUrl}
                alt="Brasão Oficial"
                className="w-14 h-14 object-contain shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs uppercase shrink-0">
                {systemSettings.companyName.substring(0, 3)}
              </div>
            )}
            <div>
              <div className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest">
                {systemSettings.companyName} · {systemSettings.systemName}
              </div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
                {selectedReport === 'mensal_mov' && `RELATÓRIO MENSAL DE MOVIMENTAÇÃO DE ITENS (${selectedMonth})`}
                {selectedReport === 'inventario' && 'RELATÓRIO CONSOLIDADO DE INVENTÁRIO FÍSICO'}
                {selectedReport === 'alugados' && 'RELATÓRIO DE EQUIPAMENTOS ALUGADOS E CONTRATOS'}
                {selectedReport === 'auditoria' && 'RELATÓRIO GERAL DA TRILHA DE AUDITORIA'}
              </h1>
              <p className="text-[10px] text-slate-600 mt-0.5">
                {systemSettings.departmentName} · Emitido em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')} por <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Status da Auditoria</div>
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 mt-0.5">
              DOCUMENTO OFICIAL
            </div>
          </div>
        </div>

        {/* Executive Summary Metrics Box */}
        {selectedReport === 'mensal_mov' && (
          <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-medium">Entradas / Reposição</span>
              <div className="text-lg font-bold font-mono text-emerald-700">+{totalEntradas} un</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-medium">Saídas / Consumo</span>
              <div className="text-lg font-bold font-mono text-amber-700">-{totalSaidas} un</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-medium">Empréstimos Concedidos</span>
              <div className="text-lg font-bold font-mono text-purple-700">{totalEmprestimos} un</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-medium">Devoluções no Período</span>
              <div className="text-lg font-bold font-mono text-cyan-700">{totalDevolucoes} un</div>
            </div>
          </div>
        )}

        {/* Table Content */}
        {selectedReport === 'mensal_mov' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700 font-bold">
                  <th className="py-2">Data/Hora</th>
                  <th className="py-2">Tipo</th>
                  <th className="py-2">Patrimônio</th>
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qtd</th>
                  <th className="py-2">Origem / Destino</th>
                  <th className="py-2">Justificativa / Motivo</th>
                  <th className="py-2">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-slate-500">
                      Nenhuma movimentação registrada no mês {selectedMonth}.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map(m => (
                    <tr key={m.id}>
                      <td className="py-2 font-mono text-slate-600">
                        {new Date(m.timestamp).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-2 uppercase font-mono font-bold text-[10px]">
                        {m.type.replace('_', ' ')}
                      </td>
                      <td className="py-2 font-mono font-semibold text-slate-800">
                        {m.assetTag}
                      </td>
                      <td className="py-2 font-medium text-slate-900">
                        {m.assetName}
                      </td>
                      <td className="py-2 text-center font-mono font-bold">
                        {m.quantity}
                      </td>
                      <td className="py-2 text-slate-600">
                        {m.origin || '-'} → {m.destination || '-'}
                      </td>
                      <td className="py-2 text-slate-600">
                        {m.reason}
                      </td>
                      <td className="py-2 text-slate-700">
                        {m.responsibleName}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'inventario' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700 font-bold">
                  <th className="py-2">Patrimônio</th>
                  <th className="py-2">Equipamento / Modelo</th>
                  <th className="py-2">Regime</th>
                  <th className="py-2">Número de Série (S/N)</th>
                  <th className="py-2">Garantia</th>
                  <th className="py-2">Departamento</th>
                  <th className="py-2 text-center">Status</th>
                  <th className="py-2 text-right">Valor Compra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {assets.map(a => (
                  <tr key={a.id}>
                    <td className="py-2 font-mono font-bold text-slate-900">{a.tag}</td>
                    <td className="py-2 font-medium">{a.name} ({a.brand})</td>
                    <td className="py-2 uppercase font-mono text-[10px]">{a.ownership}</td>
                    <td className="py-2 font-mono text-slate-600">{a.serialNumber}</td>
                    <td className="py-2 font-mono text-slate-600">{a.warrantyExpiresAt || '—'}</td>
                    <td className="py-2 text-slate-700">{a.location.department}</td>
                    <td className="py-2 text-center uppercase text-[10px]">{a.status}</td>
                    <td className="py-2 font-mono text-right">
                      {a.purchaseValue ? `R$ ${a.purchaseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'alugados' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700 font-bold">
                  <th className="py-2">Contrato</th>
                  <th className="py-2">Empresa</th>
                  <th className="py-2">Patrimônio</th>
                  <th className="py-2">Equipamento</th>
                  <th className="py-2">Vigência</th>
                  <th className="py-2 text-right">Mensalidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {assets.filter(a => a.ownership === 'alugado').map(a => (
                  <tr key={a.id}>
                    <td className="py-2 font-mono font-bold text-purple-700">{a.rentalInfo?.contractNumber || 'N/A'}</td>
                    <td className="py-2 font-medium">{a.rentalInfo?.rentalCompany}</td>
                    <td className="py-2 font-mono font-semibold">{a.tag}</td>
                    <td className="py-2">{a.name}</td>
                    <td className="py-2 font-mono text-slate-600">
                      {a.rentalInfo?.rentalStartDate} → {a.rentalInfo?.rentalEndDate}
                    </td>
                    <td className="py-2 font-mono text-right font-bold text-emerald-800">
                      R$ {(a.rentalInfo?.monthlyCost || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'auditoria' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700 font-bold">
                  <th className="py-2">Data/Hora</th>
                  <th className="py-2">Usuário</th>
                  <th className="py-2">Ação</th>
                  <th className="py-2">Entidade</th>
                  <th className="py-2">Resumo da Movimentação</th>
                  <th className="py-2">IP Origem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {auditLogs.slice(0, 20).map(l => (
                  <tr key={l.id}>
                    <td className="py-2 font-mono text-slate-600">{new Date(l.timestamp).toLocaleString('pt-BR')}</td>
                    <td className="py-2 font-medium">{l.userName} ({l.userRole})</td>
                    <td className="py-2 font-mono text-[10px] font-bold uppercase">{l.action}</td>
                    <td className="py-2">{l.entityType}</td>
                    <td className="py-2 text-slate-800">{l.summary}</td>
                    <td className="py-2 font-mono text-slate-500">{l.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit Sign-off Area */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-[10px] text-slate-600">
          <div>
            <div className="border-t border-slate-400 pt-1">
              <strong>{currentUser.name}</strong><br />
              Gestor Responsável pelo Parque Tecnológico
            </div>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1">
              <strong>Controladoria & Compliance Interno</strong><br />
              Visto de Auditoria e Conformidade
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
