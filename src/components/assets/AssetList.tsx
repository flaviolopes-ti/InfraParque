import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Layers, 
  Download, 
  QrCode, 
  ArrowLeftRight, 
  Trash2, 
  Edit3, 
  Eye,
  AlertCircle,
  FileSpreadsheet,
  Boxes,
  MapPin,
  SlidersHorizontal
} from 'lucide-react';
import { Asset, UserProfile, AssetType, OwnershipType, AssetStatus } from '../../types';
import { downloadCsv } from '../../utils/exportUtils';

interface AssetListProps {
  assets: Asset[];
  currentUser: UserProfile;
  onSelectAsset: (asset: Asset) => void;
  onOpenNewAsset: () => void;
  onOpenBulkAdd: () => void;
  onStartLoan: (asset: Asset) => void;
  onStartMultiLoan?: (assets: Asset[]) => void;
  onStartTransfer?: (asset: Asset) => void;
  onStartMultiTransfer?: (assets: Asset[]) => void;
  onOpenCategoryManager?: () => void;
  onDeleteAsset: (id: string) => void;
  onOpenImport: () => void;
}

export const AssetList: React.FC<AssetListProps> = ({
  assets,
  currentUser,
  onSelectAsset,
  onOpenNewAsset,
  onOpenBulkAdd,
  onStartLoan,
  onStartMultiLoan,
  onStartTransfer,
  onStartMultiTransfer,
  onOpenCategoryManager,
  onDeleteAsset,
  onOpenImport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'todos' | AssetType>('todos');
  const [ownershipFilter, setOwnershipFilter] = useState<'todos' | OwnershipType>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | AssetStatus>('todos');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Filter logic
  const filteredAssets = assets.filter(item => {
    // Search query
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(query) ||
      item.tag.toLowerCase().includes(query) ||
      item.serialNumber.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.model.toLowerCase().includes(query) ||
      item.location.department.toLowerCase().includes(query) ||
      item.location.building.toLowerCase().includes(query) ||
      (item.assignedTo?.name || '').toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // Type filter
    if (typeFilter !== 'todos' && item.type !== typeFilter) return false;

    // Ownership filter
    if (ownershipFilter !== 'todos' && item.ownership !== ownershipFilter) return false;

    // Status filter
    if (statusFilter !== 'todos' && item.status !== statusFilter) return false;

    // Category filter
    if (categoryFilter !== 'todos' && item.category !== categoryFilter) return false;

    return true;
  });

  const handleExportCsv = () => {
    const rows = filteredAssets.map(a => ({
      'Tag Patrimônio': a.tag,
      'Nome': a.name,
      'Tipo': a.type,
      'Propriedade': a.ownership,
      'Categoria': a.category,
      'Marca': a.brand,
      'Modelo': a.model,
      'Número de Série': a.serialNumber,
      'Vencimento Garantia': a.warrantyExpiresAt,
      'Data Aquisição': a.acquisitionDate,
      'Status': a.status,
      'Prédio': a.location.building,
      'Departamento': a.location.department,
      'Saldo Estoque': a.suppliesInfo?.currentStock ?? 'N/A',
      'Estoque Mínimo': a.suppliesInfo?.minStockThreshold ?? 'N/A',
      'Locadora': a.rentalInfo?.rentalCompany ?? 'N/A',
      'Contrato Locação': a.rentalInfo?.contractNumber ?? 'N/A',
      'Custo Mensal Locação': a.rentalInfo?.monthlyCost ?? 0,
      'Valor Compra': a.purchaseValue ?? 0
    }));

    downloadCsv(`inventario_ativos_${new Date().toISOString().split('T')[0]}`, rows);
  };

  const toggleSelectAll = () => {
    if (selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map(a => a.id));
    }
  };

  const toggleSelectAsset = (id: string) => {
    if (selectedAssetIds.includes(id)) {
      setSelectedAssetIds(selectedAssetIds.filter(item => item !== id));
    } else {
      setSelectedAssetIds([...selectedAssetIds, id]);
    }
  };

  const clearSelection = () => {
    setSelectedAssetIds([]);
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      
      {/* Multi-Item Floating Action Bar */}
      {selectedAssetIds.length > 0 && (
        <div className="p-3 bg-cyan-950/90 border border-cyan-500/50 rounded-xl flex items-center justify-between shadow-xl sticky top-0 z-20 backdrop-blur-sm animate-in fade-in">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-white bg-cyan-600 px-2 py-0.5 rounded border border-cyan-400 font-mono">
              {selectedAssetIds.length} selecionado{selectedAssetIds.length !== 1 ? 's' : ''}
            </span>
            <span className="text-cyan-200">
              Equipamentos marcados para emissão conjunta de Cautela ou RPAS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg transition-colors"
            >
              Desmarcar Todos
            </button>
            {onStartMultiTransfer && currentUser.role !== 'auditor' && (
              <button
                onClick={() => onStartMultiTransfer(assets.filter(a => selectedAssetIds.includes(a.id)))}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                title="Transferir equipamentos selecionados para outro prédio, andar, sala ou departamento"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mudar Local ({selectedAssetIds.length})</span>
              </button>
            )}

            {onStartMultiLoan && currentUser.role !== 'auditor' && (
              <button
                onClick={() => onStartMultiLoan(assets.filter(a => selectedAssetIds.includes(a.id)))}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm transition-colors"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Emitir Termo ({selectedAssetIds.length})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Inventário Geral do Parque</h2>
          <p className="text-xs text-slate-400">
            {filteredAssets.length} de {assets.length} ativos listados
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title="Exportar dados filtrados para CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title="Importar planilha Excel existente"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Importar Planilha</span>
          </button>

          {onOpenCategoryManager && (
            <button
              onClick={onOpenCategoryManager}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Gerenciar categorias de equipamentos/suprimentos e listas suspensas"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Categorias & Listas</span>
            </button>
          )}

          {currentUser.role !== 'auditor' && currentUser.role !== 'solicitante' && (
            <>
              <button
                onClick={onOpenBulkAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Cadastro em Lote</span>
              </button>

              <button
                onClick={onOpenNewAsset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cadastrar Ativo</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por tag, chapa de patrimônio, serial S/N, marca, modelo, departamento ou colaborador..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Tipo:</span>
            <div className="flex p-0.5 bg-slate-950 rounded-md border border-slate-800">
              <button
                onClick={() => setTypeFilter('todos')}
                className={`px-2 py-1 rounded text-[11px] ${typeFilter === 'todos' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setTypeFilter('equipamento')}
                className={`px-2 py-1 rounded text-[11px] ${typeFilter === 'equipamento' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Equipamentos
              </button>
              <button
                onClick={() => setTypeFilter('suprimento')}
                className={`px-2 py-1 rounded text-[11px] ${typeFilter === 'suprimento' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Suprimentos
              </button>
            </div>
          </div>

          {/* Ownership Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Propriedade:</span>
            <div className="flex p-0.5 bg-slate-950 rounded-md border border-slate-800">
              <button
                onClick={() => setOwnershipFilter('todos')}
                className={`px-2 py-1 rounded text-[11px] ${ownershipFilter === 'todos' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setOwnershipFilter('proprio')}
                className={`px-2 py-1 rounded text-[11px] ${ownershipFilter === 'proprio' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Próprios
              </button>
              <button
                onClick={() => setOwnershipFilter('alugado')}
                className={`px-2 py-1 rounded text-[11px] ${ownershipFilter === 'alugado' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Alugados
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-md text-[11px] text-slate-200 focus:outline-hidden"
            >
              <option value="todos">Todos os status</option>
              <option value="disponivel">Disponível</option>
              <option value="em_uso">Em Uso</option>
              <option value="emprestado">Emprestado</option>
              <option value="manutencao">Manutenção</option>
              <option value="reservado">Reservado</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Categoria:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-md text-[11px] text-slate-200 focus:outline-hidden"
            >
              <option value="todos">Todas as categorias</option>
              <option value="rpas_drone">RPAS / Drones</option>
              <option value="multimidia">Multimídia / Som</option>
              <option value="notebook">Notebooks</option>
              <option value="desktop">Desktops</option>
              <option value="servidor">Servidores</option>
              <option value="monitor">Monitores</option>
              <option value="rede">Rede / Switches</option>
              <option value="impressora">Impressoras</option>
              <option value="suprimento_toner">Toners</option>
              <option value="suprimento_cabo">Cabos</option>
              <option value="periferico">Periféricos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="w-10 py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0}
                    onChange={toggleSelectAll}
                    title="Selecionar / Desmarcar todos os itens visíveis"
                    className="rounded text-cyan-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-medium">Patrimônio / Tag</th>
                <th className="py-3 px-4 font-medium">Descrição & Modelo</th>
                <th className="py-3 px-4 font-medium">Tipo / Regime</th>
                <th className="py-3 px-4 font-medium">Número de Série (S/N)</th>
                <th className="py-3 px-4 font-medium">Garantia / Término</th>
                <th className="py-3 px-4 font-medium">Localização / Depto</th>
                <th className="py-3 px-4 font-medium text-center">Status / Saldo</th>
                <th className="py-3 px-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Boxes className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm font-medium text-slate-300">Nenhum ativo encontrado</p>
                    <p className="text-xs text-slate-500 mt-0.5">Tente ajustar os filtros ou cadastre um novo item.</p>
                  </td>
                </tr>
              ) : (
                filteredAssets.map(asset => {
                  const now = new Date();
                  let daysLeft = null;
                  let isExpired = false;
                  if (asset.warrantyExpiresAt) {
                    const exp = new Date(asset.warrantyExpiresAt);
                    daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 3600 * 24));
                    isExpired = daysLeft < 0;
                  }

                  const isCriticalSupply = 
                    asset.type === 'suprimento' && 
                    asset.suppliesInfo && 
                    asset.suppliesInfo.currentStock <= asset.suppliesInfo.minStockThreshold;

                  const isSelected = selectedAssetIds.includes(asset.id);

                  return (
                    <tr 
                      key={asset.id} 
                      className={`transition-colors cursor-pointer group ${
                        isSelected ? 'bg-cyan-950/40 hover:bg-cyan-950/60' : 'hover:bg-slate-800/40'
                      }`}
                      onClick={() => onSelectAsset(asset)}
                    >
                      {/* Checkbox */}
                      <td className="w-10 py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectAsset(asset.id)}
                          className="rounded text-cyan-500 cursor-pointer"
                        />
                      </td>

                      {/* Tag */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded text-[11px]">
                            {asset.tag}
                          </span>
                        </div>
                      </td>

                      {/* Name & Model */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {asset.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {asset.brand} · {asset.model}
                        </div>
                      </td>

                      {/* Regime */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                            asset.ownership === 'alugado' ? 'text-purple-400' : 'text-slate-300'
                          }`}>
                            {asset.ownership === 'alugado' ? 'Alugado' : 'Próprio'}
                          </span>
                          {asset.ownership === 'alugado' && asset.rentalInfo && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              R$ {asset.rentalInfo.monthlyCost.toFixed(0)}/mês
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Serial Number */}
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {asset.serialNumber || '—'}
                      </td>

                      {/* Warranty */}
                      <td className="py-3 px-4 font-mono">
                        {asset.warrantyExpiresAt ? (
                          <div>
                            <span className="text-slate-300">
                              {new Date(asset.warrantyExpiresAt).toLocaleDateString('pt-BR')}
                            </span>
                            {daysLeft !== null && (
                              <span className={`block text-[10px] font-semibold ${
                                isExpired ? 'text-rose-400' : daysLeft <= 30 ? 'text-amber-400' : 'text-emerald-400'
                              }`}>
                                {isExpired ? 'Garantia expirada' : `${daysLeft}d restantes`}
                              </span>
                            )}
                          </div>
                        ) : '—'}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4">
                        <div className="text-slate-300">{asset.location.department}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {asset.location.building} · {asset.location.room}
                        </div>
                      </td>

                      {/* Status / Stock */}
                      <td className="py-3 px-4 text-center">
                        {asset.type === 'suprimento' && asset.suppliesInfo ? (
                          <div className="flex flex-col items-center">
                            <span className={`font-mono font-bold text-xs ${
                              isCriticalSupply ? 'text-rose-400' : 'text-white'
                            }`}>
                              {asset.suppliesInfo.currentStock} {asset.suppliesInfo.unit}
                            </span>
                            {isCriticalSupply && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 uppercase font-semibold">
                                Repor!
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-medium capitalize ${
                            asset.status === 'disponivel' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' :
                            asset.status === 'em_uso' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800' :
                            asset.status === 'emprestado' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {asset.status.replace('_', ' ')}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectAsset(asset)}
                            title="Ver Ficha Completa & QR Code"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {asset.status === 'disponivel' && currentUser.role !== 'auditor' && (
                            <button
                              onClick={() => onStartLoan(asset)}
                              title="Emprestar este equipamento"
                              className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50 rounded transition-colors"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {onStartTransfer && currentUser.role !== 'auditor' && (
                            <button
                              onClick={() => onStartTransfer(asset)}
                              title="Transferir / Mudar Localização (Prédio, Andar, Sala, Depto)"
                              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Deseja realmente excluir ou dar baixa no ativo ${asset.tag}?`)) {
                                  onDeleteAsset(asset.id);
                                }
                              }}
                              title="Excluir / Dar Baixa"
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

    </div>
  );
};
