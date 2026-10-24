import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Search, 
  Boxes, 
  Package, 
  Building2, 
  SlidersHorizontal,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { CategoryDefinition, CatalogOptions, AssetType } from '../../types';
import { INITIAL_CATALOG_OPTIONS } from '../../data/initialData';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogOptions: CatalogOptions;
  onSaveCatalogOptions: (options: CatalogOptions) => void;
  initialTab?: 'categories' | 'lists';
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  catalogOptions,
  onSaveCatalogOptions,
  initialTab = 'categories'
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'categories' | 'lists'>(initialTab);
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'todos' | AssetType>('todos');
  const [categorySearch, setCategorySearch] = useState('');

  // Category creation / edit state
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<AssetType>('equipamento');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // Dropdown lists management state
  type ListFieldKey = 
    | 'equipmentNames'
    | 'supplyNames'
    | 'equipmentBrands'
    | 'supplyBrands'
    | 'equipmentModels'
    | 'supplyModels'
    | 'buildings'
    | 'floors'
    | 'rooms'
    | 'departments'
    | 'rentalCompanies'
    | 'rentalContracts';

  const [selectedListField, setSelectedListField] = useState<ListFieldKey>('equipmentBrands');
  const [listSearch, setListSearch] = useState('');
  const [newListItem, setNewListItem] = useState('');

  const FIELD_LABELS: Record<ListFieldKey, { label: string; group: string; placeholder: string }> = {
    equipmentNames: { label: 'Nomes de Equipamentos', group: 'Equipamentos', placeholder: 'Ex: Notebook Dell Latitude 5430' },
    equipmentBrands: { label: 'Marcas de Equipamentos', group: 'Equipamentos', placeholder: 'Ex: Dell Technologies, Lenovo, Apple' },
    equipmentModels: { label: 'Modelos de Equipamentos', group: 'Equipamentos', placeholder: 'Ex: ThinkPad E14, Latitude 5430' },
    supplyNames: { label: 'Nomes de Suprimentos / Consumíveis', group: 'Suprimentos', placeholder: 'Ex: Toner HP 89A, Patch Cord Cat6 1.5m' },
    supplyBrands: { label: 'Marcas de Suprimentos', group: 'Suprimentos', placeholder: 'Ex: Furukawa, HP Original, Elgin' },
    supplyModels: { label: 'Modelos de Suprimentos', group: 'Suprimentos', placeholder: 'Ex: CF289A, TN-3472' },
    buildings: { label: 'Prédios / Unidades', group: 'Localização', placeholder: 'Ex: Edifício Sede SEINFRA, Anexo I' },
    floors: { label: 'Andares', group: 'Localização', placeholder: 'Ex: 1º Andar, Subsolo, Mezanino' },
    rooms: { label: 'Salas / Posições', group: 'Localização', placeholder: 'Ex: Almoxarifado Central, Sala 102' },
    departments: { label: 'Departamentos / Setores', group: 'Localização', placeholder: 'Ex: Diretoria de Obras, NTI' },
    rentalCompanies: { label: 'Empresas de Locação', group: 'Contratos', placeholder: 'Ex: Simpress, Arlequim, Positivo' },
    rentalContracts: { label: 'Números de Contrato de Locação', group: 'Contratos', placeholder: 'Ex: CTR-2025/0018-SEINFRA' }
  };

  // Combine categories
  const allCategories = [
    ...catalogOptions.equipmentCategories.map(c => ({ ...c, type: 'equipamento' as const })),
    ...catalogOptions.supplyCategories.map(c => ({ ...c, type: 'suprimento' as const }))
  ];

  const filteredCategories = allCategories.filter(c => {
    if (categoryTypeFilter !== 'todos' && c.type !== categoryTypeFilter) return false;
    if (categorySearch.trim()) {
      const q = categorySearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q));
    }
    return true;
  });

  // Open Create Category form
  const handleOpenCreateCategory = () => {
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryType('equipamento');
    setCategoryDescription('');
    setCategoryError('');
    setIsEditingCategory(true);
  };

  // Open Edit Category form
  const handleOpenEditCategory = (cat: CategoryDefinition) => {
    setEditingCategoryId(cat.id);
    setCategoryName(cat.name);
    setCategoryType(cat.type);
    setCategoryDescription(cat.description || '');
    setCategoryError('');
    setIsEditingCategory(true);
  };

  // Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setCategoryError('Informe o nome da categoria.');
      return;
    }

    if (editingCategoryId) {
      // Update existing
      const updatedEquipment = catalogOptions.equipmentCategories.filter(c => c.id !== editingCategoryId);
      const updatedSupply = catalogOptions.supplyCategories.filter(c => c.id !== editingCategoryId);

      const updatedCat: CategoryDefinition = {
        id: editingCategoryId,
        name: categoryName.trim(),
        type: categoryType,
        description: categoryDescription.trim() || undefined
      };

      if (categoryType === 'equipamento') {
        updatedEquipment.push(updatedCat);
      } else {
        updatedSupply.push(updatedCat);
      }

      onSaveCatalogOptions({
        ...catalogOptions,
        equipmentCategories: updatedEquipment,
        supplyCategories: updatedSupply
      });
    } else {
      // Create new
      const newId = `cat_${Date.now()}`;
      const newCat: CategoryDefinition = {
        id: newId,
        name: categoryName.trim(),
        type: categoryType,
        description: categoryDescription.trim() || undefined,
        isSystem: false
      };

      if (categoryType === 'equipamento') {
        onSaveCatalogOptions({
          ...catalogOptions,
          equipmentCategories: [...catalogOptions.equipmentCategories, newCat]
        });
      } else {
        onSaveCatalogOptions({
          ...catalogOptions,
          supplyCategories: [...catalogOptions.supplyCategories, newCat]
        });
      }
    }

    setIsEditingCategory(false);
  };

  // Delete Category
  const handleDeleteCategory = (cat: CategoryDefinition) => {
    if (confirm(`Deseja remover a categoria "${cat.name}"?`)) {
      if (cat.type === 'equipamento') {
        onSaveCatalogOptions({
          ...catalogOptions,
          equipmentCategories: catalogOptions.equipmentCategories.filter(c => c.id !== cat.id)
        });
      } else {
        onSaveCatalogOptions({
          ...catalogOptions,
          supplyCategories: catalogOptions.supplyCategories.filter(c => c.id !== cat.id)
        });
      }
    }
  };

  // Current list items for dropdown management
  const currentListItems = (catalogOptions[selectedListField] as string[]) || [];

  const filteredListItems = currentListItems.filter(item => {
    if (!listSearch.trim()) return true;
    return item.toLowerCase().includes(listSearch.toLowerCase());
  });

  const handleAddListItem = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newListItem.trim();
    if (!clean) return;
    if (currentListItems.includes(clean)) {
      alert('Este item já está presente na lista.');
      return;
    }
    const updated = [clean, ...currentListItems];
    onSaveCatalogOptions({
      ...catalogOptions,
      [selectedListField]: updated
    });
    setNewListItem('');
  };

  const handleDeleteListItem = (item: string) => {
    if (confirm(`Remover "${item}" desta lista suspensa?`)) {
      const updated = currentListItems.filter(i => i !== item);
      onSaveCatalogOptions({
        ...catalogOptions,
        [selectedListField]: updated
      });
    }
  };

  const handleResetCatalog = () => {
    if (confirm('Deseja restaurar as categorias e listas aos padrões do sistema?')) {
      onSaveCatalogOptions(INITIAL_CATALOG_OPTIONS);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Gestão de Categorias & Listas Suspensas
              </h2>
              <p className="text-xs text-slate-400">
                Personalize categorias de Equipamentos vs Suprimentos e alimente as listas com pesquisa embutida
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetCatalog}
              className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Restaurar padrões de categorias e listas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Categorias de Ativos ({allCategories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('lists')}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'lists'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Itens das Listas Suspensas (Dropdowns)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              
              {/* Category Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={e => setCategorySearch(e.target.value)}
                      placeholder="Buscar categoria..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>
                  
                  {/* Filter Equipamento vs Suprimento */}
                  <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setCategoryTypeFilter('todos')}
                      className={`px-2.5 py-1 text-[11px] rounded ${
                        categoryTypeFilter === 'todos' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryTypeFilter('equipamento')}
                      className={`px-2.5 py-1 text-[11px] rounded ${
                        categoryTypeFilter === 'equipamento' ? 'bg-cyan-600/30 text-cyan-300 font-medium' : 'text-slate-400'
                      }`}
                    >
                      Equipamento
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryTypeFilter('suprimento')}
                      className={`px-2.5 py-1 text-[11px] rounded ${
                        categoryTypeFilter === 'suprimento' ? 'bg-purple-600/30 text-purple-300 font-medium' : 'text-slate-400'
                      }`}
                    >
                      Suprimento
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreateCategory}
                  className="w-full sm:w-auto px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Categoria</span>
                </button>
              </div>

              {/* Category Edit / Create Inline Modal Card */}
              {isEditingCategory && (
                <form onSubmit={handleSaveCategory} className="p-4 rounded-xl bg-slate-950 border border-cyan-500/50 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      {editingCategoryId ? 'Editar Categoria' : 'Cadastrar Nova Categoria'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingCategory(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {categoryError && (
                    <div className="text-rose-400 text-[11px]">{categoryError}</div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-medium mb-1">Nome da Categoria *</label>
                      <input
                        type="text"
                        value={categoryName}
                        onChange={e => setCategoryName(e.target.value)}
                        placeholder="Ex: Tablets Rugged de Campo"
                        autoFocus
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Tipo de Ativo *</label>
                      <select
                        value={categoryType}
                        onChange={e => setCategoryType(e.target.value as AssetType)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
                      >
                        <option value="equipamento">Equipamento (Hardware / Bem)</option>
                        <option value="suprimento">Suprimento / Consumível</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-300 font-medium mb-1">Descrição / Finalidade</label>
                      <input
                        type="text"
                        value={categoryDescription}
                        onChange={e => setCategoryDescription(e.target.value)}
                        placeholder="Ex: Dispositivos de mobilidade robustecidos com certificação IP68 para inspeções em canteiros"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditingCategory(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Salvar Categoria</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {filteredCategories.map(cat => (
                  <div
                    key={cat.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 flex items-start justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-100 text-xs truncate">{cat.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                          cat.type === 'equipamento'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                            : 'bg-purple-950 text-purple-300 border border-purple-800/50'
                        }`}>
                          {cat.type === 'equipamento' ? 'Equipamento' : 'Suprimento'}
                        </span>
                        {cat.isSystem && (
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">Sistema</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {cat.description || 'Sem descrição cadastrada.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditCategory(cat)}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                        title="Editar Categoria"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {!cat.isSystem && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Excluir Categoria"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: DROPDOWN LISTS MANAGEMENT */}
          {activeTab === 'lists' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Field Selector Sidebar */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 px-2">
                  Listas Disponíveis
                </span>
                
                {Object.entries(FIELD_LABELS).map(([key, config]) => {
                  const isSelected = selectedListField === key;
                  const count = ((catalogOptions[key as ListFieldKey] as string[]) || []).length;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedListField(key as ListFieldKey);
                        setListSearch('');
                        setNewListItem('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-cyan-600/20 text-cyan-300 font-semibold border border-cyan-500/40'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div className="truncate">
                        <span className="block truncate">{config.label}</span>
                        <span className="text-[10px] text-slate-500">{config.group}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Items Management Panel */}
              <div className="md:col-span-2 space-y-4">
                
                {/* Header of selected list */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {FIELD_LABELS[selectedListField].label}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Itens disponíveis nas listas suspensas com pesquisa embutida
                    </p>
                  </div>

                  {/* Add Item Form */}
                  <form onSubmit={handleAddListItem} className="flex gap-2">
                    <input
                      type="text"
                      value={newListItem}
                      onChange={e => setNewListItem(e.target.value)}
                      placeholder={FIELD_LABELS[selectedListField].placeholder}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      disabled={!newListItem.trim()}
                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  </form>
                </div>

                {/* Search within this list */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={listSearch}
                    onChange={e => setListSearch(e.target.value)}
                    placeholder={`Filtrar entre os ${currentListItems.length} itens desta lista...`}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                {/* Items List (No item limit) */}
                <div className="max-h-80 overflow-y-auto rounded-xl bg-slate-950/60 border border-slate-800 divide-y divide-slate-800/60">
                  {filteredListItems.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      Nenhum item cadastrado nesta lista.
                    </div>
                  ) : (
                    filteredListItems.map(item => (
                      <div
                        key={item}
                        className="px-3.5 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-900/60 group transition-colors"
                      >
                        <span className="truncate pr-2">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteListItem(item)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded opacity-70 group-hover:opacity-100 transition-opacity"
                          title="Remover item da lista"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950 text-xs text-slate-400">
          <span>Alterações são salvas instantaneamente no catálogo do sistema.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Concluir & Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
