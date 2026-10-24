import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Building2, MapPin, Check, AlertCircle, Layers } from 'lucide-react';
import { Asset, CatalogOptions } from '../../types';
import { SearchableCombobox } from '../common/SearchableCombobox';

interface TransferAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAssets: Asset[];
  catalogOptions: CatalogOptions;
  onAddNewOption: (field: keyof CatalogOptions, value: string) => void;
  onTransfer: (
    assetIds: string[],
    newLocation: {
      building: string;
      floor: string;
      room: string;
      department: string;
    },
    reason: string
  ) => void;
}

export const TransferAssetModal: React.FC<TransferAssetModalProps> = ({
  isOpen,
  onClose,
  targetAssets,
  catalogOptions,
  onAddNewOption,
  onTransfer
}) => {
  if (!isOpen || targetAssets.length === 0) return null;

  const primaryAsset = targetAssets[0];

  const [building, setBuilding] = useState(primaryAsset.location.building || '');
  const [floor, setFloor] = useState(primaryAsset.location.floor || '');
  const [room, setRoom] = useState(primaryAsset.location.room || '');
  const [department, setDepartment] = useState(primaryAsset.location.department || '');
  const [reason, setReason] = useState('Remanejamento interno de posto de trabalho');
  const [error, setError] = useState('');

  useEffect(() => {
    if (primaryAsset) {
      setBuilding(primaryAsset.location.building || '');
      setFloor(primaryAsset.location.floor || '');
      setRoom(primaryAsset.location.room || '');
      setDepartment(primaryAsset.location.department || '');
      setReason('Remanejamento interno de posto de trabalho');
      setError('');
    }
  }, [primaryAsset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!building.trim() || !floor.trim() || !room.trim() || !department.trim()) {
      setError('Por favor, preencha todos os campos do novo local (Prédio, Andar, Sala e Departamento).');
      return;
    }
    if (!reason.trim()) {
      setError('Informe o motivo ou justificativa da mudança de localização.');
      return;
    }

    const newLocation = {
      building: building.trim(),
      floor: floor.trim(),
      room: room.trim(),
      department: department.trim()
    };

    const assetIds = targetAssets.map(a => a.id);
    onTransfer(assetIds, newLocation, reason.trim());
    onClose();
  };

  const isMulti = targetAssets.length > 1;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {isMulti ? `Transferir ${targetAssets.length} Equipamentos` : 'Mudança de Localização do Equipamento'}
              </h2>
              <p className="text-xs text-slate-400">
                Altere Prédio, Andar, Sala/Posição e Departamento com registro em trilha de auditoria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Asset Summary */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {isMulti ? 'Equipamentos a Serem Transferidos' : 'Equipamento Selecionado'}
            </span>
            {isMulti ? (
              <div className="max-h-24 overflow-y-auto space-y-1">
                {targetAssets.map(a => (
                  <div key={a.id} className="flex items-center justify-between text-xs text-slate-300 py-0.5">
                    <span className="font-mono text-cyan-400 font-semibold">{a.tag}</span>
                    <span className="truncate max-w-[280px]">{a.name}</span>
                    <span className="text-[11px] text-slate-500">{a.location.room}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{primaryAsset.name}</div>
                  <div className="text-slate-400 text-[11px]">
                    Tag: <span className="font-mono text-cyan-400 font-semibold">{primaryAsset.tag}</span> · S/N: <span className="font-mono">{primaryAsset.serialNumber || 'N/A'}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                  {primaryAsset.brand}
                </span>
              </div>
            )}
          </div>

          {/* Current Location vs New Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Origin Location */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Localização Atual (Origem)
              </span>
              <div className="space-y-1 text-slate-300 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Prédio / Unidade:</span>
                  <span className="font-medium text-slate-200">{primaryAsset.location.building}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Andar:</span>
                  <span className="font-medium text-slate-200">{primaryAsset.location.floor}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Sala / Posição:</span>
                  <span className="font-medium text-slate-200">{primaryAsset.location.room}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Departamento:</span>
                  <span className="font-medium text-slate-200">{primaryAsset.location.department}</span>
                </div>
              </div>
            </div>

            {/* Destination arrow preview on larger screens */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-bold uppercase tracking-wider">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Nova Localização (Destino)</span>
              </div>
              <div className="space-y-1 text-slate-300 text-xs">
                <div>
                  <span className="text-cyan-400/80 block text-[10px]">Prédio / Unidade:</span>
                  <span className="font-semibold text-white truncate block">{building || 'Selecione abaixo...'}</span>
                </div>
                <div>
                  <span className="text-cyan-400/80 block text-[10px]">Andar:</span>
                  <span className="font-semibold text-white truncate block">{floor || 'Selecione abaixo...'}</span>
                </div>
                <div>
                  <span className="text-cyan-400/80 block text-[10px]">Sala / Posição:</span>
                  <span className="font-semibold text-white truncate block">{room || 'Selecione abaixo...'}</span>
                </div>
                <div>
                  <span className="text-cyan-400/80 block text-[10px]">Departamento:</span>
                  <span className="font-semibold text-white truncate block">{department || 'Selecione abaixo...'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Form Dropdowns with Search & Add */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="font-semibold text-slate-200 block text-xs">
              Selecione ou Cadastre o Novo Local
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SearchableCombobox
                label="Novo Prédio / Unidade"
                value={building}
                onChange={setBuilding}
                options={catalogOptions.buildings}
                placeholder="Selecione ou digite o novo prédio..."
                onAddNewOption={(val) => onAddNewOption('buildings', val)}
                required
              />

              <SearchableCombobox
                label="Novo Andar"
                value={floor}
                onChange={setFloor}
                options={catalogOptions.floors}
                placeholder="Selecione ou digite o novo andar..."
                onAddNewOption={(val) => onAddNewOption('floors', val)}
                required
              />

              <SearchableCombobox
                label="Nova Sala / Posição"
                value={room}
                onChange={setRoom}
                options={catalogOptions.rooms}
                placeholder="Selecione ou digite a nova sala..."
                onAddNewOption={(val) => onAddNewOption('rooms', val)}
                required
              />

              <SearchableCombobox
                label="Novo Departamento"
                value={department}
                onChange={setDepartment}
                options={catalogOptions.departments}
                placeholder="Selecione ou digite o novo departamento..."
                onAddNewOption={(val) => onAddNewOption('departments', val)}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Motivo / Justificativa da Mudança *
              </label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ex: Realocação da equipe de engenharia para nova ala"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar Mudança de Localização</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
