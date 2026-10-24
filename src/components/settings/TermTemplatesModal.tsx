import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  RotateCcw, 
  Save, 
  Plane, 
  ShieldCheck, 
  Layers,
  Sparkles
} from 'lucide-react';
import { TermTemplate, TermClause } from '../../types';
import { INITIAL_TERM_TEMPLATES } from '../../data/initialData';

interface TermTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  termTemplates: TermTemplate[];
  onSaveTermTemplate: (template: TermTemplate) => void;
  initialSelectedId?: 'termo_geral' | 'termo_rpas';
}

export const TermTemplatesModal: React.FC<TermTemplatesModalProps> = ({
  isOpen,
  onClose,
  termTemplates,
  onSaveTermTemplate,
  initialSelectedId = 'termo_rpas'
}) => {
  if (!isOpen) return null;

  const [selectedTermId, setSelectedTermId] = useState<'termo_geral' | 'termo_rpas'>(initialSelectedId);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Find active template or fallback
  const currentTemplate = termTemplates.find(t => t.id === selectedTermId) || 
    (selectedTermId === 'termo_geral' ? INITIAL_TERM_TEMPLATES[0] : INITIAL_TERM_TEMPLATES[1]);

  // Form states
  const [title, setTitle] = useState(currentTemplate.title);
  const [version, setVersion] = useState(currentTemplate.version);
  const [headerSubtitle, setHeaderSubtitle] = useState(currentTemplate.headerSubtitle);
  const [clauses, setClauses] = useState<TermClause[]>(() => {
    if (currentTemplate.clauses && currentTemplate.clauses.length > 0) {
      return [...currentTemplate.clauses];
    }
    return [
      { id: 'c-1', number: 1, title: currentTemplate.clause1Title, content: currentTemplate.clause1Content },
      { id: 'c-2', number: 2, title: currentTemplate.clause2Title, content: currentTemplate.clause2Content },
      { id: 'c-3', number: 3, title: currentTemplate.clause3Title, content: currentTemplate.clause3Content }
    ];
  });
  const [additionalClauses, setAdditionalClauses] = useState(currentTemplate.additionalClauses || '');
  const [customFooterNotes, setCustomFooterNotes] = useState(currentTemplate.customFooterNotes || '');

  // Switch template
  const handleSelectTemplate = (id: 'termo_geral' | 'termo_rpas') => {
    setSelectedTermId(id);
    const tmpl = termTemplates.find(t => t.id === id) || 
      (id === 'termo_geral' ? INITIAL_TERM_TEMPLATES[0] : INITIAL_TERM_TEMPLATES[1]);
    
    setTitle(tmpl.title);
    setVersion(tmpl.version);
    setHeaderSubtitle(tmpl.headerSubtitle);
    if (tmpl.clauses && tmpl.clauses.length > 0) {
      setClauses([...tmpl.clauses]);
    } else {
      setClauses([
        { id: `c-${id}-1`, number: 1, title: tmpl.clause1Title, content: tmpl.clause1Content },
        { id: `c-${id}-2`, number: 2, title: tmpl.clause2Title, content: tmpl.clause2Content },
        { id: `c-${id}-3`, number: 3, title: tmpl.clause3Title, content: tmpl.clause3Content }
      ]);
    }
    setAdditionalClauses(tmpl.additionalClauses || '');
    setCustomFooterNotes(tmpl.customFooterNotes || '');
  };

  // Add new clause
  const handleAddClause = () => {
    const nextNumber = clauses.length + 1;
    const newClause: TermClause = {
      id: `c-dyn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      number: nextNumber,
      title: `CLÁUSULA ${nextNumber}ª - NOVA DISPOSIÇÃO CONTRATUAL`,
      content: 'Descreva aqui as obrigações, restrições operacionais, prazos de devolução ou termos específicos de responsabilidade.'
    };
    setClauses([...clauses, newClause]);
  };

  // Update clause field
  const handleUpdateClause = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...clauses];
    updated[index] = { ...updated[index], [field]: value };
    setClauses(updated);
  };

  // Delete clause
  const handleDeleteClause = (index: number) => {
    if (clauses.length <= 1) {
      alert('O termo deve conter pelo menos uma cláusula.');
      return;
    }
    const updated = clauses.filter((_, i) => i !== index).map((c, i) => ({
      ...c,
      number: i + 1
    }));
    setClauses(updated);
  };

  // Reset to default
  const handleResetToDefault = () => {
    const defaultTmpl = INITIAL_TERM_TEMPLATES.find(t => t.id === selectedTermId);
    if (!defaultTmpl) return;
    if (confirm(`Deseja restaurar as cláusulas e versão oficiais do modelo "${defaultTmpl.title}"?`)) {
      setTitle(defaultTmpl.title);
      setVersion(defaultTmpl.version);
      setHeaderSubtitle(defaultTmpl.headerSubtitle);
      if (defaultTmpl.clauses && defaultTmpl.clauses.length > 0) {
        setClauses([...defaultTmpl.clauses]);
      } else {
        setClauses([
          { id: `c-${selectedTermId}-1`, number: 1, title: defaultTmpl.clause1Title, content: defaultTmpl.clause1Content },
          { id: `c-${selectedTermId}-2`, number: 2, title: defaultTmpl.clause2Title, content: defaultTmpl.clause2Content },
          { id: `c-${selectedTermId}-3`, number: 3, title: defaultTmpl.clause3Title, content: defaultTmpl.clause3Content }
        ]);
      }
      setAdditionalClauses(defaultTmpl.additionalClauses || '');
      setCustomFooterNotes(defaultTmpl.customFooterNotes || '');
    }
  };

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTemplate: TermTemplate = {
      id: selectedTermId,
      title: title.trim(),
      version: version.trim(),
      updatedAt: new Date().toISOString(),
      headerSubtitle: headerSubtitle.trim(),
      clause1Title: clauses[0]?.title || 'CLÁUSULA 1ª',
      clause1Content: clauses[0]?.content || '',
      clause2Title: clauses[1]?.title || 'CLÁUSULA 2ª',
      clause2Content: clauses[1]?.content || '',
      clause3Title: clauses[2]?.title || 'CLÁUSULA 3ª',
      clause3Content: clauses[2]?.content || '',
      clauses: clauses.map((c, idx) => ({
        ...c,
        number: idx + 1,
        title: c.title.trim(),
        content: c.content.trim()
      })),
      additionalClauses: additionalClauses.trim(),
      customFooterNotes: customFooterNotes.trim()
    };

    onSaveTermTemplate(updatedTemplate);
    showNotification(`Versão "${updatedTemplate.version}" com ${clauses.length} cláusula(s) salva com sucesso!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Modelos & Versões dos Termos de Cautela (Geral & RPAS)
              </h2>
              <p className="text-xs text-slate-400">
                Edite versões normativas, títulos institucionais e adicione ou remova cláusulas contratuais livremente
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

        {/* Template Selector Ribbon */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Modelo Selecionado:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectTemplate('termo_rpas')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  selectedTermId === 'termo_rpas'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Termo RPAS (Drone & Aeronave)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTemplate('termo_geral')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  selectedTermId === 'termo_geral'
                    ? 'bg-cyan-600 text-white shadow-sm'
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
            onClick={handleResetToDefault}
            className="px-2.5 py-1 text-slate-400 hover:text-rose-300 text-[11px] flex items-center gap-1.5 transition-colors"
            title="Restaurar cláusulas oficiais padrão do termo"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar Cláusulas Padrão</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          
          {/* Header Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="md:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">
                Título Oficial do Documento *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-semibold text-xs focus:outline-hidden focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-cyan-400 font-medium mb-1">
                Versão Normativa do Termo *
              </label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder="Ex: v3.1 (ANAC/DECEA 2026)"
                className="w-full px-3 py-1.5 bg-slate-900 border border-cyan-800 text-cyan-300 rounded-lg font-mono text-xs font-semibold focus:outline-hidden focus:border-cyan-400"
                required
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-slate-300 font-medium mb-1">
                Subtítulo do Cabeçalho / Órgão ou Núcleo Emissor
              </label>
              <input
                type="text"
                value={headerSubtitle}
                onChange={e => setHeaderSubtitle(e.target.value)}
                placeholder="Ex: Núcleo de Tecnologia da Informação (NTI) - Fiscalização e Operações Aéreas"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Dynamic Clauses Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Cláusulas Contratuais ({clauses.length} ativa{clauses.length !== 1 ? 's' : ''})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Edite o texto e adicione quantas cláusulas complementares forem necessárias para resguardar a instituição
                </p>
              </div>

              {/* Add Clause Button */}
              <button
                type="button"
                onClick={handleAddClause}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Nova Cláusula</span>
              </button>
            </div>

            {/* List of dynamic clauses */}
            <div className="space-y-3.5">
              {clauses.map((clause, index) => (
                <div 
                  key={clause.id || index}
                  className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={clause.title}
                        onChange={e => handleUpdateClause(index, 'title', e.target.value)}
                        placeholder={`Título da Cláusula ${index + 1}`}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-semibold text-xs focus:outline-hidden focus:border-cyan-500"
                        required
                      />
                    </div>

                    {clauses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteClause(index)}
                        title="Remover esta cláusula"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    value={clause.content}
                    onChange={e => handleUpdateClause(index, 'content', e.target.value)}
                    placeholder="Conteúdo descritivo da cláusula..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs leading-relaxed focus:outline-hidden focus:border-cyan-500"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Dispositions and Footer Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
              <label className="block text-slate-300 font-medium">
                Disposições Complementares & Normativas Específicas
              </label>
              <textarea
                rows={3}
                value={additionalClauses}
                onChange={e => setAdditionalClauses(e.target.value)}
                placeholder="Ex: Porte de certidão SISANT ou regras de checklist pré-voo..."
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
              <label className="block text-slate-300 font-medium">
                Certificação de Rodapé / Nota de Integridade Digital
              </label>
              <textarea
                rows={3}
                value={customFooterNotes}
                onChange={e => setCustomFooterNotes(e.target.value)}
                placeholder="Ex: Documento homologado para auditorias governamentais e compliance..."
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800 shrink-0">
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
              <span>Salvar Versão do Modelo ({version})</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
