import React, { useState, useRef } from 'react';
import { 
  X, 
  Building2, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Save, 
  Palette, 
  ShieldCheck, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { SystemSettings, ColorThemePreset } from '../../types';
import { THEME_PRESETS, applySystemTheme } from '../../utils/theme';

interface VisualIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
}

export const VisualIdentityModal: React.FC<VisualIdentityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  if (!isOpen) return null;

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form states
  const [systemName, setSystemName] = useState(settings.systemName);
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [departmentName, setDepartmentName] = useState(settings.departmentName);
  const [systemLogoUrl, setSystemLogoUrl] = useState(settings.systemLogoUrl || '');
  const [termsLogoUrl, setTermsLogoUrl] = useState(settings.termsLogoUrl || '');
  const [colorTheme, setColorTheme] = useState<ColorThemePreset>(settings.colorTheme || 'cyan');
  const [customPrimaryColor, setCustomPrimaryColor] = useState(settings.customPrimaryColor || '#06b6d4');

  const systemLogoInputRef = useRef<HTMLInputElement>(null);
  const termsLogoInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'system' | 'terms') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (target === 'system') {
        setSystemLogoUrl(dataUrl);
      } else {
        setTermsLogoUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePreviewTheme = (preset: ColorThemePreset, customColor?: string) => {
    setColorTheme(preset);
    if (customColor) setCustomPrimaryColor(customColor);
    applySystemTheme({
      ...settings,
      colorTheme: preset,
      customPrimaryColor: customColor || customPrimaryColor
    });
  };

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: SystemSettings = {
      systemName: systemName.trim() || 'InfraParque',
      companyName: companyName.trim() || 'SEINFRA',
      departmentName: departmentName.trim() || 'NTI',
      systemLogoUrl: systemLogoUrl.trim(),
      termsLogoUrl: termsLogoUrl.trim(),
      colorTheme,
      customPrimaryColor
    };

    applySystemTheme(updatedSettings);
    onSaveSettings(updatedSettings);
    showNotification('Identidade visual, logos e padrão de cores salvos com sucesso!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Identidade Visual, Logotipos & Cores do Sistema
              </h2>
              <p className="text-xs text-slate-400">
                Personalize o nome da empresa, logos do sistema e dos termos, e selecione a paleta de cores oficial
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

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs px-6 py-2.5 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          
          {/* Section 1: Organization Data */}
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              1. Dados Institucionais & Nomenclatura
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nome da Empresa / Órgão Público *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Ex: SEINFRA - Secretaria de Estado de Infraestrutura"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-hidden focus:border-cyan-500"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Exibido em todos os cabeçalhos, relatórios gerenciais e termos oficiais
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nome do Sistema / Plataforma *
                </label>
                <input
                  type="text"
                  value={systemName}
                  onChange={e => setSystemName(e.target.value)}
                  placeholder="Ex: InfraParque TI"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-hidden focus:border-cyan-500"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Exibido na barra lateral superior, título da aba do navegador e login
                </span>
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">
                  Departamento Gestor / Núcleo de TI
                </label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={e => setDepartmentName(e.target.value)}
                  placeholder="Ex: Núcleo de Tecnologia da Informação (NTI)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Both Logos on the same screen (System Logo + Terms/Reports Logo) */}
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-5">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                2. Logotipos do Sistema & Brasão Oficial dos Termos e Relatórios
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Defina nesta mesma tela tanto o logotipo da aplicação quanto o brasão timbrado para os termos impressos e relatórios em PDF.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Logo 1: System Logo */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    Logotipo do Sistema (Sidebar & Header)
                  </span>
                  {systemLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setSystemLogoUrl('')}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Remover
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-xl bg-slate-950 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {systemLogoUrl ? (
                      <img src={systemLogoUrl} alt="Logo Sistema" className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 text-[9px] text-center p-1">
                        <ImageIcon className="w-5 h-5 mb-1 text-slate-600" />
                        <span>Padrão IP</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <input
                      type="file"
                      ref={systemLogoInputRef}
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'system')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => systemLogoInputRef.current?.click()}
                      className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload do Arquivo</span>
                    </button>

                    <input
                      type="url"
                      value={systemLogoUrl}
                      onChange={e => setSystemLogoUrl(e.target.value)}
                      placeholder="Ou cole a URL direta..."
                      className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-[11px] font-mono focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Logo 2: Terms and Reports Official Logo */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Brasão Oficial dos Termos & Relatórios
                  </span>
                  {termsLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setTermsLogoUrl('')}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Remover
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                    {termsLogoUrl ? (
                      <img src={termsLogoUrl} alt="Brasão Termos" className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 text-[9px] text-center p-1">
                        <Building2 className="w-5 h-5 mb-1 text-slate-400" />
                        <span>Brasão Timbrado</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <input
                      type="file"
                      ref={termsLogoInputRef}
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'terms')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => termsLogoInputRef.current?.click()}
                      className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload do Brasão</span>
                    </button>

                    <input
                      type="url"
                      value={termsLogoUrl}
                      onChange={e => setTermsLogoUrl(e.target.value)}
                      placeholder="Ou cole a URL direta..."
                      className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-[11px] font-mono focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Color Theme Presets & Custom Palette */}
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  3. Padrão de Cores do Sistema & Personalização
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Escolha um dos esquemas cromáticos institucionais pré-configurados ou defina sua cor primária exclusiva
                </p>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(THEME_PRESETS) as Array<Exclude<ColorThemePreset, 'custom'>>).map(key => {
                const preset = THEME_PRESETS[key];
                const isSelected = colorTheme === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePreviewTheme(key)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-white bg-slate-800/90 shadow-md ring-2 ring-cyan-500/50'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="w-6 h-6 rounded-lg shadow-sm border border-white/20"
                        style={{ backgroundColor: preset.previewColor }}
                      />
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-white text-xs">{preset.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{preset.description}</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Selector */}
            <div className={`p-4 rounded-xl border transition-colors ${
              colorTheme === 'custom' 
                ? 'border-white bg-slate-800/90 ring-2 ring-purple-500/40' 
                : 'border-slate-800 bg-slate-900/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handlePreviewTheme('custom', customPrimaryColor)}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="color"
                      value={customPrimaryColor}
                      onChange={e => handlePreviewTheme('custom', e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <div className="text-left">
                      <span className="font-semibold text-white text-xs block flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Cor Primária Personalizada (Custom Hex)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Clique na paleta ou digite o código hexadecimal
                      </span>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">HEX:</span>
                  <input
                    type="text"
                    value={customPrimaryColor}
                    onChange={e => {
                      setCustomPrimaryColor(e.target.value);
                      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                        handlePreviewTheme('custom', e.target.value);
                      }
                    }}
                    placeholder="#06b6d4"
                    maxLength={7}
                    className="w-24 px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white text-center focus:outline-hidden focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => handlePreviewTheme('custom', customPrimaryColor)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      colorTheme === 'custom' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Identidade Visual & Cores</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
