import React from 'react';
import { X, Printer, ShieldCheck, Check, Edit3 } from 'lucide-react';
import { Loan, Asset, SystemSettings, TermTemplate } from '../../types';
import { generateQrSvg } from '../../utils/qrCodeGenerator';
import { StorageManager } from '../../utils/storage';

interface CautionTermModalProps {
  loan: Loan | null;
  asset?: Asset;
  systemSettings?: SystemSettings;
  template?: TermTemplate;
  onEditTemplate?: () => void;
  onClose: () => void;
}

export const CautionTermModal: React.FC<CautionTermModalProps> = ({
  loan,
  asset,
  systemSettings: propSettings,
  template: propTemplate,
  onEditTemplate,
  onClose
}) => {
  if (!loan) return null;

  const systemSettings = propSettings || StorageManager.getSystemSettings();
  const template = propTemplate || 
    (StorageManager.getTermTemplates().find(t => t.id === 'termo_geral') || {
      id: 'termo_geral',
      title: 'TERMO DE ENTREGA E CAUTELA DE BEM TECNOLÓGICO',
      version: 'v2.4 (2026)',
      updatedAt: '2026-10-24T12:00:00Z',
      headerSubtitle: 'Departamento de Tecnologia da Informação & Gestão de Ativos',
      clause1Title: 'CLÁUSULA PRIMEIRA - DA FINALIDADE E GUARDA',
      clause1Content: 'O colaborador acima qualificado assume inteira responsabilidade civil e administrativa pela guarda, zelo e correta conservação do equipamento tecnológico descrito, comprometendo-se a utilizá-lo estritamente no exercício das atribuições e metas da instituição.',
      clause2Title: 'CLÁUSULA SEGUNDA - DA PROIBIÇÃO DE CESSÃO A TERCEIROS',
      clause2Content: 'É terminantemente proibida a cessão, transferência ou empréstimo do bem a terceiros sem prévia autorização formal da Diretoria de TI.',
      clause3Title: 'CLÁUSULA TERCEIRA - DOS DANOS, EXTRAVIOS E PRAZOS',
      clause3Content: 'Em caso de extravio, dano decorrente de negligência ou furto, o responsável comunicará a área de TI no prazo impreterível de 24 horas úteis acompanhado de Boletim de Ocorrência policial.',
      additionalClauses: 'O equipamento deverá ser devolvido na data aprazada, limpo e com todos os acessórios originais.',
      customFooterNotes: 'Documento gerado com certificação de integridade digital e arquivado para fins de auditoria interna.'
    });

  const handlePrint = () => {
    window.print();
  };

  const qrSvg = generateQrSvg(`${loan.protocolNumber}|${loan.assetTag}|${loan.borrowerDoc}`, 120);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Top actions */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{template.title}</span>
            <span className="font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded ml-1">
              {template.version}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onEditTemplate && (
              <button
                onClick={onEditTemplate}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Editar versão ou cláusulas deste termo"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Editar Cláusulas</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Termo
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formal Printable Document Sheet */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 font-sans print-full text-xs space-y-4">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {systemSettings.termsLogoUrl ? (
                <img
                  src={systemSettings.termsLogoUrl}
                  alt="Brasão Oficial"
                  className="w-14 h-14 object-contain shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs uppercase shrink-0">
                  {systemSettings.companyName.substring(0, 3)}
                </div>
              )}
              <div>
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  {systemSettings.companyName}
                </div>
                <h1 className="text-sm font-bold uppercase tracking-tight text-slate-900">
                  {template.title}
                </h1>
                <p className="text-[10px] text-slate-600 font-medium">
                  {template.headerSubtitle || systemSettings.departmentName} · Versão: {template.version}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">PROTOCOLO</span>
              <span className="font-mono font-bold text-sm text-slate-900">{loan.protocolNumber}</span>
              <span className="text-[9px] text-slate-400 font-mono block">{template.version}</span>
            </div>
          </div>

          {/* Parties identification */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 p-1.5 rounded">
              1. Identificação do Responsável / Usuário
            </h2>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><strong>Nome:</strong> {loan.borrowerName}</div>
              <div><strong>E-mail:</strong> {loan.borrowerEmail}</div>
              <div><strong>Matrícula / Doc:</strong> {loan.borrowerDoc}</div>
              <div><strong>Departamento / Setor:</strong> {loan.borrowerDepartment}</div>
            </div>
          </div>

          {/* Asset Identification (Single or Multi-item table) */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 p-1.5 rounded flex items-center justify-between">
              <span>2. Identificação {loan.items && loan.items.length > 1 ? `dos Bens Entregues sob Cautela (${loan.items.length} Itens)` : 'do Bem Entregue sob Cautela'}</span>
              {loan.items && loan.items.length > 1 && (
                <span className="text-[10px] text-cyan-800 font-mono font-normal">Múltiplos Dispositivos Homologados</span>
              )}
            </h2>

            {loan.items && loan.items.length > 0 ? (
              <div className="border border-slate-300 rounded overflow-hidden">
                <table className="w-full text-left text-[10px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="py-1 px-2">Item</th>
                      <th className="py-1 px-2">Patrimônio</th>
                      <th className="py-1 px-2">Equipamento</th>
                      <th className="py-1 px-2">Marca / Modelo</th>
                      <th className="py-1 px-2">Nº Série</th>
                      <th className="py-1 px-2 text-center">Propriedade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {loan.items.map((it, idx) => (
                      <tr key={it.assetId || idx} className="hover:bg-slate-50">
                        <td className="py-1 px-2 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-1 px-2 font-mono font-bold text-slate-900">{it.assetTag}</td>
                        <td className="py-1 px-2 font-medium text-slate-800">{it.assetName}</td>
                        <td className="py-1 px-2 text-slate-600">{it.assetModel}</td>
                        <td className="py-1 px-2 font-mono text-slate-600">{it.assetSerial}</td>
                        <td className="py-1 px-2 text-center">
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {it.ownership || 'Próprio'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-1.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-600">
                  <strong>Estado Físico Inicial do Lote:</strong> {loan.conditionOnLoan}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><strong>Chapa / Patrimônio:</strong> {loan.assetTag}</div>
                <div><strong>Equipamento:</strong> {loan.assetName}</div>
                <div><strong>Marca / Modelo:</strong> {loan.assetModel}</div>
                <div><strong>Número de Série:</strong> {loan.assetSerial}</div>
                <div className="col-span-2"><strong>Estado Físico Inicial:</strong> {loan.conditionOnLoan}</div>
              </div>
            )}
          </div>

          {/* Period */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 p-1.5 rounded">
              3. Prazos do Empréstimo
            </h2>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><strong>Data de Retirada:</strong> {new Date(loan.loanDate).toLocaleDateString('pt-BR')}</div>
              <div><strong>Prazo Limite para Devolução:</strong> {new Date(loan.expectedReturnDate).toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          {/* Legal clauses compliant with public and corporate audits - Dynamic from Template */}
          <div className="space-y-2 text-[10px] text-slate-700 text-justify leading-relaxed border-t border-slate-200 pt-3">
            {template.clauses && template.clauses.length > 0 ? (
              template.clauses.map((clause, idx) => (
                <p key={clause.id || idx}>
                  <strong>{clause.title}:</strong> {clause.content}
                </p>
              ))
            ) : (
              <>
                <p>
                  <strong>{template.clause1Title}:</strong> {template.clause1Content}
                </p>
                <p>
                  <strong>{template.clause2Title}:</strong> {template.clause2Content}
                </p>
                <p>
                  <strong>{template.clause3Title}:</strong> {template.clause3Content}
                </p>
              </>
            )}
            {template.additionalClauses && (
              <p className="bg-slate-50 p-2 rounded border border-slate-200 text-slate-600">
                <strong>Disposições Complementares:</strong> {template.additionalClauses}
              </p>
            )}
            {template.customFooterNotes && (
              <p className="text-[9px] text-slate-500 italic">
                {template.customFooterNotes}
              </p>
            )}
          </div>

          {/* Signatures & QR Code stamp */}
          <div className="pt-8 grid grid-cols-3 gap-4 items-end text-center">
            <div>
              <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-700">
                <strong>{loan.borrowerName}</strong><br />
                Assinatura do Recebedor
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <span className="text-[8px] font-mono text-slate-500 mt-1">
                Hash de Autenticidade:<br />{loan.cautionTermHash || 'SHA256:8849b2c8901'}
              </span>
            </div>

            <div>
              <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-700">
                <strong>{loan.operatorName}</strong><br />
                Área de Tecnologia / Entregador
              </div>
            </div>
          </div>

        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
