import React from 'react';
import { X, Printer, ShieldCheck, Check, Plane, Radio, BatteryCharging, Edit3 } from 'lucide-react';
import { Loan, Asset, SystemSettings, TermTemplate } from '../../types';
import { generateQrSvg } from '../../utils/qrCodeGenerator';
import { StorageManager } from '../../utils/storage';

interface RpasCautionTermModalProps {
  loan: Loan | null;
  asset?: Asset;
  systemSettings?: SystemSettings;
  template?: TermTemplate;
  onEditTemplate?: () => void;
  onClose: () => void;
}

export const RpasCautionTermModal: React.FC<RpasCautionTermModalProps> = ({
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
    (StorageManager.getTermTemplates().find(t => t.id === 'termo_rpas') || {
      id: 'termo_rpas',
      title: 'TERMO DE RESPONSABILIDADE E CAUTELA DE EQUIPAMENTO RPAS (DRONE) & ACESSÓRIOS',
      version: 'v3.1 (ANAC/DECEA 2026)',
      updatedAt: '2026-10-24T12:00:00Z',
      headerSubtitle: 'Núcleo de Tecnologia da Informação (NTI) - Fiscalização, Vistorias e Operações Aéreas',
      clause1Title: 'CLÁUSULA 1ª - LEGISLAÇÃO E REGRAS DO ESPAÇO AÉREO',
      clause1Content: 'O operador declara ter pleno conhecimento da Instrução do Comando da Aeronáutica (ICA 100-40 do DECEA), do Regulamento Brasileiro de Aviação Civil Especial (RBAC-E nº 94 da ANAC) e das normas da ANATEL, comprometendo-se a realizar voos exclusivamente com prévia solicitação no sistema SARPAS e em áreas desimpedidas.',
      clause2Title: 'CLÁUSULA 2ª - GUARDA DO CASE ESTANQUE E ACESSÓRIOS',
      clause2Content: 'O recebedor responderar administrativa e civilmente pela perda, extravio de peças (baterias, hélices, cartões de memória, rádio) ou danos decorrentes de imperícia, negligência ou operação em desacordo com o manual do fabricante.',
      clause3Title: 'CLÁUSULA 3ª - SINISTROS E FLYAWAYS',
      clause3Content: 'Qualquer incidente, acidente de voo ou perda de sinal deverá ser comunicado imediatamente ao Núcleo de Tecnologia da Informação (NTI) em até 24 horas úteis, com fornecimento dos arquivos de log de voo (.DAT / .TXT do controle).',
      additionalClauses: 'É obrigatório o porte digital ou físico da certidão de cadastro no SISANT/ANAC e do comprovante de solicitação no SARPAS/DECEA durante toda a operação.',
      customFooterNotes: 'Conformidade plena com o Manual de Vistorias Aéreas e Normas Militares do Espaço Aéreo Brasileiro.'
    });

  const handlePrint = () => {
    window.print();
  };

  const isDrone = loan.termType === 'rpas_drone' || loan.droneKit !== undefined;
  const isMultimedia = loan.termType === 'multimidia' || loan.multimediaKit !== undefined;

  const qrSvg = generateQrSvg(`${loan.protocolNumber}|${loan.assetTag}|RPAS-SISANT|${loan.borrowerDoc}`, 120);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Top actions */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <Plane className="w-4 h-4 text-cyan-400" />
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
                title="Editar versão ou cláusulas do termo RPAS"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Editar Versão RPAS</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Termo Oficial
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
                <div className="w-12 h-12 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs uppercase shrink-0">
                  RPAS
                </div>
              )}
              <div>
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  {systemSettings.companyName}
                </div>
                <h1 className="text-sm font-bold uppercase tracking-tight text-slate-900 mt-0.5">
                  {template.title}
                </h1>
                <p className="text-[10px] text-slate-600 font-medium">
                  {template.headerSubtitle || systemSettings.departmentName} · Versão: {template.version}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] text-slate-500 uppercase font-mono block">PROTOCOLO OFICIAL</span>
              <span className="font-mono font-bold text-sm text-slate-900">{loan.protocolNumber}</span>
              <span className="text-[9px] text-slate-400 font-mono block">{template.version}</span>
            </div>
          </div>

          {/* Pilot / Borrower identification */}
          <div className="space-y-1.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 p-1.5 rounded flex items-center justify-between">
              <span>1. Identificação do Piloto Remoto / Colaborador Responsável</span>
              <span className="text-[10px] text-slate-500 font-normal">DECEA / ANAC Compliant</span>
            </h2>
            <div className="grid grid-cols-2 gap-2 text-[11px] px-1">
              <div><strong>Nome Completo:</strong> {loan.borrowerName}</div>
              <div><strong>Matrícula Funcional / CPF:</strong> {loan.borrowerDoc}</div>
              <div><strong>E-mail Institucional:</strong> {loan.borrowerEmail}</div>
              <div><strong>Lotação / Secretaria:</strong> {loan.borrowerDepartment}</div>
              {loan.borrowerRole && <div><strong>Função / Cargo:</strong> {loan.borrowerRole}</div>}
              {loan.pilotLicenseDoc && (
                <div className="col-span-2 text-cyan-900 bg-cyan-50 p-1 rounded font-mono text-[10px]">
                  <strong>Habilitação / Cadastro Piloto:</strong> {loan.pilotLicenseDoc}
                </div>
              )}
            </div>
          </div>

          {/* Mission Details */}
          {(loan.missionPurpose || loan.missionLocation) && (
            <div className="space-y-1.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 p-1.5 rounded">
                2. Finalidade da Operação & Local da Missão
              </h2>
              <div className="grid grid-cols-2 gap-2 text-[11px] px-1">
                {loan.missionPurpose && <div className="col-span-2"><strong>Objetivo / Missão:</strong> {loan.missionPurpose}</div>}
                {loan.missionLocation && <div><strong>Área / Coordenadas / Trecho:</strong> {loan.missionLocation}</div>}
                <div><strong>Data de Saída:</strong> {new Date(loan.loanDate).toLocaleDateString('pt-BR')} (Devolução até {new Date(loan.expectedReturnDate).toLocaleDateString('pt-BR')})</div>
              </div>
            </div>
          )}

          {/* RPAS Equipment & Flight Case Items Checklist */}
          {isDrone && loan.droneKit && (
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 p-1.5 rounded flex items-center justify-between">
                <span>3. Checklist do Kit de Voo RPAS & Acessórios (Case Estanque)</span>
                <span className="text-[10px] text-slate-500 font-mono">Chapa: {loan.assetTag}</span>
              </h2>

              <div className="border border-slate-300 rounded p-2.5 bg-slate-50 text-[11px] space-y-2">
                <div className="grid grid-cols-3 gap-2 font-mono text-[10px] pb-2 border-b border-slate-200">
                  <div><strong>Aeronave:</strong> {loan.assetName}</div>
                  <div><strong>Serial Aeronave:</strong> {loan.assetSerial}</div>
                  <div><strong>Reg. ANAC/SISANT:</strong> {loan.droneKit.anacRegistration || 'PP-SISANT'}</div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <span>1x Aeronave RPAS com Câmera e Gimbal calibrados</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <span>{loan.droneKit.batteriesCount}x Baterias Inteligentes de Voo (LiPo)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <span>1x Rádio Controle / Smart Controller {loan.droneKit.controllerSerial ? `(S/N: ${loan.droneKit.controllerSerial})` : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <span>{loan.droneKit.sparePropellersPairs}x Pares de Hélices Sobressalentes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <span>1x Hub Carregador Múltiplo + Cabo de Força AC</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <span>1x Protetor / Trava de Gimbal e Câmera</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <span>1x Cartão MicroSD Alta Velocidade ({loan.droneKit.microSdCardGb} GB V30)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <span>1x Case Rígido de Transporte Estanque (Pelican)</span>
                  </div>
                  {loan.droneKit.lanyardStrap && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                      <span>1x Alça de Pescoço para o Rádio Controle</span>
                    </div>
                  )}
                  {loan.droneKit.landingPad && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                      <span>1x Heliponto Portátil (Landing Pad)</span>
                    </div>
                  )}
                </div>

                {loan.droneKit.extraAccessories && (
                  <div className="text-[10px] text-slate-700 pt-1 border-t border-slate-200">
                    <strong>Acessórios Adicionais do Case:</strong> {loan.droneKit.extraAccessories}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Multimedia checklist if multimedia */}
          {isMultimedia && loan.multimediaKit && (
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 p-1.5 rounded">
                3. Checklist de Equipamentos Multimídia / Eventos
              </h2>
              <div className="border border-slate-300 rounded p-2.5 bg-slate-50 text-[10px] space-y-1.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>Projetor Multimídia: <strong>{loan.multimediaKit.hasProjector ? `Sim (${loan.multimediaKit.projectorModel || 'Epson Laser'})` : 'Não'}</strong></div>
                  <div>Caixa de Som Amplificada: <strong>{loan.multimediaKit.hasSpeaker ? `Sim (${loan.multimediaKit.speakerModel || 'JBL Ativa'})` : 'Não'}</strong></div>
                  <div>Microfones sem Fio: <strong>{loan.multimediaKit.microphonesCount} unidade(s)</strong></div>
                  <div>Passador de Slides / Laser: <strong>{loan.multimediaKit.hasLaserPointer ? 'Incluso' : 'Não'}</strong></div>
                </div>
                {loan.multimediaKit.cablesIncluded && (
                  <div className="text-slate-700">
                    <strong>Cabos e Extensões:</strong> {loan.multimediaKit.cablesIncluded.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Equipment in Mission Lot if Multi-item */}
          {loan.items && loan.items.length > 1 && (
            <div className="space-y-1.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 p-1.5 rounded flex items-center justify-between">
                <span>4. Equipamentos e Acessórios Complementares da Missão ({loan.items.length} Itens Vinculados)</span>
                <span className="text-[9px] font-mono text-cyan-800">Lote Consolidado</span>
              </h2>
              <div className="border border-slate-300 rounded overflow-hidden">
                <table className="w-full text-left text-[9px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
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
                        <td className="py-1 px-2 font-mono font-bold text-slate-900">{it.assetTag}</td>
                        <td className="py-1 px-2 font-medium text-slate-800">{it.assetName}</td>
                        <td className="py-1 px-2 text-slate-600">{it.assetModel}</td>
                        <td className="py-1 px-2 font-mono text-slate-600">{it.assetSerial}</td>
                        <td className="py-1 px-2 text-center">
                          <span className="text-[8px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {it.ownership || 'Próprio'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Legal / Operational RPAS Clauses - Dynamic from Template */}
          <div className="space-y-1.5 text-[9px] text-slate-700 text-justify leading-relaxed border-t border-slate-200 pt-2">
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
              <p className="bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-600">
                <strong>Requisitos e Normativas da Operação:</strong> {template.additionalClauses}
              </p>
            )}
            {template.customFooterNotes && (
              <p className="text-[8px] text-slate-500 italic">
                {template.customFooterNotes}
              </p>
            )}
          </div>

          {/* Signatures & Stamps */}
          <div className="pt-6 grid grid-cols-3 gap-4 items-end text-center">
            <div>
              <div className="border-t border-slate-400 pt-1 text-[9px] text-slate-700">
                <strong>{loan.borrowerName}</strong><br />
                Piloto Remoto / Colaborador Recebedor<br />
                Matrícula: {loan.borrowerDoc}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <span className="text-[7px] font-mono text-slate-500 mt-1">
                Hash de Autenticidade Digital:<br />{loan.cautionTermHash || 'SHA256:rpas8849b2c'}
              </span>
            </div>

            <div>
              <div className="border-t border-slate-400 pt-1 text-[9px] text-slate-700">
                <strong>{loan.operatorName}</strong><br />
                {systemSettings.departmentName || 'Núcleo de Tecnologia da Informação'}<br />
                {systemSettings.companyName}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
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
