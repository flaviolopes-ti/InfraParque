import React, { useState, useRef } from 'react';
import { 
  X, 
  Building2, 
  FileText, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  RotateCcw, 
  Save, 
  Plane, 
  ShieldCheck, 
  SlidersHorizontal,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { SystemSettings, TermTemplate } from '../../types';
import { INITIAL_SYSTEM_SETTINGS, INITIAL_TERM_TEMPLATES } from '../../data/initialData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  termTemplates: TermTemplate[];
  onSaveSettings: (settings: SystemSettings) => void;
  onSaveTermTemplate: (template: TermTemplate) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  termTemplates,
  onSaveSettings,
  onSaveTermTemplate
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'branding' | 'terms'>('branding');
  const [selectedTermId, setSelectedTermId] = useState<'termo_geral' | 'termo_rpas'>('termo_rpas');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form states for branding
  const [systemName, setSystemName] = useState(settings.systemName);
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [departmentName, setDepartmentName] = useState(settings.departmentName);
  const [systemLogoUrl, setSystemLogoUrl] = useState(settings.systemLogoUrl || '');
  const [termsLogoUrl, setTermsLogoUrl] = useState(settings.termsLogoUrl || '');

  // Form states for selected term template
  const currentTemplate = termTemplates.find(t => t.id === selectedTermId) || 
    (selectedTermId === 'termo_geral' ? INITIAL_TERM_TEMPLATES[0] : INITIAL_TERM_TEMPLATES[1]);

  const [termTitle, setTermTitle] = useState(currentTemplate.title);
  const [termVersion, setTermVersion] = useState(currentTemplate.version);
  const [termHeaderSubtitle, setTermHeaderSubtitle] = useState(currentTemplate.headerSubtitle);
  const [clause1Title, setClause1Title] = useState(currentTemplate.clause1Title);
  const [clause1Content, setClause1Content] = useState(currentTemplate.clause1Content);
  const [clause2Title, setClause2Title] = useState(currentTemplate.clause2Title);
  const [clause2Content, setClause2Content] = useState(currentTemplate.clause2Content);
  const [clause3Title, setClause3Title] = useState(currentTemplate.clause3Title);
  const [clause3Content, setClause3Content] = useState(currentTemplate.clause3Content);
  const [additionalClauses, setAdditionalClauses] = useState(currentTemplate.additionalClauses || '');
  const [customFooterNotes, setCustomFooterNotes] = useState(currentTemplate.customFooterNotes || '');

  const systemLogoInputRef = useRef<HTMLInputElement>(null);
  const termsLogoInputRef = useRef<HTMLInputElement>(null);

  // Switch template handler
  const handleSelectTemplate = (id: 'termo_geral' | 'termo_rpas') => {
    setSelectedTermId(id);
    const tmpl = termTemplates.find(t => t.id === id) || 
      (id === 'termo_geral' ? INITIAL_TERM_TEMPLATES[0] : INITIAL_TERM_TEMPLATES[1]);
    
    setTermTitle(tmpl.title);
    setTermVersion(tmpl.version);
    setTermHeaderSubtitle(tmpl.headerSubtitle);
    setClause1Title(tmpl.clause1Title);
    setClause1Content(tmpl.clause1Content);
    setClause2Title(tmpl.clause2Title);
    setClause2Content(tmpl.clause2Content);
    setClause3Title(tmpl.clause3Title);
    setClause3Content(tmpl.clause3Content);
    setAdditionalClauses(tmpl.additionalClauses || '');
    setCustomFooterNotes(tmpl.customFooterNotes || '');
  };

  // Image file upload handlers
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

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: SystemSettings = {
      systemName: systemName.trim() || 'InfraParque',
      companyName: companyName.trim() || 'SEINFRA',
      departmentName: departmentName.trim() || 'NTI',
      systemLogoUrl: systemLogoUrl.trim(),
      termsLogoUrl: termsLogoUrl.trim()
    };
    onSaveSettings(updatedSettings);
    showNotification('Identidade visual e dados da organização atualizados com sucesso!');
  };

  const handleSaveCurrentTerm = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTemplate: TermTemplate = {
      id: selectedTermId,
      title: termTitle.trim(),
      version: termVersion.trim(),
      updatedAt: new Date().toISOString(),
      headerSubtitle: termHeaderSubtitle.trim(),
      clause1Title: clause1Title.trim(),
      clause1Content: clause1Content.trim(),
      clause2Title: clause2Title.trim(),
      clause2Content: clause2Content.trim(),
      clause3Title: clause3Title.trim(),
      clause3Content: clause3Content.trim(),
      additionalClauses: additionalClauses.trim(),
      customFooterNotes: customFooterNotes.trim()
    };
    onSaveTermTemplate(updatedTemplate);
    showNotification(`Versão "${updatedTemplate.version}" do modelo salva com sucesso!`);
  };

  const handleResetCurrentTermToDefault = () => {
    const defaultTmpl = INITIAL_TERM_TEMPLATES.find(t => t.id === selectedTermId);
    if (!defaultTmpl) return;
    if (confirm(`Deseja restaurar as cláusulas originais do modelo "${defaultTmpl.title}"?`)) {
      setTermTitle(defaultTmpl.title);
      setTermVersion(defaultTmpl.version);
      setTermHeaderSubtitle(defaultTmpl.headerSubtitle);
      setClause1Title(defaultTmpl.clause1Title);
      setClause1Content(defaultTmpl.clause1Content);
      setClause2Title(defaultTmpl.clause2Title);
      setClause2Content(defaultTmpl.clause2Content);
      setClause3Title(defaultTmpl.clause3Title);
      setClause3Content(defaultTmpl.clause3Content);
      setAdditionalClauses(defaultTmpl.additionalClauses || '');
      setCustomFooterNotes(defaultTmpl.customFooterNotes || '');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Configurações & Personalização do Sistema
              </h2>
              <p className="text-xs text-slate-400">
                Altere nome do órgão/empresa, logotipos do sistema e edite as versões dos termos de cautela
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('branding')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'branding'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Identidade Visual & Empresa</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'terms'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Modelos & Versões dos Termos (Cautela & RPAS)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-300">
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBranding} className="space-y-6 max-w-3xl">
              
              {/* Organization names */}
              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Dados da Organização / Empresa
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
                      Aparece nos cabeçalhos oficiais, termos timbrados e relatórios
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Nome da Aplicação / Sistema *
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
                      Exibido na barra lateral, no cabeçalho e na aba do navegador
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-medium mb-1">
                      Departamento / Núcleo Gestor
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

              {/* System Logo */}
              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    Logotipo do Sistema (Sidebar & Header)
                  </h3>
                  {systemLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setSystemLogoUrl('')}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Remover Logo Customizado
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Preview Box */}
                  <div className="w-24 h-24 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {systemLogoUrl ? (
                      <img src={systemLogoUrl} alt="Logo Sistema" className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 text-[10px]">
                        <ImageIcon className="w-6 h-6 mb-1 text-slate-600" />
                        <span>Padrão IP</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 flex-1 w-full">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Upload de Imagem (PNG, JPG, SVG)
                      </label>
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
                        className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Selecionar Arquivo do Computador</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Ou URL direta da imagem
                      </label>
                      <input
                        type="url"
                        value={systemLogoUrl}
                        onChange={e => setSystemLogoUrl(e.target.value)}
                        placeholder="https://exemplo.com/logo-sistema.png"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Terms & Reports Logo */}
              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Brasão / Logo Oficial para Termos de Cautela e Relatórios
                  </h3>
                  {termsLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setTermsLogoUrl('')}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Remover Brasão Customizado
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Preview Box */}
                  <div className="w-24 h-24 rounded-xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                    {termsLogoUrl ? (
                      <img src={termsLogoUrl} alt="Brasão Termos" className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 text-[10px]">
                        <Building2 className="w-6 h-6 mb-1 text-slate-400" />
                        <span>Brasão Timbrado</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 flex-1 w-full">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Upload do Brasão Institucional
                      </label>
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
                        className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Selecionar Imagem do Brasão</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Ou URL direta do Brasão
                      </label>
                      <input
                        type="url"
                        value={termsLogoUrl}
                        onChange={e => setTermsLogoUrl(e.target.value)}
                        placeholder="https://exemplo.gov.br/brasao-oficial.png"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Dados da Organização</span>
                </button>
              </div>

            </form>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6">
              {/* Template selector pills */}
              <div className="flex items-center justify-between flex-wrap gap-3 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Modelo em Edição:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectTemplate('termo_rpas')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        selectedTermId === 'termo_rpas'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>Termo RPAS (Drone & Voo)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectTemplate('termo_geral')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        selectedTermId === 'termo_geral'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Termo Geral (Notebook & Diversos)</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetCurrentTermToDefault}
                  className="px-2.5 py-1 text-slate-400 hover:text-rose-300 text-[11px] flex items-center gap-1 transition-colors"
                  title="Restaurar cláusulas oficiais padrão do termo"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurar Padrão Oficial</span>
                </button>
              </div>

              {/* Edit form for the selected term template */}
              <form onSubmit={handleSaveCurrentTerm} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-medium mb-1">
                      Título Oficial do Documento *
                    </label>
                    <input
                      type="text"
                      value={termTitle}
                      onChange={e => setTermTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-semibold text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-400 font-medium mb-1">
                      Versão Normativa do Termo *
                    </label>
                    <input
                      type="text"
                      value={termVersion}
                      onChange={e => setTermVersion(e.target.value)}
                      placeholder="Ex: v3.1 (ANAC/DECEA 2026)"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-cyan-800 text-cyan-300 rounded-lg font-mono text-xs font-semibold"
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-slate-300 font-medium mb-1">
                      Subtítulo do Cabeçalho / Setor Emissor
                    </label>
                    <input
                      type="text"
                      value={termHeaderSubtitle}
                      onChange={e => setTermHeaderSubtitle(e.target.value)}
                      placeholder="Ex: Núcleo de Tecnologia da Informação (NTI) - Fiscalização e Operações"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Clauses editor */}
                <div className="space-y-4">
                  {/* Clause 1 */}
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-400 flex items-center justify-center font-bold text-[10px]">1</span>
                      <input
                        type="text"
                        value={clause1Title}
                        onChange={e => setClause1Title(e.target.value)}
                        placeholder="Título da Cláusula 1"
                        className="flex-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 font-semibold text-xs"
                        required
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={clause1Content}
                      onChange={e => setClause1Content(e.target.value)}
                      placeholder="Texto integral da Cláusula 1..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs leading-relaxed"
                      required
                    />
                  </div>

                  {/* Clause 2 */}
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-400 flex items-center justify-center font-bold text-[10px]">2</span>
                      <input
                        type="text"
                        value={clause2Title}
                        onChange={e => setClause2Title(e.target.value)}
                        placeholder="Título da Cláusula 2"
                        className="flex-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 font-semibold text-xs"
                        required
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={clause2Content}
                      onChange={e => setClause2Content(e.target.value)}
                      placeholder="Texto integral da Cláusula 2..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs leading-relaxed"
                      required
                    />
                  </div>

                  {/* Clause 3 */}
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-400 flex items-center justify-center font-bold text-[10px]">3</span>
                      <input
                        type="text"
                        value={clause3Title}
                        onChange={e => setClause3Title(e.target.value)}
                        placeholder="Título da Cláusula 3"
                        className="flex-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 font-semibold text-xs"
                        required
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={clause3Content}
                      onChange={e => setClause3Content(e.target.value)}
                      placeholder="Texto integral da Cláusula 3..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs leading-relaxed"
                      required
                    />
                  </div>

                  {/* Additional clauses & Footer notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                      <label className="block text-slate-300 font-medium mb-1">
                        Disposições Adicionais / Normativas Específicas
                      </label>
                      <textarea
                        rows={3}
                        value={additionalClauses}
                        onChange={e => setAdditionalClauses(e.target.value)}
                        placeholder="Ex: Porte obrigatório de certidão SISANT ou regras de checklist..."
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                      />
                    </div>

                    <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                      <label className="block text-slate-300 font-medium mb-1">
                        Certificação de Rodapé / Nota de Integridade
                      </label>
                      <textarea
                        rows={3}
                        value={customFooterNotes}
                        onChange={e => setCustomFooterNotes(e.target.value)}
                        placeholder="Ex: Documento com autenticação digital por hash e conformidade com auditoria governamental..."
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Versão do Modelo ({termVersion})</span>
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
