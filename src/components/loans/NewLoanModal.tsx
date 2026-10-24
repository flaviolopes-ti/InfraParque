import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Check, 
  AlertCircle, 
  Plane, 
  Laptop, 
  Speaker, 
  HelpCircle,
  Plus,
  Trash2,
  Boxes,
  Layers,
  Search
} from 'lucide-react';
import { Asset, UserProfile, DroneKitAccessories, MultimediaKitItems, LoanItem } from '../../types';

interface NewLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableAssets: Asset[];
  selectedAssetInitial?: Asset | null;
  selectedAssetsInitial?: Asset[];
  currentUser: UserProfile;
  onCreateLoan: (loanData: {
    termType: 'geral' | 'rpas_drone' | 'multimidia';
    assetId: string;
    assetIds?: string[];
    items?: LoanItem[];
    borrowerName: string;
    borrowerEmail: string;
    borrowerDepartment: string;
    borrowerDoc: string;
    borrowerRole?: string;
    pilotLicenseDoc?: string;
    missionPurpose?: string;
    missionLocation?: string;
    expectedReturnDate: string;
    conditionOnLoan: string;
    notes?: string;
    droneKit?: DroneKitAccessories;
    multimediaKit?: MultimediaKitItems;
  }) => void;
}

export const NewLoanModal: React.FC<NewLoanModalProps> = ({
  isOpen,
  onClose,
  availableAssets,
  selectedAssetInitial,
  selectedAssetsInitial,
  currentUser,
  onCreateLoan
}) => {
  if (!isOpen) return null;

  // Determine initial selected asset IDs
  const getInitialIds = (): string[] => {
    if (selectedAssetsInitial && selectedAssetsInitial.length > 0) {
      return selectedAssetsInitial.map(a => a.id);
    }
    if (selectedAssetInitial) {
      return [selectedAssetInitial.id];
    }
    if (availableAssets.length > 0) {
      return [availableAssets[0].id];
    }
    return [];
  };

  const initialIds = getInitialIds();
  const initialFirstAsset = availableAssets.find(a => a.id === initialIds[0]) || selectedAssetInitial;

  const initialTermType: 'geral' | 'rpas_drone' | 'multimidia' = 
    initialFirstAsset?.category === 'rpas_drone' ? 'rpas_drone' :
    initialFirstAsset?.category === 'multimidia' ? 'multimidia' : 'geral';

  const [termType, setTermType] = useState<'geral' | 'rpas_drone' | 'multimidia'>(initialTermType);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>(initialIds);
  const [pickerAssetId, setPickerAssetId] = useState<string>('');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');

  // Borrower details
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerEmail, setBorrowerEmail] = useState('');
  const [borrowerDepartment, setBorrowerDepartment] = useState('Diretoria de Obras & Vistorias Técnicas');
  const [borrowerDoc, setBorrowerDoc] = useState('');
  const [borrowerRole, setBorrowerRole] = useState('Piloto Remoto / Engenheiro Fiscal');
  
  // RPAS Drone specific fields
  const [pilotLicenseDoc, setPilotLicenseDoc] = useState('ANAC/SISANT: PP-088219441');
  const [missionPurpose, setMissionPurpose] = useState('Levantamento aéreo e fiscalização de obras de infraestrutura');
  const [missionLocation, setMissionLocation] = useState('Distrito Federal e Entorno');
  const [batteriesCount, setBatteriesCount] = useState(3);
  const [smartController, setSmartController] = useState(true);
  const [controllerSerial, setControllerSerial] = useState('RC-PRO-ENT-99120');
  const [sparePropellersPairs, setSparePropellersPairs] = useState(2);
  const [chargingHub, setChargingHub] = useState(true);
  const [gimbalCover, setGimbalCover] = useState(true);
  const [usbCables, setUsbCables] = useState(true);
  const [microSdGb, setMicroSdGb] = useState(128);
  const [hardCase, setHardCase] = useState(true);
  const [lanyard, setLanyard] = useState(true);
  const [landingPad, setLandingPad] = useState(true);
  const [extraDroneAccessories, setExtraDroneAccessories] = useState('Módulo RTK e Carregador Veicular 12V');

  // Multimedia specific fields
  const [hasProjector, setHasProjector] = useState(true);
  const [hasSpeaker, setHasSpeaker] = useState(false);
  const [microphonesCount, setMicrophonesCount] = useState(0);
  const [hasLaserPointer, setHasLaserPointer] = useState(true);

  // Return date
  const defaultReturnDate = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const [expectedReturnDate, setExpectedReturnDate] = useState(defaultReturnDate);
  const [conditionOnLoan, setConditionOnLoan] = useState(
    termType === 'rpas_drone'
      ? 'Kit RPAS em Case Estanque completo. Sensores de obstáculos limpos, hélices sem trincas e baterias balanceadas.'
      : 'Equipamentos conferidos, testados e em perfeito estado operacional com cabos e carregadores originais.'
  );
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Selected assets objects
  const selectedAssets = selectedAssetIds
    .map(id => availableAssets.find(a => a.id === id) || (selectedAssetInitial?.id === id ? selectedAssetInitial : null))
    .filter(Boolean) as Asset[];

  // Filter available assets that are not yet selected
  const unselectedAvailableAssets = availableAssets.filter(
    a => !selectedAssetIds.includes(a.id)
  );

  const filteredUnselectedAssets = unselectedAvailableAssets.filter(a => {
    if (!assetSearchQuery.trim()) return true;
    const q = assetSearchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.tag.toLowerCase().includes(q) ||
      a.serialNumber.toLowerCase().includes(q) ||
      a.brand.toLowerCase().includes(q)
    );
  });

  const handleAddAssetToSelection = (assetId: string) => {
    if (!assetId) return;
    if (!selectedAssetIds.includes(assetId)) {
      setSelectedAssetIds([...selectedAssetIds, assetId]);
      setPickerAssetId('');
      setAssetSearchQuery('');
    }
  };

  const handleRemoveAssetFromSelection = (assetId: string) => {
    if (selectedAssetIds.length <= 1) {
      alert('O termo deve conter ao menos um equipamento.');
      return;
    }
    setSelectedAssetIds(selectedAssetIds.filter(id => id !== assetId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAssetIds.length === 0) {
      setError('Por favor, selecione ao menos um equipamento disponível.');
      return;
    }
    if (!borrowerName.trim()) {
      setError('Informe o nome do colaborador / piloto responsável.');
      return;
    }
    if (!borrowerDoc.trim()) {
      setError('Informe a matrícula funcional ou CPF.');
      return;
    }
    if (!expectedReturnDate) {
      setError('Informe a data prevista de devolução.');
      return;
    }

    const primaryAsset = selectedAssets[0];

    let droneKit: DroneKitAccessories | undefined = undefined;
    if (termType === 'rpas_drone') {
      droneKit = {
        droneModel: primaryAsset?.model || primaryAsset?.name || 'Drone Profissional',
        anacRegistration: primaryAsset?.specs?.anacPrefix || 'PP-SISANT-OFICIAL',
        deceaRegistration: 'SARPAS-DECEA-REG',
        batteriesCount,
        smartController,
        controllerSerial,
        sparePropellersPairs,
        chargingHubAndPowerSupply: chargingHub,
        gimbalProtectorCover: gimbalCover,
        usbCablesKit: usbCables,
        microSdCardGb: microSdGb,
        hardCasePelican: hardCase,
        lanyardStrap: lanyard,
        landingPad,
        extraAccessories: extraDroneAccessories
      };
    }

    let multimediaKit: MultimediaKitItems | undefined = undefined;
    if (termType === 'multimidia') {
      multimediaKit = {
        hasProjector,
        projectorModel: primaryAsset?.name,
        hasSpeaker,
        microphonesCount,
        hasLaserPointer,
        hasProjectionScreen: false,
        cablesIncluded: ['Cabo HDMI 10m', 'Cabo de Força AC', 'Controle Remoto']
      };
    }

    // Build items array
    const loanItems: LoanItem[] = selectedAssets.map(asset => ({
      assetId: asset.id,
      assetTag: asset.tag,
      assetName: asset.name,
      assetModel: asset.model,
      assetSerial: asset.serialNumber,
      category: asset.category,
      ownership: asset.ownership
    }));

    onCreateLoan({
      termType,
      assetId: primaryAsset.id,
      assetIds: selectedAssetIds,
      items: loanItems,
      borrowerName: borrowerName.trim(),
      borrowerEmail: borrowerEmail.trim() || `${borrowerName.toLowerCase().replace(/\s+/g, '.')}@seinfra.gov.br`,
      borrowerDepartment,
      borrowerDoc: borrowerDoc.trim(),
      borrowerRole,
      pilotLicenseDoc: termType === 'rpas_drone' ? pilotLicenseDoc : undefined,
      missionPurpose: termType === 'rpas_drone' ? missionPurpose : undefined,
      missionLocation: termType === 'rpas_drone' ? missionLocation : undefined,
      expectedReturnDate,
      conditionOnLoan,
      notes: notes.trim(),
      droneKit,
      multimediaKit
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Preparação de Termo de Empréstimo / Cautela</h2>
              <p className="text-[11px] text-slate-400">Emita termo para 1 ou múltiplos equipamentos (RPAS Drone, Multimídia ou TI)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-300">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Term Type Selection */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Finalidade / Tipo de Cautela</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTermType('rpas_drone');
                  setConditionOnLoan('Kit RPAS em Case Estanque completo. Sensores de obstáculos limpos, hélices sem trincas e baterias balanceadas.');
                }}
                className={`py-2 px-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors ${
                  termType === 'rpas_drone'
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plane className="w-4 h-4" />
                <span className="text-[11px]">RPAS / Drone & Case</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTermType('multimidia');
                  setConditionOnLoan('Kit multimídia testado, cabos de força e HDMI inclusos com controle funcional.');
                }}
                className={`py-2 px-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors ${
                  termType === 'multimidia'
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Speaker className="w-4 h-4" />
                <span className="text-[11px]">Multimídia & Eventos</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTermType('geral');
                  setConditionOnLoan('Equipamentos conferidos, testados e em perfeito estado operacional com carregadores originais.');
                }}
                className={`py-2 px-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors ${
                  termType === 'geral'
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span className="text-[11px]">TI Geral & Diversos</span>
              </button>
            </div>
          </div>

          {/* MULTI-ITEM EQUIPMENT SELECTION ZONE */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-slate-200 font-semibold text-xs flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-cyan-400" />
                  Equipamentos Vinculados a este Termo ({selectedAssets.length})
                </label>
                <span className="text-[10px] text-slate-400">
                  Adicione um ou múltiplos itens para compor o lote desta cautela
                </span>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {selectedAssets.length} selecionado{selectedAssets.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* List of currently selected items */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {selectedAssets.map((asset, index) => (
                <div 
                  key={asset.id} 
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-[10px] font-mono shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800 text-[10px]">
                          {asset.tag}
                        </span>
                        <span className="font-semibold text-white truncate">{asset.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Marca/Modelo: <strong className="text-slate-300">{asset.model}</strong></span>
                        <span>·</span>
                        <span>S/N: <strong className="font-mono text-slate-300">{asset.serialNumber}</strong></span>
                        {asset.specs?.anacPrefix && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-400 font-mono font-semibold">ANAC: {asset.specs.anacPrefix}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedAssets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAssetFromSelection(asset.id)}
                      title="Remover este item da cautela"
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Quick-add another item from available stock */}
            {unselectedAvailableAssets.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <select
                      value={pickerAssetId}
                      onChange={e => setPickerAssetId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500"
                    >
                      <option value="">+ Selecionar outro item disponível para incluir...</option>
                      {unselectedAvailableAssets.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.tag} - {item.name} ({item.brand} {item.model} · S/N: {item.serialNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddAssetToSelection(pickerAssetId)}
                    disabled={!pickerAssetId}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 font-semibold text-xs border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Incluir Item</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RPAS DRONE KIT CHECKLIST */}
          {termType === 'rpas_drone' && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Plane className="w-4 h-4 text-cyan-400" />
                  Itens Padrão do Case de Voo (Checklist RPAS)
                </span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-mono">
                  Case Estanque
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded flex flex-col">
                  <span className="text-slate-400 text-[10px]">Baterias Inteligentes</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={batteriesCount}
                      onChange={e => setBatteriesCount(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-center text-cyan-300 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400">unidades</span>
                  </div>
                </div>

                <div className="p-2 bg-slate-900 border border-slate-800 rounded flex flex-col">
                  <span className="text-slate-400 text-[10px]">Pares de Hélices Extras</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={sparePropellersPairs}
                      onChange={e => setSparePropellersPairs(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-center text-cyan-300 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400">pares</span>
                  </div>
                </div>

                <div className="p-2 bg-slate-900 border border-slate-800 rounded flex flex-col">
                  <span className="text-slate-400 text-[10px]">Cartão MicroSD Voo</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={microSdGb}
                      onChange={e => setMicroSdGb(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-center text-cyan-300 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400">GB V30</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
                <label className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smartController}
                    onChange={e => setSmartController(e.target.checked)}
                    className="rounded text-cyan-500"
                  />
                  <span>Rádio Controle c/ Tela</span>
                </label>

                <label className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chargingHub}
                    onChange={e => setChargingHub(e.target.checked)}
                    className="rounded text-cyan-500"
                  />
                  <span>Hub de Carga 100W</span>
                </label>

                <label className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={landingPad}
                    onChange={e => setLandingPad(e.target.checked)}
                    className="rounded text-cyan-500"
                  />
                  <span>Heliponto Portátil</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Habilitação Piloto / Cadastro SISANT *</label>
                  <input
                    type="text"
                    value={pilotLicenseDoc}
                    onChange={e => setPilotLicenseDoc(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Local / Área da Missão *</label>
                  <input
                    type="text"
                    value={missionLocation}
                    onChange={e => setMissionLocation(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Borrower Information */}
          <div className="space-y-3 pt-1 border-t border-slate-800">
            <h3 className="font-semibold text-slate-200 text-xs">Dados do Colaborador / Responsável pelo Recebimento</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={e => setBorrowerName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Silva"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Matrícula Funcional / CPF *</label>
                <input
                  type="text"
                  value={borrowerDoc}
                  onChange={e => setBorrowerDoc(e.target.value)}
                  placeholder="Ex: MAT-881944 ou 012.345.678-90"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">E-mail Institucional</label>
                <input
                  type="email"
                  value={borrowerEmail}
                  onChange={e => setBorrowerEmail(e.target.value)}
                  placeholder="carlos.silva@seinfra.gov.br"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Lotação / Departamento</label>
                <input
                  type="text"
                  value={borrowerDepartment}
                  onChange={e => setBorrowerDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Dates & Physical condition */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Data Prevista de Devolução *</label>
              <input
                type="date"
                value={expectedReturnDate}
                onChange={e => setExpectedReturnDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:outline-hidden focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Operador Responsável pela Entrega</label>
              <input
                type="text"
                value={`${currentUser.name} (${currentUser.role.toUpperCase()})`}
                disabled
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Estado de Conservação na Saída</label>
              <input
                type="text"
                value={conditionOnLoan}
                onChange={e => setConditionOnLoan(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
              <span>Emitir Termo de Cautela ({selectedAssets.length} {selectedAssets.length === 1 ? 'item' : 'itens'})</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
