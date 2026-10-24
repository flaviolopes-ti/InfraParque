import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  QrCode, 
  Calendar, 
  ShieldCheck, 
  Building, 
  Cpu, 
  HardDrive, 
  DollarSign, 
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle,
  FileText,
  MapPin
} from 'lucide-react';
import { Asset, UserProfile, Movement } from '../../types';
import { generateQrSvg, generateBarcodeSvg } from '../../utils/qrCodeGenerator';

interface AssetDetailModalProps {
  asset: Asset | null;
  onClose: () => void;
  currentUser: UserProfile;
  onStartLoan?: (asset: Asset) => void;
  onStartTransfer?: (asset: Asset) => void;
  movements: Movement[];
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  currentUser,
  onStartLoan,
  onStartTransfer,
  movements
}) => {
  const [showPrintLabel, setShowPrintLabel] = useState(false);

  if (!asset) return null;

  const qrSvg = generateQrSvg(asset.tag + '|' + asset.serialNumber, 160);
  const barcodeSvg = generateBarcodeSvg(asset.tag, 240, 50);

  const now = new Date();
  let warrantyDaysLeft: number | null = null;
  let isWarrantyExpired = false;

  if (asset.warrantyExpiresAt) {
    const exp = new Date(asset.warrantyExpiresAt);
    warrantyDaysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 3600 * 24));
    isWarrantyExpired = warrantyDaysLeft < 0;
  }

  // Filter movements for this asset
  const assetMovements = movements.filter(m => m.assetId === asset.id || m.assetTag === asset.tag);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
              {asset.tag}
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{asset.name}</h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{asset.brand} · {asset.model}</span>
                <span aria-hidden="true">·</span>
                <span className="uppercase text-[10px] tracking-wide font-mono text-slate-300">
                  {asset.ownership === 'alugado' ? 'Item Alugado' : 'Item Próprio'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintLabel(!showPrintLabel)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Visualizar Etiqueta com QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Imprimir Ficha Cadastral"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Printable Label Preview Box if toggled */}
          {showPrintLabel && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Etiqueta de Patrimônio & Leitura Rápida
                </span>
                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir Etiqueta
                </button>
              </div>

              {/* Physical Tag representation */}
              <div className="bg-white p-4 rounded-lg text-slate-900 border-2 border-slate-300 shadow-md max-w-sm mx-auto flex gap-4 items-center">
                <div dangerouslySetInnerHTML={{ __html: qrSvg }} className="shrink-0" />
                <div className="space-y-1 text-left min-w-0">
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-200 pb-0.5">
                    PARQUE TECNOLÓGICO
                  </div>
                  <div className="text-sm font-bold font-mono tracking-tight text-slate-900">
                    {asset.tag}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700 truncate">
                    {asset.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">
                    S/N: {asset.serialNumber}
                  </div>
                  <div className="text-[9px] text-slate-500">
                    {asset.ownership === 'alugado' ? `LOC: ${asset.rentalInfo?.rentalCompany || 'Alugado'}` : 'ATIVO PRÓPRIO'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top visual summary card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Visual Photo / Graphic box */}
            <div className="md:col-span-1 rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col items-center justify-center min-h-[160px] text-center relative overflow-hidden">
              {asset.imageUrl ? (
                <img 
                  src={asset.imageUrl} 
                  alt={asset.name} 
                  className="w-full h-36 object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-cyan-400 mb-2">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{asset.category.toUpperCase()}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">{asset.brand}</span>
                </div>
              )}
            </div>

            {/* Quick Specs & Status */}
            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Número de Série</span>
                  <div className="font-mono font-semibold text-slate-200 truncate mt-0.5">
                    {asset.serialNumber || 'Não cadastrado'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Status Operacional</span>
                  <div className="font-semibold text-slate-200 mt-0.5 capitalize flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      asset.status === 'disponivel' ? 'bg-emerald-400' :
                      asset.status === 'em_uso' ? 'bg-cyan-400' :
                      asset.status === 'emprestado' ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                    {asset.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Garantia do Fabricante</span>
                  <div className="mt-0.5">
                    <span className="font-mono text-slate-200">
                      {asset.warrantyExpiresAt ? new Date(asset.warrantyExpiresAt).toLocaleDateString('pt-BR') : 'Sem garantia'}
                    </span>
                    {warrantyDaysLeft !== null && (
                      <span className={`block text-[10px] font-semibold mt-0.5 ${
                        isWarrantyExpired ? 'text-rose-400' : warrantyDaysLeft <= 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {isWarrantyExpired ? 'Garantia expirada' : `${warrantyDaysLeft} dias restantes`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Localização Física</span>
                  <div className="text-slate-200 truncate mt-0.5">
                    {asset.location.building} · {asset.location.room}
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {asset.location.department}
                  </span>
                </div>
              </div>

              {/* Action row: Loan and Transfer */}
              <div className="flex flex-col sm:flex-row gap-2">
                {asset.status === 'disponivel' && onStartLoan && currentUser.role !== 'auditor' && (
                  <button
                    onClick={() => {
                      onClose();
                      onStartLoan(asset);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Emprestar</span>
                  </button>
                )}

                {onStartTransfer && currentUser.role !== 'auditor' && (
                  <button
                    onClick={() => {
                      onClose();
                      onStartTransfer(asset);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-colors"
                    title="Mudar prédio, andar, sala ou departamento"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Mudar Localização</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details Section: Rented vs Owned */}
          {asset.ownership === 'alugado' && asset.rentalInfo && (
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/50 space-y-2">
              <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                Dados do Contrato de Locação
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Contrato</span>
                  <div className="font-mono text-slate-200">{asset.rentalInfo.contractNumber}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Empresa</span>
                  <div className="text-slate-200 font-medium">{asset.rentalInfo.rentalCompany}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Fim do Contrato</span>
                  <div className="font-mono text-purple-300">
                    {new Date(asset.rentalInfo.rentalEndDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Mensalidade</span>
                  <div className="font-mono text-emerald-400 font-semibold">
                    R$ {asset.rentalInfo.monthlyCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Supplies Info (if consumable) */}
          {asset.type === 'suprimento' && asset.suppliesInfo && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Controle de Estoque & Reposição Automática
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Estoque Atual</span>
                  <div className="text-base font-bold font-mono text-white">
                    {asset.suppliesInfo.currentStock} {asset.suppliesInfo.unit}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Estoque Mínimo</span>
                  <div className="text-base font-bold font-mono text-amber-400">
                    {asset.suppliesInfo.minStockThreshold} {asset.suppliesInfo.unit}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Lote Sugerido</span>
                  <div className="text-base font-bold font-mono text-cyan-400">
                    {asset.suppliesInfo.suggestedOrderQty} {asset.suppliesInfo.unit}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Fornecedor Padrão</span>
                  <div className="text-slate-200 truncate">{asset.suppliesInfo.supplierName}</div>
                </div>
              </div>
            </div>
          )}

          {/* Technical Specs */}
          {asset.specs && Object.keys(asset.specs).length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Especificações Técnicas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {asset.specs.cpu && (
                  <div>
                    <span className="text-slate-400 text-[11px]">Processador</span>
                    <div className="text-slate-200 truncate">{asset.specs.cpu}</div>
                  </div>
                )}
                {asset.specs.ram && (
                  <div>
                    <span className="text-slate-400 text-[11px]">Memória RAM</span>
                    <div className="text-slate-200">{asset.specs.ram}</div>
                  </div>
                )}
                {asset.specs.storage && (
                  <div>
                    <span className="text-slate-400 text-[11px]">Armazenamento</span>
                    <div className="text-slate-200">{asset.specs.storage}</div>
                  </div>
                )}
                {asset.specs.os && (
                  <div>
                    <span className="text-slate-400 text-[11px]">Sistema Operacional</span>
                    <div className="text-slate-200 truncate">{asset.specs.os}</div>
                  </div>
                )}
                {asset.specs.ipAddress && (
                  <div>
                    <span className="text-slate-400 text-[11px]">Endereço IP</span>
                    <div className="font-mono text-cyan-400">{asset.specs.ipAddress}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Movement history for this asset */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Histórico de Movimentações Deste Item
            </h3>
            {assetMovements.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhuma movimentação registrada até o momento.</p>
            ) : (
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                {assetMovements.map(mov => (
                  <div key={mov.id} className="p-3 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-200 capitalize">{mov.type.replace('_', ' ')}</span>
                      <p className="text-[11px] text-slate-400">{mov.reason} {mov.destination && `→ ${mov.destination}`}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-slate-400">{new Date(mov.timestamp).toLocaleDateString('pt-BR')}</span>
                      <span className="block text-[10px] text-slate-400">por {mov.responsibleName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
