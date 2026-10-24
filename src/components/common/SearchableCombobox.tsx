import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Plus, Check, X, Sparkles, SlidersHorizontal } from 'lucide-react';

export interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  isCustom?: boolean;
}

interface SearchableComboboxProps {
  value: string;
  onChange: (val: string) => void;
  options: (string | ComboboxOption)[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  onAddNewOption?: (newOption: string) => void;
  onOpenManageCategories?: () => void;
  allowCustomInput?: boolean;
  badge?: string;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  id?: string;
}

export const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Selecione ou busque...',
  label,
  required = false,
  disabled = false,
  onAddNewOption,
  onOpenManageCategories,
  allowCustomInput = true,
  badge,
  helperText,
  className = '',
  inputClassName = '',
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemValue, setNewItemValue] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to ComboboxOption objects
  const normalizedOptions: ComboboxOption[] = options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  // Selected option label
  const selectedOption = normalizedOptions.find(o => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value;

  // Filter options based on search query without limit
  const filteredOptions = normalizedOptions.filter(opt => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      opt.label.toLowerCase().includes(q) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(q)) ||
      opt.value.toLowerCase().includes(q)
    );
  });

  // Check if current search matches an existing option exactly
  const exactMatchExists = normalizedOptions.some(
    o => o.label.toLowerCase() === searchTerm.trim().toLowerCase() ||
         o.value.toLowerCase() === searchTerm.trim().toLowerCase()
  );

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsAddingNew(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
      setIsAddingNew(false);
    }
  }, [isOpen]);

  const handleSelectOption = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchTerm('');
    setIsAddingNew(false);
  };

  const handleAddNewFromSearch = () => {
    const textToAdd = searchTerm.trim();
    if (!textToAdd) return;
    if (onAddNewOption) {
      onAddNewOption(textToAdd);
    }
    onChange(textToAdd);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAddNewExplicit = (e: React.FormEvent) => {
    e.preventDefault();
    const textToAdd = newItemValue.trim();
    if (!textToAdd) return;
    if (onAddNewOption) {
      onAddNewOption(textToAdd);
    }
    onChange(textToAdd);
    setNewItemValue('');
    setIsAddingNew(false);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label htmlFor={id} className="block font-medium text-slate-300 text-xs">
            {label} {required && <span className="text-cyan-400">*</span>}
          </label>
          {badge && (
            <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.2 rounded font-mono">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Main trigger button / input */}
      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left px-3 py-2 bg-slate-950 border rounded-lg text-xs flex items-center justify-between gap-2 transition-colors ${
            isOpen
              ? 'border-cyan-500 ring-1 ring-cyan-500/40 text-slate-100'
              : 'border-slate-800 hover:border-slate-700 text-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-900' : 'cursor-pointer'} ${inputClassName}`}
        >
          <span className={`truncate ${!displayLabel ? 'text-slate-500' : 'text-slate-200 font-medium'}`}>
            {displayLabel || placeholder}
          </span>
          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            {value && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="hover:text-slate-200 p-0.5 rounded hover:bg-slate-800"
                title="Limpar seleção"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
          </div>
        </button>
      </div>

      {helperText && (
        <span className="text-[10px] text-slate-500 block mt-0.5">{helperText}</span>
      )}

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[280px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col">
          
          {/* Search Header */}
          <div className="p-2 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-10 space-y-1.5">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredOptions.length > 0) {
                      handleSelectOption(filteredOptions[0].value);
                    } else if (searchTerm.trim() && allowCustomInput) {
                      handleAddNewFromSearch();
                    }
                  } else if (e.key === 'Escape') {
                    setIsOpen(false);
                  }
                }}
                placeholder="Filtrar nesta lista suspensa..."
                className="w-full pl-8 pr-7 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Top Toolbar actions */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
              <span>{filteredOptions.length} opções disponíveis</span>
              <div className="flex items-center gap-2">
                {onOpenManageCategories && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenManageCategories();
                    }}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    title="Abrir tela de criação e edição de categorias"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Gerenciar Categorias</span>
                  </button>
                )}
                {onAddNewOption && !isAddingNew && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(true)}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Novo Item</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Inline Add New Form */}
          {isAddingNew && (
            <form onSubmit={handleAddNewExplicit} className="p-2.5 bg-emerald-950/30 border-b border-emerald-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Cadastrar novo item nesta lista
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newItemValue}
                  onChange={e => setNewItemValue(e.target.value)}
                  placeholder="Nome do novo item..."
                  autoFocus
                  className="flex-1 px-2.5 py-1 bg-slate-900 border border-emerald-600/60 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-400"
                />
                <button
                  type="submit"
                  disabled={!newItemValue.trim()}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-semibold shrink-0"
                >
                  Salvar
                </button>
              </div>
            </form>
          )}

          {/* Options Scrollable List (No item limit) */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/40 p-1">
            
            {/* Quick Add Prompt if search doesn't match an existing item */}
            {searchTerm.trim() && !exactMatchExists && allowCustomInput && (
              <button
                type="button"
                onClick={handleAddNewFromSearch}
                className="w-full text-left p-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-dashed border-cyan-700/60 text-cyan-300 flex items-center justify-between text-xs transition-colors mb-1 group"
              >
                <div className="flex items-center gap-2 truncate">
                  <Plus className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">
                    Cadastrar e selecionar <strong className="text-white">"{searchTerm.trim()}"</strong>
                  </span>
                </div>
                <span className="text-[10px] bg-cyan-800/80 px-1.5 py-0.5 rounded text-white shrink-0 font-mono">
                  + Adicionar à lista
                </span>
              </button>
            )}

            {filteredOptions.length === 0 && !searchTerm.trim() ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Nenhuma opção na lista.
              </div>
            ) : filteredOptions.length === 0 && exactMatchExists ? null : filteredOptions.length === 0 ? (
              <div className="py-5 text-center text-xs text-slate-400 space-y-1">
                <p>Nenhum resultado para "{searchTerm}".</p>
                {allowCustomInput && (
                  <p className="text-[11px] text-cyan-400">Clique acima para cadastrar este item à lista.</p>
                )}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors group ${
                      isSelected
                        ? 'bg-cyan-600/20 text-cyan-300 font-semibold border border-cyan-500/40'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{opt.label}</span>
                        {opt.badge && (
                          <span className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700 px-1 rounded shrink-0">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.sublabel && (
                        <span className="text-[10px] text-slate-500 truncate mt-0.5 font-normal">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note for adding items */}
          {onAddNewOption && !isAddingNew && (
            <div className="p-1.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Lista suspensa dinâmica sem limite</span>
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar novo item</span>
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
