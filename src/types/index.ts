export type UserRole = 'admin' | 'tecnico' | 'auditor' | 'solicitante';

export interface UserProfile {
  id: string;
  name: string;
  username: string; // Ex: nti.seinfra
  email: string;
  password?: string; // Ex: Suporte2026*
  role: UserRole;
  department: string;
  jobTitle?: string;
  status: 'ativo' | 'inativo';
  phone?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export type AssetType = 'equipamento' | 'suprimento';
export type OwnershipType = 'proprio' | 'alugado';
export type AssetStatus = 'disponivel' | 'em_uso' | 'manutencao' | 'emprestado' | 'reservado' | 'descartado';

export type AssetCategory = 
  | 'rpas_drone'
  | 'multimidia'
  | 'notebook' 
  | 'desktop' 
  | 'servidor' 
  | 'monitor' 
  | 'rede' 
  | 'impressora' 
  | 'periferico' 
  | 'armazenamento' 
  | 'suprimento_toner' 
  | 'suprimento_cabo' 
  | 'outro'
  | (string & {});

export interface CategoryDefinition {
  id: string;
  name: string;
  type: AssetType; // 'equipamento' | 'suprimento'
  description?: string;
  isSystem?: boolean;
}

export interface CatalogOptions {
  equipmentCategories: CategoryDefinition[];
  supplyCategories: CategoryDefinition[];
  equipmentNames: string[];
  supplyNames: string[];
  equipmentBrands: string[];
  supplyBrands: string[];
  equipmentModels: string[];
  supplyModels: string[];
  buildings: string[];
  floors: string[];
  rooms: string[];
  departments: string[];
  rentalCompanies: string[];
  rentalContracts: string[];
  rentalEndDates: string[];
  monthlyCosts: string[];
}

export interface DroneKitAccessories {
  droneModel: string;
  anacRegistration: string; // SISANT (ex: PP-889123491)
  deceaRegistration?: string; // SARPAS / DECEA
  batteriesCount: number;
  smartController: boolean;
  controllerSerial?: string;
  sparePropellersPairs: number;
  chargingHubAndPowerSupply: boolean;
  gimbalProtectorCover: boolean;
  usbCablesKit: boolean;
  microSdCardGb: number;
  hardCasePelican: boolean;
  lanyardStrap: boolean;
  landingPad?: boolean;
  extraAccessories?: string;
}

export interface MultimediaKitItems {
  hasProjector: boolean;
  projectorModel?: string;
  hasSpeaker: boolean;
  speakerModel?: string;
  microphonesCount: number;
  hasLaserPointer: boolean;
  hasProjectionScreen: boolean;
  cablesIncluded: string[]; // ['HDMI 5m', 'Cabo de Força', 'Extensão 10m', 'VGA']
  notes?: string;
}

export interface Asset {
  id: string;
  tag: string; // Chapa de patrimônio / Tombamento
  name: string;
  category: AssetCategory;
  type: AssetType; // Equipamento ou Suprimento
  ownership: OwnershipType; // Próprio ou Alugado
  brand: string;
  model: string;
  serialNumber: string;
  warrantyExpiresAt: string; // YYYY-MM-DD
  acquisitionDate: string; // YYYY-MM-DD
  status: AssetStatus;
  location: {
    building: string;
    floor: string;
    room: string;
    department: string;
  };
  assignedTo?: {
    name: string;
    email: string;
    department: string;
    cpfOrRegistration?: string;
  };
  rentalInfo?: {
    contractNumber: string;
    rentalCompany: string;
    contactPhone?: string;
    rentalStartDate: string;
    rentalEndDate: string;
    monthlyCost: number;
    contractFileRef?: string;
  };
  suppliesInfo?: {
    currentStock: number;
    minStockThreshold: number;
    unit: string; // 'un', 'cx', 'rolo'
    shelfLocation: string;
    autoReplenish: boolean;
    supplierName: string;
    lastRestockDate: string;
    suggestedOrderQty: number;
    unitCost: number;
  };
  specs?: {
    cpu?: string;
    ram?: string;
    storage?: string;
    os?: string;
    ipAddress?: string;
    macAddress?: string;
    // RPAS / Drone specific specs
    anacPrefix?: string;
    maxFlightTimeMin?: number;
    cameraSensor?: string;
  };
  imageUrl?: string;
  notes?: string;
  purchaseValue?: number;
  qrCodeData: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanItem {
  assetId: string;
  assetTag: string;
  assetName: string;
  assetModel: string;
  assetSerial: string;
  category?: AssetCategory;
  condition?: string;
  ownership?: 'proprio' | 'alugado';
}

export interface Loan {
  id: string;
  protocolNumber: string; // Ex: EMP-2026-0042 ou RPAS-2026-0008
  termType: 'geral' | 'rpas_drone' | 'multimidia';
  assetId: string;
  assetTag: string;
  assetName: string;
  assetModel: string;
  assetSerial: string;
  items?: LoanItem[]; // Multi-item selection support
  borrowerName: string;
  borrowerEmail: string;
  borrowerDepartment: string;
  borrowerDoc: string; // Matrícula ou CPF
  borrowerRole?: string;
  pilotLicenseDoc?: string; // Para operador RPAS (Certificado ANAC / DECEA)
  missionPurpose?: string; // Missão de voo ou finalidade do evento
  missionLocation?: string; // Área de operação / Município
  loanDate: string; // YYYY-MM-DD
  expectedReturnDate: string; // YYYY-MM-DD
  actualReturnDate?: string;
  status: 'ativo' | 'devolvido' | 'atrasado';
  conditionOnLoan: string;
  conditionOnReturn?: string;
  operatorName: string;
  operatorId: string;
  notes?: string;
  cautionTermSigned: boolean;
  cautionTermHash?: string;
  droneKit?: DroneKitAccessories;
  multimediaKit?: MultimediaKitItems;
}

export type MovementType = 
  | 'entrada' 
  | 'saida' 
  | 'emprestimo' 
  | 'devolucao' 
  | 'manutencao_envio' 
  | 'manutencao_retorno' 
  | 'baixa' 
  | 'transferencia' 
  | 'reposicao_automatica';

export interface Movement {
  id: string;
  timestamp: string;
  type: MovementType;
  assetId: string;
  assetTag: string;
  assetName: string;
  quantity: number;
  origin?: string;
  destination?: string;
  responsibleName: string;
  reason: string;
  notes?: string;
  referenceDoc?: string;
  financialImpact?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'Asset' | 'Loan' | 'Supply' | 'System' | 'Import' | 'Config' | 'User';
  entityId: string;
  summary: string;
  details?: Record<string, any>;
  ipAddress: string;
}

export interface ReplenishmentOrder {
  id: string;
  orderNumber: string; // ORD-2026-0012
  assetId: string;
  itemName: string;
  category: AssetCategory;
  supplierName: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  status: 'sugerido' | 'enviado_erp' | 'aprovado' | 'entregue' | 'cancelado';
  createdAt: string;
  autoGenerated: boolean;
}

export interface SystemNotification {
  id: string;
  type: 'estoque_critico' | 'garantia_vencendo' | 'locacao_vencendo' | 'emprestimo_atrasado' | 'sistema';
  title: string;
  description: string;
  severity: 'alta' | 'media' | 'informativa';
  targetId?: string;
  targetType?: 'asset' | 'loan' | 'supply';
  date: string;
  read: boolean;
}

export interface ErpConfig {
  systemType: 'SAP S/4HANA' | 'TOTVS Protheus' | 'Senior ERP' | 'Generic REST API';
  apiUrl: string;
  apiKey: string;
  webhookSecret: string;
  autoSyncInventory: boolean;
  autoSyncPurchases: boolean;
  syncIntervalMinutes: number;
  lastSyncAt: string | null;
  status: 'conectado' | 'desconectado' | 'erro';
}

export type ColorThemePreset = 'cyan' | 'blue' | 'emerald' | 'amber' | 'purple' | 'slate' | 'custom';

export interface SystemSettings {
  systemName: string; // Ex: InfraParque
  companyName: string; // Ex: SEINFRA - Secretaria de Estado de Infraestrutura
  departmentName: string; // Ex: Núcleo de Tecnologia da Informação (NTI)
  systemLogoUrl?: string; // Base64 or image URL for header/sidebar
  termsLogoUrl?: string; // Base64 or image URL for printable terms & reports
  colorTheme?: ColorThemePreset;
  customPrimaryColor?: string; // Hex color code e.g. '#06b6d4'
}

export interface TermClause {
  id: string;
  number?: number;
  title: string;
  content: string;
}

export interface TermTemplate {
  id: 'termo_geral' | 'termo_rpas';
  title: string;
  version: string; // Ex: "v2.4 (2026)"
  updatedAt: string;
  headerSubtitle: string;
  clause1Title: string;
  clause1Content: string;
  clause2Title: string;
  clause2Content: string;
  clause3Title: string;
  clause3Content: string;
  clauses?: TermClause[]; // Dynamic clauses array allowing adding/removing unlimited clauses
  additionalClauses?: string;
  customFooterNotes?: string;
}
