import React, { useState } from 'react';
import { X, Layers, Plus, Check } from 'lucide-react';
import { Asset, AssetType, OwnershipType, AssetCategory } from '../../types';

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkAdd: (assets: Partial<Asset>[]) => void;
}

export const BulkAddModal: React.FC<BulkAddModalProps> = ({
  isOpen,
  onClose,
  onBulkAdd
}) => {
  if (!isOpen) return null;

  const [quantity, setQuantity] = useState(5);
  const [tagPrefix, setTagPrefix] = useState('PAT-');
  const [startNumber, setStartNumber] = useState(5000);
  const [name, setName] = useState('Notebook Dell Latitude 3440');
  const [category, setCategory] = useState<AssetCategory>('notebook');
  const [type, setType] = useState<AssetType>('equipamento');
  const [ownership, setOwnership] = useState<OwnershipType>('proprio');
  const [brand, setBrand] = useState('Dell');
  const [model, setModel] = useState('Latitude 3440 Core i5 16GB 256GB');
  const [serialPrefix, setSerialPrefix] = useState('BR-LAT2026-');
  const [warrantyDate, setWarrantyDate] = useState('2028-12-31');
  const [rentalCompany, setRentalCompany] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('180');

  const [building, setBuilding] = useState('Sede Principal');
  const [department, setDepartment] = useState('Tecnologia da Informação');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items: Partial<Asset>[] = [];

    for (let i = 0; i < quantity; i++) {
      const currentNum = startNumber + i;
      const tag = `${tagPrefix}${currentNum.toString().padStart(5, '0')}`;
      const serial = `${serialPrefix}${currentNum.toString().padStart(4, '0')}`;

      const asset: Partial<Asset> = {
        name,
        tag,
        type,
        ownership,
        category,
        brand,
        model,
        serialNumber: serial,
        warrantyExpiresAt: warrantyDate,
        acquisitionDate: new Date().toISOString().split('T')[0],
        status: 'disponivel',
        location: {
          building,
          floor: '1º Andar',
          room: 'Almoxarifado TI',
          department
        },
        qrCodeData: `${tag}|${serial}|${brand}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (ownership === 'alugado') {
        asset.rentalInfo = {
          rentalCompany: rentalCompany || 'Locadora Homologada',
          contractNumber: contractNumber || 'CTR-LOTE-' + Math.floor(1000 + Math.random() * 9000),
          rentalStartDate: new Date().toISOString().split('T')[0],
          rentalEndDate: new Date(Date.now() + 365 * 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
          monthlyCost: Number(monthlyCost) || 150
        };
      }

      items.push(asset);
    }

    onBulkAdd(items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Assistente de Cadastro em Lote</h2>
              <p className="text-[11px] text-slate-400">Geração automática de múltiplos ativos sequenciais</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Quantidade</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Prefixo Tag</label>
              <input
                type="text"
                value={tagPrefix}
                onChange={e => setTagPrefix(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Número Inicial</label>
              <input
                type="number"
                value={startNumber}
                onChange={e => setStartNumber(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono text-center"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 font-mono">
            Exemplo de tags geradas: <span className="text-cyan-400 font-bold">{tagPrefix}{startNumber.toString().padStart(5, '0')}</span> até <span className="text-cyan-400 font-bold">{tagPrefix}{(startNumber + quantity - 1).toString().padStart(5, '0')}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nome Padrão</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Prefixo S/N</label>
              <input
                type="text"
                value={serialPrefix}
                onChange={e => setSerialPrefix(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Marca</label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Modelo</label>
              <input
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Propriedade</label>
              <select
                value={ownership}
                onChange={e => setOwnership(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
              >
                <option value="proprio">Próprio</option>
                <option value="alugado">Alugado</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Garantia Vencimento</label>
              <input
                type="date"
                value={warrantyDate}
                onChange={e => setWarrantyDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Gerar {quantity} Ativos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
