import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Check,
  RefreshCw
} from 'lucide-react';
import { Asset, UserProfile } from '../../types';
import { parseExcelOrCsvFile, downloadImportTemplate } from '../../utils/exportUtils';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedAssets: Asset[]) => void;
  currentUser: UserProfile;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  currentUser
}) => {
  if (!isOpen) return null;

  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedItems, setParsedItems] = useState<Partial<Asset>[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsParsing(true);
    setParseErrors([]);

    const result = await parseExcelOrCsvFile(selectedFile);
    setIsParsing(false);
    setTotalRows(result.totalParsed);
    setParsedItems(result.items);
    setParseErrors(result.errors);
  };

  const handleConfirmImport = () => {
    if (parsedItems.length === 0) return;

    const fullAssets: Asset[] = parsedItems.map(item => ({
      id: item.id || `ast-imp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      tag: item.tag || 'PAT-' + Math.floor(100000 + Math.random() * 900000),
      name: item.name || 'Ativo Importado',
      category: item.category || 'notebook',
      type: item.type || 'equipamento',
      ownership: item.ownership || 'proprio',
      brand: item.brand || 'Genérico',
      model: item.model || 'Padrão',
      serialNumber: item.serialNumber || 'S/N-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      warrantyExpiresAt: item.warrantyExpiresAt || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      acquisitionDate: item.acquisitionDate || new Date().toISOString().split('T')[0],
      status: item.status || 'disponivel',
      location: item.location || {
        building: 'Sede Principal',
        floor: '1º Andar',
        room: 'Almoxarifado TI',
        department: 'Tecnologia da Informação'
      },
      suppliesInfo: item.suppliesInfo,
      rentalInfo: item.rentalInfo,
      purchaseValue: item.purchaseValue,
      notes: item.notes || 'Importado via planilha Excel',
      qrCodeData: item.qrCodeData || `${item.tag}|${item.serialNumber}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    onImportSuccess(fullAssets);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Importação de Planilha Excel / CSV</h2>
              <p className="text-[11px] text-slate-400">Popule ou atualize seu inventário de parque tecnológico</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Step 1: Download Template */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-200">Ainda não preparou sua planilha?</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Baixe o modelo oficial com colunas para equipamentos próprios, locados e suprimentos.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadImportTemplate}
              className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Modelo (.xlsx)</span>
            </button>
          </div>

          {/* Step 2: Upload Zone */}
          <div className="p-6 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl bg-slate-950/60 text-center transition-colors">
            <UploadCloud className="w-10 h-10 mx-auto text-cyan-400 mb-2" />
            <div className="text-xs font-semibold text-white mb-1">
              {file ? file.name : 'Selecione ou arraste seu arquivo Excel (.xlsx, .xls) ou CSV'}
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Suporte nativo para planilhas corporativas e bases Legadas
            </p>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold cursor-pointer transition-colors">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>{file ? 'Escolher Outro Arquivo' : 'Buscar no Computador'}</span>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Loading State */}
          {isParsing && (
            <div className="p-4 text-center text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Processando e validando linhas da planilha...</span>
            </div>
          )}

          {/* Error notifications */}
          {parseErrors.length > 0 && (
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Avisos de Validação ({parseErrors.length})</span>
              </div>
              <ul className="list-disc pl-5 text-[11px] space-y-0.5 text-amber-200/90 max-h-24 overflow-y-auto">
                {parseErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview of Parsed Rows */}
          {parsedItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Pré-visualização: {parsedItems.length} registros válidos prontos para importação
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {totalRows} linhas lidas
                </span>
              </div>

              <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950 max-h-48 overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                      <th className="p-2 font-medium">Patrimônio</th>
                      <th className="p-2 font-medium">Nome / Modelo</th>
                      <th className="p-2 font-medium">Tipo</th>
                      <th className="p-2 font-medium">Regime</th>
                      <th className="p-2 font-medium">Serial S/N</th>
                      <th className="p-2 font-medium">Garantia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {parsedItems.slice(0, 10).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-2 font-mono text-cyan-400">{item.tag}</td>
                        <td className="p-2 text-slate-200 font-medium truncate max-w-xs">{item.name}</td>
                        <td className="p-2 capitalize text-slate-300">{item.type}</td>
                        <td className="p-2 capitalize text-slate-300">{item.ownership}</td>
                        <td className="p-2 font-mono text-slate-400">{item.serialNumber}</td>
                        <td className="p-2 font-mono text-slate-300">{item.warrantyExpiresAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedItems.length > 10 && (
                <p className="text-[10px] text-slate-500 italic">
                  Mostrando primeiras 10 linhas de {parsedItems.length}. Todas as linhas serão importadas.
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={parsedItems.length === 0}
            className={`px-5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors ${
              parsedItems.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Carga de {parsedItems.length} Itens</span>
          </button>
        </div>

      </div>
    </div>
  );
};
