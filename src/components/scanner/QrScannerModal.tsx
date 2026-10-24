import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  QrCode, 
  Barcode, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeftRight, 
  Eye, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { Asset, UserProfile } from '../../types';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onStartLoan: (asset: Asset) => void;
  currentUser: UserProfile;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
  onStartLoan,
  currentUser
}) => {
  if (!isOpen) return null;

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<Asset | null>(null);
  const [notFoundQuery, setNotFoundQuery] = useState<string | null>(null);
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Câmera indisponível ou permissão não concedida. Utilize o leitor manual ou simulação abaixo.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Lookup code (supports Tag, Serial number, or QR Payload)
  const lookupAsset = (rawCode: string) => {
    const code = rawCode.trim().toLowerCase();
    if (!code) return;

    // Check direct matches
    const matched = assets.find(a => 
      a.tag.toLowerCase() === code ||
      a.serialNumber.toLowerCase() === code ||
      a.qrCodeData.toLowerCase().includes(code) ||
      code.includes(a.tag.toLowerCase()) ||
      code.includes(a.serialNumber.toLowerCase())
    );

    if (matched) {
      setScannedResult(matched);
      setNotFoundQuery(null);
    } else {
      setScannedResult(null);
      setNotFoundQuery(rawCode);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupAsset(manualCode);
  };

  // Quick Demo Simulation of scanning an existing asset
  const handleSimulateScan = (asset: Asset) => {
    setIsScanningSimulated(true);
    setTimeout(() => {
      setIsScanningSimulated(false);
      lookupAsset(asset.tag);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Leitor de QR Code & Código de Barras</h2>
              <p className="text-[11px] text-slate-400">Leitura em tempo real por câmera ou leitor óptico USB</p>
            </div>
          </div>
          <button 
            onClick={() => {
              stopCamera();
              onClose();
            }} 
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Camera Viewport or Fallback Container */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                {/* Viewfinder Target Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className={`w-48 h-48 border-2 rounded-xl relative transition-all duration-300 ${
                    isScanningSimulated ? 'border-cyan-400 bg-cyan-400/20 scale-105' : 'border-cyan-500/80 bg-cyan-500/5'
                  }`}>
                    {/* Laser scanning line */}
                    <div className="w-full h-0.5 bg-rose-500 shadow-md shadow-rose-500/50 absolute top-1/2 -translate-y-1/2 animate-pulse" />
                    <span className="absolute -top-6 left-0 right-0 text-center text-[10px] text-cyan-300 font-mono uppercase tracking-wider">
                      Alinhe o QR Code / Código
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-slate-400 max-w-sm">
                <Camera className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-xs font-semibold text-slate-300 mb-1">
                  Modo de Leitura Manual / Óptico
                </p>
                <p className="text-[11px] text-slate-500 mb-3">
                  {cameraError || 'Aponte o leitor de código de barras ou digite a numeração da etiqueta.'}
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Tentar Ativar Câmera
                </button>
              </div>
            )}
          </div>

          {/* Manual / Barcode Gun Input Bar */}
          <form onSubmit={handleManualSubmit} className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Entrada do Leitor Óptico ou Digitação Manual
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Barcode className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  placeholder="Escaneie com a pistola USB ou digite PAT-004120, S/N..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Consultar</span>
              </button>
            </div>
          </form>

          {/* Scanned Result Card */}
          {scannedResult && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/80 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {scannedResult.tag}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">{scannedResult.name}</h3>
                    <div className="text-[11px] text-slate-400">
                      {scannedResult.brand} · S/N: <strong className="text-slate-300 font-mono">{scannedResult.serialNumber}</strong>
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase font-mono ${
                  scannedResult.status === 'disponivel' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  scannedResult.status === 'emprestado' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {scannedResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-cyan-900/40">
                <div>Regime: <strong className="font-mono uppercase">{scannedResult.ownership}</strong></div>
                <div>Local: <strong className="text-slate-200">{scannedResult.location.room}</strong></div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    stopCamera();
                    onClose();
                    onSelectAsset(scannedResult);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Ficha Completa</span>
                </button>

                {scannedResult.status === 'disponivel' && currentUser.role !== 'auditor' && (
                  <button
                    onClick={() => {
                      stopCamera();
                      onClose();
                      onStartLoan(scannedResult);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Empréstimo Rápido</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {notFoundQuery && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>Código não localizado no parque:</strong> <code className="font-mono text-white">"{notFoundQuery}"</code>
                <p className="text-[11px] text-rose-300/80 mt-1">
                  Verifique se a etiqueta pertence a esta base ou cadastre o item no inventário.
                </p>
              </div>
            </div>
          )}

          {/* Quick Simulation Bar for Demonstration */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Atalhos de Demonstração (Simular Leitura de Tag):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {assets.slice(0, 4).map(asset => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => handleSimulateScan(asset)}
                  className="px-2 py-1 text-[10px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  {asset.tag} ({asset.brand})
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
