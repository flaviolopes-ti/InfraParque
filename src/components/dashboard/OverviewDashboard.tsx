import React, { useState } from 'react';
import { 
  Laptop, 
  ArrowLeftRight, 
  Boxes, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  FileCheck2,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Asset, Loan, Movement, ReplenishmentOrder, SystemNotification } from '../../types';

interface OverviewDashboardProps {
  assets: Asset[];
  loans: Loan[];
  movements: Movement[];
  orders: ReplenishmentOrder[];
  notifications: SystemNotification[];
  onNavigateTab: (tab: any) => void;
  onFilterCategory?: (category: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  assets,
  loans,
  movements,
  orders,
  notifications,
  onNavigateTab,
  onFilterCategory
}) => {
  const [subView, setSubView] = useState<'geral' | 'alugados' | 'suprimentos' | 'emprestimos'>('geral');

  // KPI Calculations
  const totalAssets = assets.length;
  const ownedAssets = assets.filter(a => a.ownership === 'proprio');
  const rentedAssets = assets.filter(a => a.ownership === 'alugado');
  
  const equipmentCount = assets.filter(a => a.type === 'equipamento').length;
  const suppliesCount = assets.filter(a => a.type === 'suprimento').length;

  const activeLoans = loans.filter(l => l.status === 'ativo');
  const overdueLoans = loans.filter(l => l.status === 'atrasado');

  const criticalSupplies = assets.filter(
    a => a.type === 'suprimento' && a.suppliesInfo && a.suppliesInfo.currentStock <= a.suppliesInfo.minStockThreshold
  );

  const monthlyRentalTotal = rentedAssets.reduce(
    (acc, a) => acc + (a.rentalInfo?.monthlyCost || 0), 0
  );

  const totalPurchaseValue = ownedAssets.reduce(
    (acc, a) => acc + (a.purchaseValue || 0), 0
  );

  // Warranties expiring in next 60 days
  const now = new Date();
  const expiringWarranties = assets.filter(a => {
    if (!a.warrantyExpiresAt) return false;
    const exp = new Date(a.warrantyExpiresAt);
    const diff = (exp.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diff <= 60 && diff >= 0;
  });

  // Expired warranties
  const expiredWarranties = assets.filter(a => {
    if (!a.warrantyExpiresAt) return false;
    const exp = new Date(a.warrantyExpiresAt);
    return exp < now;
  });

  // Brands breakdown
  const brandCounts: Record<string, number> = {};
  assets.forEach(a => {
    brandCounts[a.brand] = (brandCounts[a.brand] || 0) + 1;
  });
  const topBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Status breakdown
  const statusCounts = {
    disponivel: assets.filter(a => a.status === 'disponivel').length,
    em_uso: assets.filter(a => a.status === 'em_uso').length,
    emprestado: assets.filter(a => a.status === 'emprestado').length,
    manutencao: assets.filter(a => a.status === 'manutencao').length,
    reservado: assets.filter(a => a.status === 'reservado').length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Specific Dashboard Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setSubView('geral')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              subView === 'geral' 
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visão Geral Executiva
          </button>
          <button
            onClick={() => setSubView('alugados')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              subView === 'alugados' 
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Equipamentos Alugados vs Próprios
          </button>
          <button
            onClick={() => setSubView('suprimentos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              subView === 'suprimentos' 
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reposição de Suprimentos ({criticalSupplies.length})
          </button>
          <button
            onClick={() => setSubView('emprestimos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              subView === 'emprestimos' 
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Empréstimos Ativos ({activeLoans.length + overdueLoans.length})
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Última sincronização:</span>
          <span className="font-mono text-slate-300">Hoje, {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Top Critical Alert Bar if any high severity */}
      {(criticalSupplies.length > 0 || overdueLoans.length > 0 || expiringWarranties.length > 0) && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-200">
                Atenção Operacional Requerida
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {criticalSupplies.length > 0 && `${criticalSupplies.length} suprimento(s) com estoque crítico para reposição automática. `}
                {overdueLoans.length > 0 && `${overdueLoans.length} empréstimo(s) em atraso com prazo estourado. `}
                {expiringWarranties.length > 0 && `${expiringWarranties.length} garantia(s) vencendo em até 60 dias.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab(criticalSupplies.length > 0 ? 'replenishment' : 'loans')}
            className="px-3 py-1.5 text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg whitespace-nowrap transition-colors"
          >
            Ver Detalhes
          </button>
        </div>
      )}

      {/* Primary KPI Metric Strip (Always visible) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total de Ativos Cadastrados</span>
            <Laptop className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {totalAssets}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
            <span>{equipmentCount} equipamentos</span>
            <span aria-hidden="true">·</span>
            <span>{suppliesCount} suprimentos</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Alugados vs Próprios</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {rentedAssets.length} <span className="text-sm font-normal text-slate-400">/ {ownedAssets.length}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
            <span>{((rentedAssets.length / (totalAssets || 1)) * 100).toFixed(0)}% locados</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">R$ {monthlyRentalTotal.toLocaleString('pt-BR')}/mês</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Empréstimos Ativos</span>
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {activeLoans.length + overdueLoans.length}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
            <span className={overdueLoans.length > 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
              {overdueLoans.length} em atraso
            </span>
            <span aria-hidden="true">·</span>
            <span>{activeLoans.length} no prazo</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Alertas de Reposição</span>
            <Boxes className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {criticalSupplies.length}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
            <span>{orders.length} pedidos sugeridos</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">Reposição auto</span>
          </div>
        </div>
      </div>

      {/* CONDITIONAL SUBVIEWS */}
      {subView === 'geral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Breakdown & Distribution */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Disponibilidade do Parque</h3>
              <span className="text-xs text-slate-400 font-mono tabular-nums">{totalAssets} itens</span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Em Uso Contínuo</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{statusCounts.em_uso} ({((statusCounts.em_uso / (totalAssets || 1)) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${(statusCounts.em_uso / (totalAssets || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Disponível em Estoque / Pool</span>
                  <span className="font-mono text-emerald-400 tabular-nums">{statusCounts.disponivel} ({((statusCounts.disponivel / (totalAssets || 1)) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(statusCounts.disponivel / (totalAssets || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Empréstimos Temporários</span>
                  <span className="font-mono text-amber-400 tabular-nums">{statusCounts.emprestado} ({((statusCounts.emprestado / (totalAssets || 1)) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(statusCounts.emprestado / (totalAssets || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Manutenção / Assistência</span>
                  <span className="font-mono text-rose-400 tabular-nums">{statusCounts.manutencao} ({((statusCounts.manutencao / (totalAssets || 1)) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${(statusCounts.manutencao / (totalAssets || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">Principais Fabricantes</h4>
              <div className="space-y-1.5">
                {topBrands.map(([brand, count]) => (
                  <div key={brand} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{brand}</span>
                    <span className="font-mono text-slate-200 tabular-nums">{count} itens</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Movement & Activity Feed */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Últimas Movimentações Registradas</h3>
                  <p className="text-xs text-slate-400">Histórico rastreável para auditoria e controle</p>
                </div>
                <button
                  onClick={() => onNavigateTab('reports')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <span>Relatório Mensal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-800/80">
                {movements.slice(0, 5).map((mov) => (
                  <div key={mov.id} className="py-2.5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                        mov.type === 'saida' ? 'bg-amber-400' :
                        mov.type === 'entrada' ? 'bg-emerald-400' :
                        mov.type === 'reposicao_automatica' ? 'bg-cyan-400' :
                        mov.type === 'emprestimo' ? 'bg-purple-400' : 'bg-slate-400'
                      }`} />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {mov.assetName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-slate-300">{mov.assetTag}</span>
                          <span aria-hidden="true">·</span>
                          <span>{mov.reason}</span>
                          {mov.destination && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-slate-300">Destino: {mov.destination}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(mov.timestamp).toLocaleDateString('pt-BR')}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        por {mov.responsibleName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Total de movimentações computadas: <strong className="text-white font-mono">{movements.length}</strong></span>
              <button
                onClick={() => onNavigateTab('audit')}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Acessar logs de auditoria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW: Alugados vs Próprios */}
      {subView === 'alugados' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Equipamentos Locados</span>
              <div className="text-2xl font-bold text-purple-400 font-mono mt-1">{rentedAssets.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">Gerenciados sob contratos de locação operacional</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Custo Total de Locação Mensal</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                R$ {monthlyRentalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Faturamento recorrente consolidado</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Ativos Próprios (Tombamento)</span>
              <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{ownedAssets.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">Valor patrimonial: R$ {totalPurchaseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-3">Tabela de Contratos de Locação Ativos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 font-medium">Contrato</th>
                    <th className="py-2.5 font-medium">Locadora / Fornecedor</th>
                    <th className="py-2.5 font-medium">Item & Tag</th>
                    <th className="py-2.5 font-medium">Início / Término</th>
                    <th className="py-2.5 font-medium text-right">Mensalidade</th>
                    <th className="py-2.5 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {rentedAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-mono text-cyan-400 font-medium">
                        {asset.rentalInfo?.contractNumber || 'N/A'}
                      </td>
                      <td className="py-2.5 text-slate-200">
                        {asset.rentalInfo?.rentalCompany || 'Não informada'}
                      </td>
                      <td className="py-2.5">
                        <div className="text-slate-200 font-medium">{asset.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{asset.tag} · {asset.serialNumber}</div>
                      </td>
                      <td className="py-2.5 font-mono text-slate-300">
                        {asset.rentalInfo?.rentalStartDate ? new Date(asset.rentalInfo.rentalStartDate).toLocaleDateString('pt-BR') : '-'}
                        {' → '}
                        {asset.rentalInfo?.rentalEndDate ? new Date(asset.rentalInfo.rentalEndDate).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="py-2.5 font-mono text-right text-emerald-400">
                        R$ {(asset.rentalInfo?.monthlyCost || 0).toFixed(2)}
                      </td>
                      <td className="py-2.5 text-center">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-medium">
                          Vigente
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW: Suprimentos & Reposição Automática */}
      {subView === 'suprimentos' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Status de Estoque de Suprimentos & Consumíveis</h3>
                <p className="text-xs text-slate-400">Sistema com gatilho automático de compras ao atingir o ponto de reposição</p>
              </div>
              <button
                onClick={() => onNavigateTab('replenishment')}
                className="px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Gerenciar Pedidos de Reposição
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.filter(a => a.type === 'suprimento').map(supply => {
                const info = supply.suppliesInfo;
                if (!info) return null;
                const isCritical = info.currentStock <= info.minStockThreshold;

                return (
                  <div 
                    key={supply.id} 
                    className={`p-4 rounded-xl border ${
                      isCritical ? 'bg-rose-950/20 border-rose-800/60' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono text-cyan-400">{supply.tag}</span>
                        <h4 className="text-xs font-semibold text-slate-200 truncate mt-0.5">{supply.name}</h4>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {supply.brand} · {info.shelfLocation}
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase font-mono ${
                        isCritical ? 'bg-rose-900/80 text-rose-300 border border-rose-700' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {isCritical ? 'Reposição' : 'Normal'}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400">Saldo Atual</span>
                        <div className="text-lg font-bold font-mono text-white">
                          {info.currentStock} <span className="text-xs font-normal text-slate-400">{info.unit}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400">Mínimo de Segurança</span>
                        <div className="text-sm font-semibold font-mono text-slate-300">
                          {info.minStockThreshold} {info.unit}
                        </div>
                      </div>
                    </div>

                    {isCritical && (
                      <div className="mt-2 text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900/50">
                        Gatilho automático: Pedido sugerido de <strong>{info.suggestedOrderQty} {info.unit}</strong> com <em>{info.supplierName}</em>.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW: Empréstimos */}
      {subView === 'emprestimos' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Gestão Operacional de Cautelas e Empréstimos</h3>
                <p className="text-xs text-slate-400">Controle de equipamentos retirados temporariamente com termo de cautela assinado</p>
              </div>
              <button
                onClick={() => onNavigateTab('loans')}
                className="px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Abrir Central de Empréstimos
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 font-medium">Protocolo</th>
                    <th className="py-2.5 font-medium">Equipamento</th>
                    <th className="py-2.5 font-medium">Colaborador / Depto</th>
                    <th className="py-2.5 font-medium">Data Empréstimo</th>
                    <th className="py-2.5 font-medium">Prazo Devolução</th>
                    <th className="py-2.5 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {loans.map(loan => (
                    <tr key={loan.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-mono text-cyan-400 font-medium">
                        {loan.protocolNumber}
                      </td>
                      <td className="py-2.5">
                        <div className="text-slate-200 font-medium">{loan.assetName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{loan.assetTag} · S/N: {loan.assetSerial}</div>
                      </td>
                      <td className="py-2.5">
                        <div className="text-slate-200">{loan.borrowerName}</div>
                        <div className="text-[10px] text-slate-400">{loan.borrowerDepartment} ({loan.borrowerDoc})</div>
                      </td>
                      <td className="py-2.5 font-mono text-slate-300">
                        {new Date(loan.loanDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-2.5 font-mono">
                        <span className={loan.status === 'atrasado' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {new Date(loan.expectedReturnDate).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          loan.status === 'atrasado'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                            : loan.status === 'ativo'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        }`}>
                          {loan.status === 'atrasado' ? 'Atrasado' : loan.status === 'ativo' ? 'Em Aberto' : 'Devolvido'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
