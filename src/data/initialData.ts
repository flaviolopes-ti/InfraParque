import { Asset, Loan, Movement, AuditLog, UserProfile, ReplenishmentOrder, ErpConfig, SystemSettings, TermTemplate, CatalogOptions, CategoryDefinition } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_master',
    name: 'NTI SEINFRA - Administrador Master',
    username: 'nti.seinfra',
    email: 'nti.seinfra@infraestrutura.gov.br',
    password: 'Suporte2026*',
    role: 'admin',
    department: 'Núcleo de Tecnologia da Informação (NTI) - SEINFRA',
    jobTitle: 'Gestor de Infraestrutura & Parque Tecnológico',
    status: 'ativo',
    phone: '(61) 3314-5000',
    avatarUrl: '',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'user_1',
    name: 'Carlos Mendes',
    username: 'carlos.mendes',
    email: 'carlos.mendes@seinfra.gov.br',
    password: 'Suporte2026*',
    role: 'admin',
    department: 'Gerência de TI & Infraestrutura',
    jobTitle: 'Analista de Infraestrutura Sênior',
    status: 'ativo',
    phone: '(61) 3314-5012',
    avatarUrl: '',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'user_2',
    name: 'Mariana Duarte',
    username: 'mariana.duarte',
    email: 'mariana.duarte@seinfra.gov.br',
    password: 'Suporte2026*',
    role: 'tecnico',
    department: 'Suporte & Field Service',
    jobTitle: 'Técnica de TI & Operadora de Patrimônio',
    status: 'ativo',
    phone: '(61) 3314-5044',
    avatarUrl: '',
    createdAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 'user_3',
    name: 'Dr. Roberto Silveira',
    username: 'roberto.auditor',
    email: 'roberto.silveira@cge.gov.br',
    password: 'Suporte2026*',
    role: 'auditor',
    department: 'Controladoria & Compliance Governamental',
    jobTitle: 'Auditor Federal de Controle Interno',
    status: 'ativo',
    phone: '(61) 3412-8800',
    avatarUrl: '',
    createdAt: '2024-03-10T14:30:00Z'
  },
  {
    id: 'user_4',
    name: 'Beatriz Almeida',
    username: 'beatriz.almeida',
    email: 'beatriz.almeida@projetos.seinfra.gov.br',
    password: 'Suporte2026*',
    role: 'solicitante',
    department: 'Diretoria de Obras & Vistorias Técnicas',
    jobTitle: 'Engenheira Civil / Piloto RPAS',
    status: 'ativo',
    phone: '(61) 3314-5099',
    avatarUrl: '',
    createdAt: '2024-04-12T11:15:00Z'
  }
];

export const INITIAL_ASSETS: Asset[] = [
  // RPAS Drone Equipments
  {
    id: 'ast-rpas-01',
    tag: 'PAT-RPAS-0001',
    name: 'Drone DJI Matrice 350 RTK - Case Completo de Voo',
    category: 'rpas_drone',
    type: 'equipamento',
    ownership: 'proprio',
    brand: 'DJI Enterprise',
    model: 'Matrice 350 RTK c/ Câmera Zenmuse H20T Térmica',
    serialNumber: 'DJI-M350-994182-BR',
    acquisitionDate: '2024-05-10',
    warrantyExpiresAt: '2027-05-10',
    status: 'disponivel',
    location: {
      building: 'Edifício Sede SEINFRA',
      floor: 'Térreo',
      room: 'Almoxarifado Especial de RPAS / Topografia',
      department: 'Diretoria de Obras & Vistorias Técnicas'
    },
    specs: {
      anacPrefix: 'PP-094182910',
      maxFlightTimeMin: 55,
      cameraSensor: 'Zenmuse H20T Quad-Sensor (Zoom 20x, Radiométrico Térmico, Telemetro Laser 1200m)'
    },
    purchaseValue: 98500.00,
    qrCodeData: 'PAT-RPAS-0001|DJI-M350-994182-BR|SISANT-PP-094182910',
    notes: 'Aeronave RPAS registrada no SISANT/ANAC e SARPAS/DECEA. Acompanha Case estanque militar, 4 baterias TB65, Rádio RC Plus, carregador BS65 e 2 pares de hélices reservas 2110.',
    createdAt: '2024-05-10T09:00:00Z',
    updatedAt: '2026-10-10T11:00:00Z'
  },
  {
    id: 'ast-rpas-02',
    tag: 'PAT-RPAS-0002',
    name: 'Drone DJI Mavic 3 Enterprise Thermal (M3T)',
    category: 'rpas_drone',
    type: 'equipamento',
    ownership: 'proprio',
    brand: 'DJI Enterprise',
    model: 'Mavic 3 Enterprise Thermal RTK',
    serialNumber: 'DJI-M3T-481920-XJ',
    acquisitionDate: '2024-08-15',
    warrantyExpiresAt: '2026-11-20',
    status: 'emprestado',
    location: {
      building: 'Edifício Sede SEINFRA',
      floor: 'Térreo',
      room: 'Almoxarifado Especial de RPAS',
      department: 'Diretoria de Obras & Vistorias Técnicas'
    },
    specs: {
      anacPrefix: 'PP-088219441',
      maxFlightTimeMin: 45,
      cameraSensor: 'Térmica 640x512 + Grande-Angular 48MP + Teleobjetiva 56x'
    },
    purchaseValue: 46200.00,
    qrCodeData: 'PAT-RPAS-0002|DJI-M3T-481920-XJ|SISANT-PP-088219441',
    notes: 'Case rígido com 3 baterias inteligentes, Smart Controller DJI RC Pro Enterprise, hub de carga 100W e protetor de gimbal.',
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2026-10-20T15:00:00Z'
  },
  // Multimedia Equipments
  {
    id: 'ast-mult-01',
    tag: 'PAT-MULT-0010',
    name: 'Projetor Laser Epson PowerLite L520U 5200 Lumens WUXGA',
    category: 'multimidia',
    type: 'equipamento',
    ownership: 'proprio',
    brand: 'Epson',
    model: 'PowerLite L520U Full HD Laser',
    serialNumber: 'EPS-L520U-884910',
    acquisitionDate: '2024-02-20',
    warrantyExpiresAt: '2027-02-20',
    status: 'disponivel',
    location: {
      building: 'Edifício Sede SEINFRA',
      floor: '2º Andar',
      room: 'Auditório Principal / Sala Multimídia',
      department: 'Comunicação & Eventos Institucionais'
    },
    purchaseValue: 12900.00,
    qrCodeData: 'PAT-MULT-0010|EPS-L520U-884910|EPSON-LASER',
    notes: 'Equipamento multimídia para conferências e audiências públicas. Acompanha cabo HDMI 10m, controle remoto e maleta acolchoada.',
    createdAt: '2024-02-20T08:30:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'ast-mult-02',
    tag: 'LOC-MULT-0022',
    name: 'Kit Caixa de Som Ativa JBL EON712 + Microfones Sem Fio',
    category: 'multimidia',
    type: 'equipamento',
    ownership: 'alugado',
    brand: 'JBL Professional',
    model: 'EON 712 1300W Bluetooth + Shure BLX288/PG58',
    serialNumber: 'JBL-EON712-44129',
    acquisitionDate: '2025-01-15',
    warrantyExpiresAt: '2027-01-15',
    status: 'disponivel',
    location: {
      building: 'Edifício Sede SEINFRA',
      floor: '2º Andar',
      room: 'Depósito de Eventos TI',
      department: 'Operações TI & Multimídia'
    },
    rentalInfo: {
      contractNumber: 'CTR-LOC-EVENTOS-2025/14',
      rentalCompany: 'AudioTech Sonorização Corporativa',
      contactPhone: '(61) 3344-9988',
      rentalStartDate: '2025-01-15',
      rentalEndDate: '2027-01-15',
      monthlyCost: 340.00
    },
    qrCodeData: 'LOC-MULT-0022|JBL-EON712-44129|JBL-EON712',
    notes: 'Case com 1 caixa amplificada JBL EON 712, 1 pedestal tripé, 2 microfones Shure sem fio e cabos XLR balanceados.',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2026-09-10T11:00:00Z'
  },
  // Traditional IT Assets
  {
    id: 'ast-001',
    tag: 'PAT-004120',
    name: 'Notebook Dell Latitude 5430',
    category: 'notebook',
    type: 'equipamento',
    ownership: 'proprio',
    brand: 'Dell',
    model: 'Latitude 5430 Core i7 16GB 512GB SSD',
    serialNumber: 'BR-DELL-883921-XJ',
    acquisitionDate: '2024-03-15',
    warrantyExpiresAt: '2027-03-15',
    status: 'em_uso',
    location: {
      building: 'Edifício Sede SEINFRA',
      floor: '3º Andar',
      room: 'Sala 302',
      department: 'Engenharia de Software'
    },
    assignedTo: {
      name: 'Lucas Ferreira',
      email: 'lucas.ferreira@seinfra.gov.br',
      department: 'Engenharia de Software',
      cpfOrRegistration: 'MAT-88491'
    },
    specs: {
      cpu: 'Intel Core i7 12th Gen',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      os: 'Windows 11 Pro 64-bit'
    },
    purchaseValue: 6490.00,
    qrCodeData: 'PAT-004120|BR-DELL-883921-XJ|DELL-LATITUDE',
    notes: 'Equipamento corporativo de alto desempenho.',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2026-01-10T14:20:00Z'
  },
  {
    id: 'ast-002',
    tag: 'LOC-008412',
    name: 'Workstation Lenovo ThinkPad P14s',
    category: 'notebook',
    type: 'equipamento',
    ownership: 'alugado',
    brand: 'Lenovo',
    model: 'ThinkPad P14s Gen 4 AMD Ryzen 7',
    serialNumber: 'PF49B99210-LN',
    acquisitionDate: '2025-01-10',
    warrantyExpiresAt: '2026-11-15',
    status: 'emprestado',
    location: {
      building: 'Edifício Sede SEINFRA',
      floor: '2º Andar',
      room: 'Pool de Empréstimos TI',
      department: 'Operações TI'
    },
    rentalInfo: {
      contractNumber: 'CTR-LOC-2025/089',
      rentalCompany: 'Simpress Rental Solutions',
      contactPhone: '(61) 3901-4400',
      rentalStartDate: '2025-01-10',
      rentalEndDate: '2026-11-10',
      monthlyCost: 285.00
    },
    specs: {
      cpu: 'AMD Ryzen 7 PRO 7840U',
      ram: '32GB LPDDR5x',
      storage: '1TB Gen4 SSD',
      os: 'Ubuntu 24.04 LTS'
    },
    qrCodeData: 'LOC-008412|PF49B99210-LN|LENOVO-P14S',
    notes: 'Contrato de locação inclui suporte NBD com troca expressa.',
    createdAt: '2025-01-10T09:30:00Z',
    updatedAt: '2026-10-18T16:00:00Z'
  },
  {
    id: 'ast-003',
    tag: 'PAT-003980',
    name: 'Servidor Dell PowerEdge R650',
    category: 'servidor',
    type: 'equipamento',
    ownership: 'proprio',
    brand: 'Dell',
    model: 'PowerEdge R650 Rack 1U 2x Xeon',
    serialNumber: 'CN-DELL-992384-SRV',
    acquisitionDate: '2023-06-20',
    warrantyExpiresAt: '2026-10-30',
    status: 'em_uso',
    location: {
      building: 'Data Center Primário SEINFRA',
      floor: 'Subsolo 1',
      room: 'Rack 04 - U12 a U13',
      department: 'Infraestrutura Crítica'
    },
    specs: {
      cpu: '2x Intel Xeon Silver 4314 (32 cores)',
      ram: '128GB ECC Registered',
      storage: '4x 1.92TB Enterprise SAS SSD RAID 10',
      ipAddress: '10.0.10.15'
    },
    purchaseValue: 38900.00,
    qrCodeData: 'PAT-003980|CN-DELL-992384-SRV|DELL-R650',
    notes: 'Hospeda nó do cluster virtualizado VMware ESXi de banco de dados.',
    createdAt: '2023-06-20T08:00:00Z',
    updatedAt: '2026-10-12T11:00:00Z'
  },
  {
    id: 'ast-006',
    tag: 'SUP-001020',
    name: 'Cartucho Toner HP LaserJet CF258X (58X)',
    category: 'suprimento_toner',
    type: 'suprimento',
    ownership: 'proprio',
    brand: 'HP',
    model: 'Toner Preto Original 58X Alto Rendimento',
    serialNumber: 'LOT-HP2026-0984',
    acquisitionDate: '2026-02-10',
    warrantyExpiresAt: '2028-02-10',
    status: 'disponivel',
    location: {
      building: 'Edifício Sede SEINFRA',
      floor: '1º Andar',
      room: 'Almoxarifado TI',
      department: 'Estoque Suprimentos'
    },
    suppliesInfo: {
      currentStock: 2,
      minStockThreshold: 5,
      unit: 'un',
      shelfLocation: 'Gaveta T-04 (Gabinete Secretário)',
      autoReplenish: true,
      supplierName: 'Distribuidora Kalunga Corporativo',
      lastRestockDate: '2026-07-15',
      suggestedOrderQty: 8,
      unitCost: 489.00
    },
    qrCodeData: 'SUP-001020|LOT-HP2026-0984|HP-TONER-58X',
    notes: 'Compatível com HP LaserJet Pro M404, M428. Consumo alto mensal.',
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-10-20T10:00:00Z'
  },
  {
    id: 'ast-007',
    tag: 'SUP-001045',
    name: 'Patch Cord UTP Cat6 2.5m Furukawa Azul',
    category: 'suprimento_cabo',
    type: 'suprimento',
    ownership: 'proprio',
    brand: 'Furukawa',
    model: 'GigaLan Cat6 RJ45 2.5m 100% Cobre',
    serialNumber: 'LOTE-FUR-2026A',
    acquisitionDate: '2026-05-18',
    warrantyExpiresAt: '2030-05-18',
    status: 'disponivel',
    location: {
      building: 'Edifício Sede SEINFRA',
      floor: '1º Andar',
      room: 'Almoxarifado TI',
      department: 'Estoque Suprimentos'
    },
    suppliesInfo: {
      currentStock: 6,
      minStockThreshold: 15,
      unit: 'un',
      shelfLocation: 'Caixa Cabos C-02',
      autoReplenish: true,
      supplierName: 'Furukawa Electric do Brasil',
      lastRestockDate: '2026-05-18',
      suggestedOrderQty: 50,
      unitCost: 14.50
    },
    qrCodeData: 'SUP-001045|LOTE-FUR-2026A|FURUKAWA-CAT6',
    notes: 'Utilizado em montagem de novos postos de trabalho.',
    createdAt: '2026-05-18T10:00:00Z',
    updatedAt: '2026-10-22T08:45:00Z'
  }
];

export const INITIAL_LOANS: Loan[] = [
  // RPAS Drone Flight Loan with Case Accessories
  {
    id: 'loan-rpas-01',
    protocolNumber: 'RPAS-2026-0008',
    termType: 'rpas_drone',
    assetId: 'ast-rpas-02',
    assetTag: 'PAT-RPAS-0002',
    assetName: 'Drone DJI Mavic 3 Enterprise Thermal (M3T)',
    assetModel: 'Mavic 3 Enterprise Thermal RTK',
    assetSerial: 'DJI-M3T-481920-XJ',
    borrowerName: 'Beatriz Almeida',
    borrowerEmail: 'beatriz.almeida@projetos.seinfra.gov.br',
    borrowerDepartment: 'Diretoria de Obras & Vistorias Técnicas',
    borrowerDoc: 'MAT-33910 / CPF 012.983.441-90',
    borrowerRole: 'Engenheira Fiscal / Piloto RPAS Remoto',
    pilotLicenseDoc: 'ANAC/SISANT: PP-088219441 | SARPAS: PL-2024/99120',
    missionPurpose: 'Levantamento topográfico e fiscalização das obras de duplicação do Eixo Norte',
    missionLocation: 'Trecho Rodoviário DF-003 km 14 ao 22',
    loanDate: '2026-10-20',
    expectedReturnDate: '2026-10-26',
    status: 'ativo',
    conditionOnLoan: 'Kit completo em Case estanque rígido. Drone limpo, sem fissuras, sensores calibrados e firmware atualizado na versão estável.',
    operatorName: 'NTI SEINFRA - Suporte Master',
    operatorId: 'user_master',
    notes: 'Missão autorizada pelo DECEA sob Protocolo SARPAS #889412. Piloto apresentou seguro RETA e certidão de cadastro ANAC vigentes.',
    cautionTermSigned: true,
    cautionTermHash: 'SHA256:e9b1049c8901238aa184b2c41890',
    droneKit: {
      droneModel: 'DJI Mavic 3 Enterprise Thermal (M3T)',
      anacRegistration: 'PP-088219441',
      deceaRegistration: 'SARPAS-DF-889412',
      batteriesCount: 3,
      smartController: true,
      controllerSerial: 'RC-PRO-ENT-99120',
      sparePropellersPairs: 2,
      chargingHubAndPowerSupply: true,
      gimbalProtectorCover: true,
      usbCablesKit: true,
      microSdCardGb: 128,
      hardCasePelican: true,
      lanyardStrap: true,
      landingPad: true,
      extraAccessories: 'Módulo RTK de alta precisão acoplável e leitor USB-C de cartão'
    }
  },
  {
    id: 'loan-001',
    protocolNumber: 'EMP-2026-0038',
    termType: 'geral',
    assetId: 'ast-002',
    assetTag: 'LOC-008412',
    assetName: 'Workstation Lenovo ThinkPad P14s',
    assetModel: 'ThinkPad P14s Gen 4 AMD Ryzen 7',
    assetSerial: 'PF49B99210-LN',
    borrowerName: 'Beatriz Almeida',
    borrowerEmail: 'beatriz.almeida@projetos.seinfra.gov.br',
    borrowerDepartment: 'Diretoria de Obras & Vistorias Técnicas',
    borrowerDoc: 'MAT-33910',
    loanDate: '2026-10-10',
    expectedReturnDate: '2026-10-22',
    status: 'atrasado',
    conditionOnLoan: 'Equipamento em perfeito estado estético e funcional com carregador original 65W.',
    operatorName: 'Mariana Duarte',
    operatorId: 'user_2',
    notes: 'Empréstimo para trabalho de campo em vistorias.',
    cautionTermSigned: true,
    cautionTermHash: 'SHA256:d8a9f47bc18902e88a09bc3'
  }
];

export const INITIAL_MOVEMENTS: Movement[] = [
  {
    id: 'mov-rpas-01',
    timestamp: '2026-10-20T15:00:00Z',
    type: 'emprestimo',
    assetId: 'ast-rpas-02',
    assetTag: 'PAT-RPAS-0002',
    assetName: 'Drone DJI Mavic 3 Enterprise Thermal (M3T)',
    quantity: 1,
    origin: 'Almoxarifado Especial de RPAS',
    destination: 'Diretoria de Obras (Beatriz Almeida)',
    responsibleName: 'NTI SEINFRA - Suporte Master',
    reason: 'Vistoria aérea e levantamento fotogramétrico de obras públicas',
    referenceDoc: 'RPAS-2026-0008'
  },
  {
    id: 'mov-001',
    timestamp: '2026-10-22T09:15:00Z',
    type: 'saida',
    assetId: 'ast-007',
    assetTag: 'SUP-001045',
    assetName: 'Patch Cord UTP Cat6 2.5m Furukawa Azul',
    quantity: 4,
    origin: 'Almoxarifado TI',
    destination: '4º Andar - Novas Ilhas de Vendas',
    responsibleName: 'Mariana Duarte',
    reason: 'Cabeamento de 4 novos postos',
    referenceDoc: 'OS-88391'
  },
  {
    id: 'mov-002',
    timestamp: '2026-10-20T14:40:00Z',
    type: 'saida',
    assetId: 'ast-006',
    assetTag: 'SUP-001020',
    assetName: 'Cartucho Toner HP LaserJet CF258X (58X)',
    quantity: 1,
    origin: 'Almoxarifado TI',
    destination: 'Gabinete do Secretário',
    responsibleName: 'NTI SEINFRA - Suporte Master',
    reason: 'Substituição preventiva por alerta de toner baixo no display',
    referenceDoc: 'REQ-44120'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-000',
    timestamp: '2026-10-24T14:00:00Z',
    userId: 'user_master',
    userName: 'NTI SEINFRA - Administrador Master',
    userRole: 'admin',
    action: 'LOGIN_SISTEMA',
    entityType: 'System',
    entityId: 'SYS',
    summary: 'Autenticação do usuário padrão nti.seinfra com perfil Administrador Master',
    ipAddress: '10.50.12.1'
  },
  {
    id: 'aud-rpas-01',
    timestamp: '2026-10-20T15:05:00Z',
    userId: 'user_master',
    userName: 'NTI SEINFRA - Administrador Master',
    userRole: 'admin',
    action: 'EMISSAO_CAUTELA_RPAS',
    entityType: 'Loan',
    entityId: 'loan-rpas-01',
    summary: 'Emissão de Termo de Responsabilidade e Cautela RPAS #RPAS-2026-0008 para drone DJI M3T com Case e acessórios para Beatriz Almeida',
    details: {
      drone: 'PAT-RPAS-0002',
      sisant: 'PP-088219441',
      baterias: 3,
      smartController: true,
      caseRigido: true,
      missao: 'Fiscalização de obras Eixo Norte'
    },
    ipAddress: '10.50.12.1'
  }
];

export const INITIAL_REPLENISHMENT_ORDERS: ReplenishmentOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2026-0012',
    assetId: 'ast-006',
    itemName: 'Cartucho Toner HP LaserJet CF258X (58X)',
    category: 'suprimento_toner',
    supplierName: 'Distribuidora Kalunga Corporativo',
    quantity: 8,
    unit: 'un',
    estimatedCost: 3912.00,
    status: 'sugerido',
    createdAt: '2026-10-20T14:41:00Z',
    autoGenerated: true
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2026-0013',
    assetId: 'ast-007',
    itemName: 'Patch Cord UTP Cat6 2.5m Furukawa Azul',
    category: 'suprimento_cabo',
    supplierName: 'Furukawa Electric do Brasil',
    quantity: 50,
    unit: 'un',
    estimatedCost: 725.00,
    status: 'sugerido',
    createdAt: '2026-10-22T09:16:00Z',
    autoGenerated: true
  }
];

export const INITIAL_ERP_CONFIG: ErpConfig = {
  systemType: 'SAP S/4HANA',
  apiUrl: 'https://erp.seinfra.gov.br/api/v2/integration/techpark',
  apiKey: 'erp_live_sec_seinfra_89df23a00941bc448e89f1',
  webhookSecret: 'whsec_seinfra_9941a8bc92d1',
  autoSyncInventory: true,
  autoSyncPurchases: true,
  syncIntervalMinutes: 30,
  lastSyncAt: '2026-10-24T12:00:00Z',
  status: 'conectado'
};

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  systemName: 'InfraParque',
  companyName: 'SEINFRA - Secretaria de Estado de Infraestrutura',
  departmentName: 'Núcleo de Tecnologia da Informação (NTI)',
  systemLogoUrl: '',
  termsLogoUrl: '',
  colorTheme: 'cyan',
  customPrimaryColor: '#06b6d4'
};

export const INITIAL_TERM_TEMPLATES: TermTemplate[] = [
  {
    id: 'termo_geral',
    title: 'TERMO DE ENTREGA E CAUTELA DE BEM TECNOLÓGICO',
    version: 'v2.4 (2026)',
    updatedAt: '2026-10-24T12:00:00Z',
    headerSubtitle: 'Departamento de Tecnologia da Informação & Gestão de Ativos',
    clause1Title: 'CLÁUSULA PRIMEIRA - DA FINALIDADE E GUARDA',
    clause1Content: 'O colaborador acima qualificado assume inteira responsabilidade civil e administrativa pela guarda, zelo e correta conservação do equipamento tecnológico descrito, comprometendo-se a utilizá-lo estritamente no exercício das atribuições e metas da instituição.',
    clause2Title: 'CLÁUSULA SEGUNDA - DA PROIBIÇÃO DE CESSÃO A TERCEIROS',
    clause2Content: 'É terminantemente proibida a cessão, transferência ou subempréstimo do bem a terceiros sem prévia autorização formal da Diretoria de TI ou chefia imediata.',
    clause3Title: 'CLÁUSULA TERCEIRA - DOS DANOS, EXTRAVIOS E PRAZOS',
    clause3Content: 'Em caso de extravio, dano decorrente de negligência ou furto, o responsável comunicará a área de TI no prazo impreterível de 24 horas úteis acompanhado de Boletim de Ocorrência policial e relatório circunstanciado.',
    clauses: [
      {
        id: 'c-geral-1',
        number: 1,
        title: 'CLÁUSULA PRIMEIRA - DA FINALIDADE E GUARDA',
        content: 'O colaborador acima qualificado assume inteira responsabilidade civil e administrativa pela guarda, zelo e correta conservação do equipamento tecnológico descrito, comprometendo-se a utilizá-lo estritamente no exercício das atribuições e metas da instituição.'
      },
      {
        id: 'c-geral-2',
        number: 2,
        title: 'CLÁUSULA SEGUNDA - DA PROIBIÇÃO DE CESSÃO A TERCEIROS',
        content: 'É terminantemente proibida a cessão, transferência ou subempréstimo do bem a terceiros sem prévia autorização formal da Diretoria de TI ou chefia imediata.'
      },
      {
        id: 'c-geral-3',
        number: 3,
        title: 'CLÁUSULA TERCEIRA - DOS DANOS, EXTRAVIOS E PRAZOS',
        content: 'Em caso de extravio, dano decorrente de negligência ou furto, o responsável comunicará a área de TI no prazo impreterível de 24 horas úteis acompanhado de Boletim de Ocorrência policial e relatório circunstanciado.'
      }
    ],
    additionalClauses: 'O equipamento deverá ser devolvido na data aprazada, limpo e com todos os acessórios originais, sob pena de suspensão de novas retiradas.',
    customFooterNotes: 'Documento gerado com certificação de integridade digital e arquivado para fins de auditoria interna.'
  },
  {
    id: 'termo_rpas',
    title: 'TERMO DE RESPONSABILIDADE E CAUTELA DE EQUIPAMENTO RPAS (DRONE) & ACESSÓRIOS',
    version: 'v3.1 (ANAC/DECEA 2026)',
    updatedAt: '2026-10-24T12:00:00Z',
    headerSubtitle: 'Núcleo de Tecnologia da Informação (NTI) - Fiscalização, Vistorias e Operações Aéreas',
    clause1Title: 'CLÁUSULA 1ª - LEGISLAÇÃO E REGRAS DO ESPAÇO AÉREO',
    clause1Content: 'O piloto operador declara ter pleno conhecimento da Instrução do Comando da Aeronáutica (ICA 100-40 do DECEA), do Regulamento Brasileiro de Aviação Civil Especial (RBAC-E nº 94 da ANAC) e das normas da ANATEL, comprometendo-se a realizar voos exclusivamente com prévia solicitação no sistema SARPAS e em áreas desimpedidas.',
    clause2Title: 'CLÁUSULA 2ª - GUARDA DO CASE ESTANQUE E ACESSÓRIOS',
    clause2Content: 'O recebedor responderá administrativa e civilmente pela perda, extravio de peças (aeronave, rádio controle, baterias inteligentes de voo, hélices, cartões de memória, carregadores) ou danos decorrentes de imperícia, negligência ou operação em desacordo com o manual do fabricante.',
    clause3Title: 'CLÁUSULA 3ª - SINISTROS, INCIDENTES E FLYAWAYS',
    clause3Content: 'Qualquer incidente, acidente de voo ou perda de sinal deverá ser comunicado imediatamente ao Núcleo de Tecnologia da Informação (NTI) em até 24 horas úteis, com fornecimento dos arquivos de log de voo (.DAT / .TXT do controle) para perícia técnica.',
    clauses: [
      {
        id: 'c-rpas-1',
        number: 1,
        title: 'CLÁUSULA 1ª - LEGISLAÇÃO E REGRAS DO ESPAÇO AÉREO (DECEA/ANAC)',
        content: 'O piloto operador declara ter pleno conhecimento da Instrução do Comando da Aeronáutica (ICA 100-40 do DECEA), do Regulamento Brasileiro de Aviação Civil Especial (RBAC-E nº 94 da ANAC) e das normas da ANATEL, comprometendo-se a realizar voos exclusivamente com prévia solicitação no sistema SARPAS e em áreas desimpedidas.'
      },
      {
        id: 'c-rpas-2',
        number: 2,
        title: 'CLÁUSULA 2ª - GUARDA DO CASE ESTANQUE E ACESSÓRIOS',
        content: 'O recebedor responderá administrativa e civilmente pela perda, extravio de peças (aeronave, rádio controle, baterias inteligentes de voo, hélices, cartões de memória, carregadores) ou danos decorrentes de imperícia, negligência ou operação em desacordo com o manual do fabricante.'
      },
      {
        id: 'c-rpas-3',
        number: 3,
        title: 'CLÁUSULA 3ª - SINISTROS, INCIDENTES E FLYAWAYS',
        content: 'Qualquer incidente, acidente de voo ou perda de sinal deverá ser comunicado imediatamente ao Núcleo de Tecnologia da Informação (NTI) em até 24 horas úteis, com fornecimento dos arquivos de log de voo (.DAT / .TXT do controle) para perícia técnica.'
      }
    ],
    additionalClauses: 'É obrigatório o porte digital ou físico da certidão de cadastro no SISANT/ANAC e do comprovante de solicitação no SARPAS/DECEA durante toda a operação.',
    customFooterNotes: 'Conformidade plena com o Manual de Vistorias Aéreas e Normas Militares do Espaço Aéreo Brasileiro.'
  }
];

export const INITIAL_CATALOG_OPTIONS: CatalogOptions = {
  equipmentCategories: [
    { id: 'rpas_drone', name: 'RPAS / Drone Profissional', type: 'equipamento', description: 'Drones e aeronaves não tripuladas para fiscalização e topografia', isSystem: true },
    { id: 'multimidia', name: 'Multimídia (Projetor / Som / Eventos)', type: 'equipamento', description: 'Projetores, caixas de som ativas, microfones e passadores', isSystem: true },
    { id: 'notebook', name: 'Notebook / Portátil', type: 'equipamento', description: 'Laptops corporativos e ultraportáteis para mobilidade', isSystem: true },
    { id: 'desktop', name: 'Desktop / Workstation', type: 'equipamento', description: 'Computadores de mesa e estações gráficas de alta performance', isSystem: true },
    { id: 'servidor', name: 'Servidor Rack / Torre', type: 'equipamento', description: 'Servidores de aplicação, banco de dados e virtualização', isSystem: true },
    { id: 'monitor', name: 'Monitor / Display', type: 'equipamento', description: 'Monitores profissionais, telas ultrawide e TVs de monitoramento', isSystem: true },
    { id: 'rede', name: 'Rede (Switch / Roteador / AP)', type: 'equipamento', description: 'Ativos de conectividade, roteadores de borda e switches PoE', isSystem: true },
    { id: 'impressora', name: 'Impressora / Multifuncional Corporativa', type: 'equipamento', description: 'Multifuncionais laser de rede e impressoras de crachá/térmicas', isSystem: true },
    { id: 'periferico', name: 'Periférico (Teclado / Mouse / Headset)', type: 'equipamento', description: 'Dispositivos de interface humana e acessórios', isSystem: true },
    { id: 'armazenamento', name: 'Armazenamento / Storage NAS', type: 'equipamento', description: 'Storages NAS, gavetas SAN e matrizes de discos', isSystem: true },
    { id: 'tablet_coletor', name: 'Tablets & Coletores de Campo', type: 'equipamento', description: 'Tablets robustecidos para vistorias em campo', isSystem: false },
    { id: 'nobreak', name: 'Nobreak / Estabilizador de Energia', type: 'equipamento', description: 'UPS online senoidal para proteção de racks e servidores', isSystem: false },
    { id: 'outro', name: 'Outro Equipamento', type: 'equipamento', description: 'Outros bens patrimoniais permanentes', isSystem: true }
  ],
  supplyCategories: [
    { id: 'suprimento_toner', name: 'Suprimento: Toner & Cartucho Laser', type: 'suprimento', description: 'Cartuchos de toner preto e colorido de alto rendimento', isSystem: true },
    { id: 'suprimento_cabo', name: 'Suprimento: Cabo & Conectividade (HDMI/Rede)', type: 'suprimento', description: 'Patch cords Cat6, cabos HDMI blindados e fibras ópticas', isSystem: true },
    { id: 'suprimento_bateria', name: 'Suprimento: Baterias & Pilhas Recarregáveis', type: 'suprimento', description: 'Pilhas alcalinas, baterias recarregáveis e pilhas 9V', isSystem: false },
    { id: 'suprimento_rpas_pecas', name: 'Suprimento: Peças de RPAS (Hélices/Protetores)', type: 'suprimento', description: 'Hélices de reposição, trem de pouso e travas para drones', isSystem: false },
    { id: 'suprimento_etiquetas', name: 'Suprimento: Bobinas & Etiquetas Patrimoniais', type: 'suprimento', description: 'Etiquetas de poliéster prata com código de barras e ribbons', isSystem: false },
    { id: 'suprimento_perifericos', name: 'Suprimento: Periféricos de Reposição Rápida', type: 'suprimento', description: 'Mouses e teclados em estoque para substituição imediata', isSystem: false },
    { id: 'suprimento_outro', name: 'Outro Suprimento / Consumível', type: 'suprimento', description: 'Outros insumos consumíveis de TI', isSystem: true }
  ],
  equipmentNames: [
    'Notebook Dell Latitude 5430 Core i7 16GB 512GB SSD',
    'Notebook Lenovo ThinkPad E14 Gen 4 Ryzen 7 16GB',
    'Notebook HP ProBook 445 G9 Ryzen 5 8GB 256GB SSD',
    'Workstation Dell Precision 3660 Intel Core i9 64GB RTX 4000',
    'Desktop HP EliteDesk 800 G8 Core i5 16GB SSD',
    'Drone DJI Matrice 350 RTK - Case Completo com Câmera H20T',
    'Drone DJI Mavic 3 Enterprise - Kit Baterias e Módulo RTK',
    'Kit Multimídia Móvel - Projetor Epson 4000 Lumens + Caixa Ativa JBL',
    'Servidor Dell PowerEdge R750xs 2x Xeon 128GB RAM 8x 2TB SAS',
    'Switch Cisco Catalyst 2960-X 48 Portas PoE+ Gigabit',
    'Switch Aruba Instant On 1930 24G 4SFP/SFP+ PoE 195W',
    'Impressora Multifuncional HP LaserJet Enterprise M528dn',
    'Impressora Térmica Zebra ZD220 para Etiquetas Patrimoniais',
    'Monitor Dell UltraSharp U2722D 27" QHD IPS',
    'Monitor LG 24BL650J 23.8" Full HD Pivot',
    'Tablet Rugged Samsung Galaxy Tab Active4 Pro LTE',
    'Nobreak APC Smart-UPS 3000VA Senoidal 220V'
  ],
  supplyNames: [
    'Toner Preto HP 89A (CF289A) Original 5.000 págs',
    'Toner Brother TN-3472 Alto Rendimento 12.000 págs',
    'Cabo de Rede Patch Cord Furukawa Cat6 Gigalan 1.5m Azul',
    'Cabo de Rede Patch Cord Furukawa Cat6 Gigalan 3.0m Cinza',
    'Cabo HDMI 2.0 4K Ultra HD Blindado 5 Metros',
    'Kit de Hélices Reserva DJI Matrice 350 RTK (2 Pares)',
    'Hélices Silenciosas DJI Mavic 3 Enterprise (Par)',
    'Etiqueta Poliéster 50x30mm Prata Fosca para Patrimônio (Rolo c/ 1000)',
    'Bateria DJI TB65 para Matrice 350 RTK',
    'Mouse Óptico USB Dell MS116 Preto',
    'Teclado Padrão ABNT2 USB Dell KB216 Preto',
    'Headset USB c/ Cancelamento de Ruído Jabra Evolve 20'
  ],
  equipmentBrands: [
    'Dell Technologies',
    'Lenovo',
    'HP Enterprise',
    'DJI Enterprise',
    'Cisco Systems',
    'Aruba / HPE',
    'Epson',
    'Zebra Technologies',
    'LG Electronics',
    'Samsung',
    'Apple',
    'APC by Schneider Electric',
    'Intelbras',
    'JBL Professional'
  ],
  supplyBrands: [
    'HP Original',
    'Brother',
    'Furukawa Electric',
    'DJI Enterprise',
    'Zebra Technologies',
    'Lexmark',
    'Elgin',
    'Logitech',
    'Multilaser',
    'Philips',
    'Duracell Industrial'
  ],
  equipmentModels: [
    'Latitude 5430',
    'Latitude 3420',
    'ThinkPad E14 Gen 4',
    'ThinkPad T14s',
    'ProBook 445 G9',
    'Matrice 350 RTK',
    'Mavic 3 Enterprise',
    'Precision 3660',
    'EliteDesk 800 G8',
    'PowerEdge R750xs',
    'Catalyst 2960-X',
    'Instant On 1930 24G',
    'LaserJet Enterprise M528dn',
    'ZD220',
    'UltraSharp U2722D',
    'Galaxy Tab Active4 Pro',
    'Smart-UPS 3000VA'
  ],
  supplyModels: [
    'CF289A (HP 89A)',
    'TN-3472',
    'Patch Cord Cat6 1.5m',
    'Patch Cord Cat6 3.0m',
    'HDMI 2.0 Blindado 5m',
    'TB65 Intelligent Battery',
    'Hélices Matrice 2110s',
    'Hélices Mavic 3E',
    'Etiqueta 50x30mm Poliéster Prata',
    'MS116',
    'KB216',
    'Evolve 20'
  ],
  buildings: [
    'Edifício Sede SEINFRA - Asa Norte',
    'Anexo I - Centro de Operações de Redes (NOC)',
    'Anexo II - Engenharia & Vistorias de Campo',
    'Almoxarifado Central e Logística TI',
    'Complexo de Garagens & Hangar RPAS',
    'Superintendência Regional Centro-Oeste'
  ],
  floors: [
    'Subsolo / Garagem Técnica',
    'Térreo',
    '1º Andar',
    '2º Andar',
    '3º Andar - Diretoria & Gabinete',
    '4º Andar',
    'Mezanino Técnico'
  ],
  rooms: [
    'Almoxarifado TI Central',
    'Almoxarifado Especial de RPAS / Topografia',
    'Sala de Servidores & Datacenter Principal',
    'Laboratório de Manutenção e Hardware',
    'NOC / Sala de Monitoramento de Redes',
    'Sala 102 - Suporte ao Usuário & Helpdesk',
    'Sala 204 - Engenharia e Projetos Rodoviários',
    'Sala 301 - Gabinete do Secretário',
    'Auditório Principal Multimídia',
    'Sala de Reuniões e Vistorias Remotas'
  ],
  departments: [
    'Núcleo de Tecnologia da Informação (NTI)',
    'Diretoria de Obras & Vistorias Técnicas',
    'Gerência de Redes & Telecomunicações',
    'Gerência de Suporte ao Usuário (Service Desk)',
    'Controladoria & Compliance Interno',
    'Gabinete do Secretário Executivo',
    'Coordenação de Geoprocessamento & Topografia',
    'Assessoria de Comunicação & Eventos',
    'Diretoria Administrativa e Financeira'
  ],
  rentalCompanies: [
    'Simpress Soluções de TI Ltda.',
    'Arlequim Soluções em Nuvem & Hardware',
    'Positivo Tecnologia S.A.',
    'Agasus Locação de Equipamentos de TI',
    'Scansource Brasil Distribuidora',
    'Voke Tecnologia e Locações'
  ],
  rentalContracts: [
    'CTR-2024/0018-SEINFRA',
    'CTR-2024/0045-SEINFRA',
    'CTR-2025/0003-SEINFRA',
    'CTR-2025/0022-TI',
    'CTR-2026/0009-RPAS'
  ],
  rentalEndDates: [
    '2026-12-31',
    '2027-06-30',
    '2027-12-31',
    '2028-04-30',
    '2028-12-31'
  ],
  monthlyCosts: [
    '185.00',
    '220.00',
    '250.00',
    '320.00',
    '450.00',
    '680.00',
    '1250.00',
    '2800.00'
  ]
};
