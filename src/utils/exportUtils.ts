import * as XLSX from 'xlsx';
import { Asset, Movement, Loan, AuditLog } from '../types';

// Convert array of objects to CSV string and trigger download
export function downloadCsv(filename: string, rows: Record<string, any>[]): void {
  if (!rows || rows.length === 0) {
    alert('Nenhum dado disponível para exportar.');
    return;
  }

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(';'),
    ...rows.map(row => 
      headers.map(field => {
        const val = row[field] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(';')
    )
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export multi-sheet or single sheet Excel workbook
export function downloadExcel(
  filename: string, 
  sheets: { name: string; data: Record<string, any>[] }[]
): void {
  const wb = XLSX.utils.book_new();

  sheets.forEach(sheet => {
    const ws = XLSX.utils.json_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31)); // Excel limits sheet name to 31 chars
  });

  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// Generate & Download Template for Excel Import
export function downloadImportTemplate(): void {
  const templateRows = [
    {
      'Patrimonio': 'PAT-009901',
      'Nome': 'Notebook Dell Latitude 3440',
      'Tipo': 'equipamento', // ou 'suprimento'
      'Propriedade': 'proprio', // ou 'alugado'
      'Categoria': 'notebook',
      'Marca': 'Dell',
      'Modelo': 'Latitude 3440 Core i5 16GB 256GB',
      'Numero_Serie': 'BR-LAT-9921',
      'Data_Garantia': '2027-06-30',
      'Data_Aquisicao': '2024-06-30',
      'Status': 'disponivel', // disponivel, em_uso, manutencao, emprestado
      'Predio': 'Sede Principal',
      'Andar': '2º Andar',
      'Sala': 'Almoxarifado TI',
      'Departamento': 'Infraestrutura',
      'Valor_Compra': '4500.00',
      'Estoque_Atual': '',
      'Estoque_Minimo': '',
      'Unidade': 'un',
      'Locadora': '',
      'Contrato_Locacao': '',
      'Fim_Contrato_Locacao': '',
      'Custo_Mensal_Locacao': '',
      'Observacoes': 'Equipamento lacrado para novo colaborador'
    },
    {
      'Patrimonio': 'SUP-002010',
      'Nome': 'Toner HP LaserJet W105A Preto',
      'Tipo': 'suprimento',
      'Propriedade': 'proprio',
      'Categoria': 'suprimento_toner',
      'Marca': 'HP',
      'Modelo': 'Laser 107a / MFP 135a',
      'Numero_Serie': 'LOT-2026-HP-W105',
      'Data_Garantia': '2028-12-31',
      'Data_Aquisicao': '2026-01-15',
      'Status': 'disponivel',
      'Predio': 'Sede Principal',
      'Andar': '1º Andar',
      'Sala': 'Almoxarifado TI',
      'Departamento': 'Estoque Suprimentos',
      'Valor_Compra': '280.00',
      'Estoque_Atual': '8',
      'Estoque_Minimo': '3',
      'Unidade': 'un',
      'Locadora': '',
      'Contrato_Locacao': '',
      'Fim_Contrato_Locacao': '',
      'Custo_Mensal_Locacao': '',
      'Observacoes': 'Estoque de reposição rápida para impressoras da Recepção'
    },
    {
      'Patrimonio': 'LOC-004455',
      'Nome': 'Mac Studio M2 Max 32GB',
      'Tipo': 'equipamento',
      'Propriedade': 'alugado',
      'Categoria': 'desktop',
      'Marca': 'Apple',
      'Modelo': 'Mac Studio M2 Max 12-core CPU 30-core GPU',
      'Numero_Serie': 'H09K22LLM4',
      'Data_Garantia': '2027-01-15',
      'Data_Aquisicao': '2025-01-15',
      'Status': 'em_uso',
      'Predio': 'Sede Principal',
      'Andar': '3º Andar',
      'Sala': 'Sala 308',
      'Departamento': 'Edição de Vídeo',
      'Valor_Compra': '',
      'Estoque_Atual': '',
      'Estoque_Minimo': '',
      'Unidade': 'un',
      'Locadora': 'Arlequim Technologies S/A',
      'Contrato_Locacao': 'CTR-LOC-2025/199',
      'Fim_Contrato_Locacao': '2027-01-15',
      'Custo_Mensal_Locacao': '590.00',
      'Observacoes': 'Alugado com SLA 4h de substituição'
    }
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(templateRows);
  XLSX.utils.book_append_sheet(wb, ws, 'Modelo_Inventario');
  XLSX.writeFile(wb, 'modelo_importacao_parque_ti.xlsx');
}

// Parse uploaded Excel or CSV file
export async function parseExcelOrCsvFile(file: File): Promise<{
  success: boolean;
  items: Partial<Asset>[];
  errors: string[];
  totalParsed: number;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

        if (jsonData.length === 0) {
          resolve({
            success: false,
            items: [],
            errors: ['A planilha está vazia ou não contém linhas de dados válidas.'],
            totalParsed: 0
          });
          return;
        }

        const items: Partial<Asset>[] = [];
        const errors: string[] = [];

        jsonData.forEach((row, index) => {
          const rowNum = index + 2; // +1 for 0-index, +1 for header
          const tag = (row['Patrimonio'] || row['Tag'] || row['Chapa'] || row['Codigo'] || '').toString().trim();
          const name = (row['Nome'] || row['Equipamento'] || row['Descricao'] || row['Item'] || '').toString().trim();
          
          if (!name) {
            errors.push(`Linha ${rowNum}: Campo "Nome" é obrigatório.`);
            return;
          }

          const typeRaw = (row['Tipo'] || 'equipamento').toString().toLowerCase().trim();
          const type = typeRaw.includes('supr') ? 'suprimento' : 'equipamento';
          
          const propRaw = (row['Propriedade'] || 'proprio').toString().toLowerCase().trim();
          const ownership = propRaw.includes('alug') || propRaw.includes('locad') ? 'alugado' : 'proprio';

          const brand = (row['Marca'] || row['Fabricante'] || 'Generico').toString().trim();
          const model = (row['Modelo'] || '').toString().trim();
          const serialNumber = (row['Numero_Serie'] || row['Serial'] || row['NS'] || 'S/N-' + Math.random().toString(36).substring(2, 8).toUpperCase()).toString().trim();
          
          let warranty = (row['Data_Garantia'] || row['Garantia'] || '').toString().trim();
          if (warranty && !warranty.includes('-') && !isNaN(Number(warranty))) {
            // Excel serial date format
            const parsedDate = new Date(Math.round((Number(warranty) - 25569) * 86400 * 1000));
            warranty = parsedDate.toISOString().split('T')[0];
          } else if (warranty && warranty.includes('/')) {
            const parts = warranty.split('/');
            if (parts.length === 3) {
              warranty = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          }

          const categoryRaw = (row['Categoria'] || 'outro').toString().toLowerCase().trim();
          let category: any = 'outro';
          if (categoryRaw.includes('note') || categoryRaw.includes('laptop')) category = 'notebook';
          else if (categoryRaw.includes('desk') || categoryRaw.includes('pc')) category = 'desktop';
          else if (categoryRaw.includes('serv')) category = 'servidor';
          else if (categoryRaw.includes('monit')) category = 'monitor';
          else if (categoryRaw.includes('red') || categoryRaw.includes('switch') || categoryRaw.includes('rout')) category = 'rede';
          else if (categoryRaw.includes('imp')) category = 'impressora';
          else if (categoryRaw.includes('toner')) category = 'suprimento_toner';
          else if (categoryRaw.includes('cab')) category = 'suprimento_cabo';
          else if (categoryRaw.includes('perif') || categoryRaw.includes('mouse') || categoryRaw.includes('teclado')) category = 'periferico';

          const generatedTag = tag || (type === 'suprimento' ? 'SUP-' : ownership === 'alugado' ? 'LOC-' : 'PAT-') + Math.floor(100000 + Math.random() * 900000);

          const assetItem: Partial<Asset> = {
            id: `ast-imp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            tag: generatedTag,
            name,
            type,
            ownership,
            category,
            brand,
            model: model || brand,
            serialNumber,
            warrantyExpiresAt: warranty || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
            acquisitionDate: (row['Data_Aquisicao'] || new Date().toISOString().split('T')[0]).toString().trim(),
            status: (row['Status'] || 'disponivel') as any,
            location: {
              building: (row['Predio'] || 'Sede Principal').toString().trim(),
              floor: (row['Andar'] || '1º Andar').toString().trim(),
              room: (row['Sala'] || 'Almoxarifado').toString().trim(),
              department: (row['Departamento'] || 'TI').toString().trim(),
            },
            purchaseValue: Number(row['Valor_Compra']) || undefined,
            notes: (row['Observacoes'] || 'Importado via planilha Excel').toString().trim(),
            qrCodeData: `${generatedTag}|${serialNumber}|${brand}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          if (type === 'suprimento') {
            const currentStock = Number(row['Estoque_Atual']) || 5;
            const minStock = Number(row['Estoque_Minimo']) || 3;
            assetItem.suppliesInfo = {
              currentStock,
              minStockThreshold: minStock,
              unit: (row['Unidade'] || 'un').toString().trim(),
              shelfLocation: (row['Sala'] || 'Almoxarifado TI').toString().trim(),
              autoReplenish: true,
              supplierName: brand,
              lastRestockDate: new Date().toISOString().split('T')[0],
              suggestedOrderQty: minStock * 3,
              unitCost: Number(row['Valor_Compra']) || 50.0
            };
          }

          if (ownership === 'alugado') {
            assetItem.rentalInfo = {
              contractNumber: (row['Contrato_Locacao'] || 'CTR-LOC-AUTO').toString().trim(),
              rentalCompany: (row['Locadora'] || 'Locadora Corporativa').toString().trim(),
              rentalStartDate: new Date().toISOString().split('T')[0],
              rentalEndDate: (row['Fim_Contrato_Locacao'] || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0]).toString().trim(),
              monthlyCost: Number(row['Custo_Mensal_Locacao']) || 150.0
            };
          }

          items.push(assetItem);
        });

        resolve({
          success: items.length > 0,
          items,
          errors,
          totalParsed: jsonData.length
        });

      } catch (err: any) {
        resolve({
          success: false,
          items: [],
          errors: [`Falha na leitura do arquivo: ${err.message || 'Formato inválido'}`],
          totalParsed: 0
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        items: [],
        errors: ['Erro ao carregar o arquivo do disco local.'],
        totalParsed: 0
      });
    };

    reader.readAsBinaryString(file);
  });
}
