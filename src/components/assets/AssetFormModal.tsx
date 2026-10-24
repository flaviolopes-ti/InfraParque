import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Check, AlertCircle, Sparkles, SlidersHorizontal, Building2, FileText } from 'lucide-react';
import { Asset, AssetType, OwnershipType, AssetCategory, AssetStatus, CatalogOptions, CategoryDefinition } from '../../types';
import { SearchableCombobox, ComboboxOption } from '../common/SearchableCombobox';

interface AssetFormModalProps {
  initialData?: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: Partial<Asset>) => void;
  catalogOptions: CatalogOptions;
  onAddNewOption: (field: keyof CatalogOptions, value: string) => void;
  onAddNewCategory: (categoryName: string, type: AssetType) => void;
  onOpenCategoryManager?: () => void;
}

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
  catalogOptions,
  onAddNewOption,
  onAddNewCategory,
  onOpenCategoryManager
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<AssetType>(initialData?.type || 'equipamento');
  const [ownership, setOwnership] = useState<OwnershipType>(initialData?.ownership || 'proprio');
  const [name, setName] = useState(initialData?.name || '');
  const [tag, setTag] = useState(initialData?.tag || '');
  const [category, setCategory] = useState<AssetCategory>(initialData?.category || 'notebook');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [model, setModel] = useState(initialData?.model || '');
  const [serialNumber, setSerialNumber] = useState(initialData?.serialNumber || '');
  const [warrantyExpiresAt, setWarrantyExpiresAt] = useState(initialData?.warrantyExpiresAt || '');
  const [acquisitionDate, setAcquisitionDate] = useState(initialData?.acquisitionDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<AssetStatus>(initialData?.status || 'disponivel');
  
  // Location
  const [building, setBuilding] = useState(initialData?.location?.building || catalogOptions.buildings[0] || 'Edifício Sede SEINFRA - Asa Norte');
  const [floor, setFloor] = useState(initialData?.location?.floor || catalogOptions.floors[1] || '1º Andar');
  const [room, setRoom] = useState(initialData?.location?.room || catalogOptions.rooms[0] || 'Almoxarifado TI Central');
  const [department, setDepartment] = useState(initialData?.location?.department || catalogOptions.departments[0] || 'Núcleo de Tecnologia da Informação (NTI)');

  // Rental info (Empresa, Contrato, Fim, Mensalidade)
  const [rentalCompany, setRentalCompany] = useState(initialData?.rentalInfo?.rentalCompany || '');
  const [contractNumber, setContractNumber] = useState(initialData?.rentalInfo?.contractNumber || '');
  const [rentalEndDate, setRentalEndDate] = useState(initialData?.rentalInfo?.rentalEndDate || '');
  const [monthlyCost, setMonthlyCost] = useState(initialData?.rentalInfo?.monthlyCost?.toString() || '');

  // Supplies info
  const [currentStock, setCurrentStock] = useState(initialData?.suppliesInfo?.currentStock?.toString() || '10');
  const [minStockThreshold, setMinStockThreshold] = useState(initialData?.suppliesInfo?.minStockThreshold?.toString() || '5');
  const [unit, setUnit] = useState(initialData?.suppliesInfo?.unit || 'un');
  const [supplierName, setSupplierName] = useState(initialData?.suppliesInfo?.supplierName || '');
  const [suggestedOrderQty, setSuggestedOrderQty] = useState(initialData?.suppliesInfo?.suggestedOrderQty?.toString() || '20');

  // Specs
  const [cpu, setCpu] = useState(initialData?.specs?.cpu || '');
  const [ram, setRam] = useState(initialData?.specs?.ram || '');
  const [storage, setStorage] = useState(initialData?.specs?.storage || '');
  const [os, setOs] = useState(initialData?.specs?.os || '');

  // Photo
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [purchaseValue, setPurchaseValue] = useState(initialData?.purchaseValue?.toString() || '');

  const [error, setError] = useState('');

  // When type toggles, ensure category matches the current type
  const handleTypeChange = (newType: AssetType) => {
    setType(newType);
    if (newType === 'suprimento') {
      const firstSupplyCat = catalogOptions.supplyCategories[0];
      if (firstSupplyCat) setCategory(firstSupplyCat.id);
    } else {
      const firstEquipCat = catalogOptions.equipmentCategories[0];
      if (firstEquipCat) setCategory(firstEquipCat.id);
    }
  };

  // Build category options depending on type
  const activeCategories: ComboboxOption[] = (
    type === 'suprimento'
      ? catalogOptions.supplyCategories
      : catalogOptions.equipmentCategories
  ).map(c => ({
    value: c.id,
    label: c.name,
    sublabel: c.description,
    badge: c.type === 'suprimento' ? 'Insumo' : 'Hardware'
  }));

  // Build name, brand, model options depending on type
  const activeNameOptions = type === 'suprimento' ? catalogOptions.supplyNames : catalogOptions.equipmentNames;
  const activeBrandOptions = type === 'suprimento' ? catalogOptions.supplyBrands : catalogOptions.equipmentBrands;
  const activeModelOptions = type === 'suprimento' ? catalogOptions.supplyModels : catalogOptions.equipmentModels;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome ou descrição do item.');
      return;
    }
    if (type === 'equipamento' && !serialNumber.trim()) {
      setError('O número de série é obrigatório para equipamentos de hardware.');
      return;
    }

    const generatedTag = tag.trim() || (type === 'suprimento' ? 'SUP-' : ownership === 'alugado' ? 'LOC-' : 'PAT-') + Math.floor(100000 + Math.random() * 900000);

    const assetData: Partial<Asset> = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: name.trim(),
      tag: generatedTag,
      type,
      ownership,
      category,
      brand: brand.trim() || 'Genérico',
      model: model.trim() || brand.trim(),
      serialNumber: type === 'equipamento' ? serialNumber.trim() : (serialNumber.trim() || 'LOTE-' + Date.now().toString().slice(-6)),
      acquisitionDate: acquisitionDate || new Date().toISOString().split('T')[0],
      warrantyExpiresAt: warrantyExpiresAt || '',
      status,
      location: {
        building: building.trim(),
        floor: floor.trim(),
        room: room.trim(),
        department: department.trim()
      },
      imageUrl: imageUrl || undefined,
      notes: notes.trim() || undefined,
      purchaseValue: purchaseValue ? parseFloat(purchaseValue) : undefined
    };

    if (ownership === 'alugado') {
      assetData.rentalInfo = {
        contractNumber: contractNumber.trim() || 'CTR-2026-GERAL',
        rentalCompany: rentalCompany.trim() || 'Locadora Homologada',
        rentalStartDate: acquisitionDate,
        rentalEndDate: rentalEndDate || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
        monthlyCost: monthlyCost ? parseFloat(monthlyCost) : 0
      };
    }

    if (type === 'suprimento') {
      const stock = parseInt(currentStock) || 0;
      const minStock = parseInt(minStockThreshold) || 5;
      const orderQty = parseInt(suggestedOrderQty) || 10;
      
      assetData.suppliesInfo = {
        currentStock: stock,
        minStockThreshold: minStock,
        unit: unit.trim() || 'un',
        shelfLocation: room,
        autoReplenish: true,
        supplierName: supplierName.trim() || brand.trim() || 'Fornecedor Cadastrado',
        lastRestockDate: acquisitionDate,
        suggestedOrderQty: orderQty,
        unitCost: purchaseValue ? parseFloat(purchaseValue) : 50
      };
    }

    if (cpu || ram || storage || os) {
      assetData.specs = {
        cpu: cpu.trim() || undefined,
        ram: ram.trim() || undefined,
        storage: storage.trim() || undefined,
        os: os.trim() || undefined
      };
    }

    onSave(assetData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {initialData ? 'Editar Cadastro de Ativo' : 'Novo Cadastro de Ativo de TI'}
            </h2>
            <p className="text-xs text-slate-400">
              Listas suspensas dinâmicas sem limite, pesquisa embutida e adição instantânea de itens
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onOpenCategoryManager && (
              <button
                type="button"
                onClick={onOpenCategoryManager}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                title="Abrir tela de gestão e criação de categorias e listas"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Gerenciar Categorias</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type & Ownership Selector */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-300 mb-1.5">Tipo do Item</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange('equipamento')}
                  className={`py-2 px-3 rounded-lg font-medium border text-center transition-colors ${
                    type === 'equipamento'
                      ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Equipamento
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('suprimento')}
                  className={`py-2 px-3 rounded-lg font-medium border text-center transition-colors ${
                    type === 'suprimento'
                      ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Suprimento / Consumível
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1.5">Propriedade Patrimonial</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOwnership('proprio')}
                  className={`py-2 px-3 rounded-lg font-medium border text-center transition-colors ${
                    ownership === 'proprio'
                      ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Ativo Próprio
                </button>
                <button
                  type="button"
                  onClick={() => setOwnership('alugado')}
                  className={`py-2 px-3 rounded-lg font-medium border text-center transition-colors ${
                    ownership === 'alugado'
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Alugado / Locado
                </button>
              </div>
            </div>
          </div>

          {/* Primary Identifiers with Searchable Combobox */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <SearchableCombobox
                label="Nome / Descrição do Item"
                value={name}
                onChange={setName}
                options={activeNameOptions}
                placeholder={type === 'suprimento' ? 'Ex: Toner HP 89A Original 5.000 págs' : 'Ex: Notebook Dell Latitude 5430 Core i7'}
                onAddNewOption={(val) => onAddNewOption(type === 'suprimento' ? 'supplyNames' : 'equipmentNames', val)}
                required
                helperText="Busque ou digite para filtrar; cadastre novos itens diretamente na lista suspensa."
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Chapa / Tag de Patrimônio</label>
              <input
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder="Deixe vazio para auto-gerar"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Category, Brand, Model, Serial with Searchable Combobox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <SearchableCombobox
                label="Categoria"
                value={category}
                onChange={(val) => setCategory(val as any)}
                options={activeCategories}
                placeholder="Selecione categoria..."
                onAddNewOption={(val) => onAddNewCategory(val, type)}
                onOpenManageCategories={onOpenCategoryManager}
                required
                badge={type === 'suprimento' ? 'Suprimentos' : 'Equipamentos'}
              />
            </div>

            <div>
              <SearchableCombobox
                label="Marca / Fabricante"
                value={brand}
                onChange={setBrand}
                options={activeBrandOptions}
                placeholder="Ex: Dell, HP, DJI"
                onAddNewOption={(val) => onAddNewOption(type === 'suprimento' ? 'supplyBrands' : 'equipmentBrands', val)}
                required
              />
            </div>

            <div>
              <SearchableCombobox
                label="Modelo"
                value={model}
                onChange={setModel}
                options={activeModelOptions}
                placeholder="Ex: ThinkPad E14"
                onAddNewOption={(val) => onAddNewOption(type === 'suprimento' ? 'supplyModels' : 'equipmentModels', val)}
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Número de Série (S/N) {type === 'equipamento' && '*'}
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
                placeholder={type === 'equipamento' ? 'Ex: BRG9941X' : 'Ex: Lote / Deixe vazio'}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Data de Aquisição / Entrada</label>
              <input
                type="date"
                value={acquisitionDate}
                onChange={e => setAcquisitionDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Vencimento da Garantia</label>
              <input
                type="date"
                value={warrantyExpiresAt}
                onChange={e => setWarrantyExpiresAt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Status Inicial</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
              >
                <option value="disponivel">Disponível em Estoque</option>
                <option value="em_uso">Em Uso</option>
                <option value="manutencao">Em Manutenção</option>
                <option value="reservado">Reservado</option>
              </select>
            </div>
          </div>

          {/* Conditional: Rental Data (Replaced Locadora by Empresa with Searchable Comboboxes) */}
          {ownership === 'alugado' && (
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Dados do Contrato de Locação
                </span>
                <span className="text-[10px] text-purple-400 font-mono">
                  Listas com pesquisa & adição
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Replaced 'Locadora' with 'Empresa' */}
                <div>
                  <SearchableCombobox
                    label="Empresa"
                    value={rentalCompany}
                    onChange={setRentalCompany}
                    options={catalogOptions.rentalCompanies}
                    placeholder="Selecione ou adicione a empresa..."
                    onAddNewOption={(val) => onAddNewOption('rentalCompanies', val)}
                    required
                  />
                </div>

                <div>
                  <SearchableCombobox
                    label="Nº do Contrato"
                    value={contractNumber}
                    onChange={setContractNumber}
                    options={catalogOptions.rentalContracts}
                    placeholder="CTR-2025/..."
                    onAddNewOption={(val) => onAddNewOption('rentalContracts', val)}
                    required
                  />
                </div>

                <div>
                  <SearchableCombobox
                    label="Término da Locação"
                    value={rentalEndDate}
                    onChange={setRentalEndDate}
                    options={catalogOptions.rentalEndDates}
                    placeholder="YYYY-MM-DD"
                    onAddNewOption={(val) => onAddNewOption('rentalEndDates', val)}
                    required
                  />
                </div>

                <div>
                  <SearchableCombobox
                    label="Custo Mensal (R$)"
                    value={monthlyCost}
                    onChange={setMonthlyCost}
                    options={catalogOptions.monthlyCosts}
                    placeholder="250.00"
                    onAddNewOption={(val) => onAddNewOption('monthlyCosts', val)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional: Supply / Stock thresholds */}
          {type === 'suprimento' && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/60 space-y-3">
              <span className="font-semibold text-cyan-300 block">Parâmetros de Reposição Automática</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Saldo Atual</label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={e => setCurrentStock(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Estoque Mínimo (Alerta)</label>
                  <input
                    type="number"
                    value={minStockThreshold}
                    onChange={e => setMinStockThreshold(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono text-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Qtd Reposição Sugerida</label>
                  <input
                    type="number"
                    value={suggestedOrderQty}
                    onChange={e => setSuggestedOrderQty(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Unidade de Medida</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="un, cx, rolo"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Location: Prédio, Andar, Sala, Departamento with Searchable Comboboxes */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cyan-400" />
                Localização Física no Parque Tecnológico
              </span>
              <span className="text-[10px] text-slate-500">
                Pesquise ou cadastre novas salas, andares e prédios
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <SearchableCombobox
                  label="Prédio / Unidade"
                  value={building}
                  onChange={setBuilding}
                  options={catalogOptions.buildings}
                  placeholder="Selecione ou digite..."
                  onAddNewOption={(val) => onAddNewOption('buildings', val)}
                  required
                />
              </div>

              <div>
                <SearchableCombobox
                  label="Andar"
                  value={floor}
                  onChange={setFloor}
                  options={catalogOptions.floors}
                  placeholder="Selecione ou digite..."
                  onAddNewOption={(val) => onAddNewOption('floors', val)}
                  required
                />
              </div>

              <div>
                <SearchableCombobox
                  label="Sala / Posição"
                  value={room}
                  onChange={setRoom}
                  options={catalogOptions.rooms}
                  placeholder="Selecione ou digite..."
                  onAddNewOption={(val) => onAddNewOption('rooms', val)}
                  required
                />
              </div>

              <div>
                <SearchableCombobox
                  label="Departamento"
                  value={department}
                  onChange={setDepartment}
                  options={catalogOptions.departments}
                  placeholder="Selecione ou digite..."
                  onAddNewOption={(val) => onAddNewOption('departments', val)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Photo / Image Upload (base64 or URL) */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="block font-medium text-slate-300 mb-1">Imagem / Foto do Equipamento</label>
            <div className="flex items-center gap-4">
              {imageUrl ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-1 right-1 p-0.5 bg-black/70 rounded text-rose-400 hover:text-rose-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 shrink-0">
                  <ImageIcon className="w-6 h-6 mb-1" />
                  <span className="text-[9px]">Sem foto</span>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="URL direta da imagem (ex: https://...)"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200"
                />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload de Arquivo Local</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-500">JPG, PNG ou SVG (Máx. 2MB)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Observações Gerais / Histórico</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Informações adicionais, acessórios inclusos ou histórico patrimonial..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          {/* Action Buttons */}
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
              <span>Salvar Ativo no Parque</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
