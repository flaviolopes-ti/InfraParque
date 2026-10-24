import { Asset, Loan, Movement, AuditLog, UserProfile, ReplenishmentOrder, ErpConfig, SystemNotification, SystemSettings, TermTemplate, CatalogOptions, CategoryDefinition } from '../types';
import { 
  INITIAL_ASSETS, 
  INITIAL_LOANS, 
  INITIAL_MOVEMENTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_USERS, 
  INITIAL_REPLENISHMENT_ORDERS, 
  INITIAL_ERP_CONFIG,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_TERM_TEMPLATES,
  INITIAL_CATALOG_OPTIONS
} from '../data/initialData';

const STORAGE_KEYS = {
  ASSETS: 'infraparque_assets_v3',
  LOANS: 'infraparque_loans_v3',
  MOVEMENTS: 'infraparque_movements_v3',
  AUDIT: 'infraparque_audit_v3',
  USERS: 'infraparque_users_v3',
  CURRENT_USER: 'infraparque_current_user_v3',
  ORDERS: 'infraparque_orders_v3',
  ERP_CONFIG: 'infraparque_erp_config_v3',
  SYSTEM_SETTINGS: 'infraparque_system_settings_v3',
  TERM_TEMPLATES: 'infraparque_term_templates_v3',
  CATALOG_OPTIONS: 'infraparque_catalog_options_v3'
};

export class StorageManager {
  static getAssets(): Asset[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
      return INITIAL_ASSETS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ASSETS;
    }
  }

  static saveAssets(assets: Asset[]): void {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }

  static getLoans(): Loan[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LOANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(INITIAL_LOANS));
      return INITIAL_LOANS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LOANS;
    }
  }

  static saveLoans(loans: Loan[]): void {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  }

  static getMovements(): Movement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(INITIAL_MOVEMENTS));
      return INITIAL_MOVEMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MOVEMENTS;
    }
  }

  static saveMovements(movements: Movement[]): void {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
  }

  static getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  static logAudit(
    user: UserProfile,
    action: string,
    entityType: 'Asset' | 'Loan' | 'Supply' | 'System' | 'Import' | 'Config' | 'User',
    entityId: string,
    summary: string,
    details?: Record<string, any>
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      entityType,
      entityId,
      summary,
      details,
      ipAddress: '10.50.12.' + (Math.floor(Math.random() * 80) + 10)
    };
    logs.unshift(newLog);
    // Keep max 500 audit logs in memory
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs.slice(0, 500)));
  }

  // --- USER MANAGEMENT ---
  static getUsers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      const parsed = JSON.parse(raw);
      // Ensure master user exists
      if (!parsed.some((u: UserProfile) => u.username === 'nti.seinfra')) {
        const merged = [INITIAL_USERS[0], ...parsed];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users: UserProfile[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getCurrentUser(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      const defaultUser = INITIAL_USERS[0]; // Master user nti.seinfra by default!
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS[0];
    }
  }

  static setCurrentUser(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  static authenticate(username: string, passwordAttempt: string): { success: boolean; user?: UserProfile; message?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    
    if (!user) {
      return { success: false, message: 'Usuário não localizado no sistema.' };
    }

    if (user.status === 'inativo') {
      return { success: false, message: 'Este usuário está inativo no momento. Contate o administrador.' };
    }

    // Standard credential check
    if (user.password && user.password !== passwordAttempt) {
      return { success: false, message: 'Senha incorreta.' };
    }

    return { success: true, user };
  }

  static getOrders(): ReplenishmentOrder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_REPLENISHMENT_ORDERS));
      return INITIAL_REPLENISHMENT_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_REPLENISHMENT_ORDERS;
    }
  }

  static saveOrders(orders: ReplenishmentOrder[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  static getErpConfig(): ErpConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.ERP_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ERP_CONFIG, JSON.stringify(INITIAL_ERP_CONFIG));
      return INITIAL_ERP_CONFIG;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ERP_CONFIG;
    }
  }

  static saveErpConfig(config: ErpConfig): void {
    localStorage.setItem(STORAGE_KEYS.ERP_CONFIG, JSON.stringify(config));
  }

  static getSystemSettings(): SystemSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(INITIAL_SYSTEM_SETTINGS));
      return INITIAL_SYSTEM_SETTINGS;
    }
    try {
      return { ...INITIAL_SYSTEM_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return INITIAL_SYSTEM_SETTINGS;
    }
  }

  static saveSystemSettings(settings: SystemSettings): void {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(settings));
  }

  static getTermTemplates(): TermTemplate[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TERM_TEMPLATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TERM_TEMPLATES, JSON.stringify(INITIAL_TERM_TEMPLATES));
      return INITIAL_TERM_TEMPLATES;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return INITIAL_TERM_TEMPLATES;
    } catch {
      return INITIAL_TERM_TEMPLATES;
    }
  }

  static saveTermTemplates(templates: TermTemplate[]): void {
    localStorage.setItem(STORAGE_KEYS.TERM_TEMPLATES, JSON.stringify(templates));
  }

  static updateTermTemplate(template: TermTemplate): void {
    const templates = this.getTermTemplates();
    const index = templates.findIndex(t => t.id === template.id);
    if (index >= 0) {
      templates[index] = { ...template, updatedAt: new Date().toISOString() };
    } else {
      templates.push({ ...template, updatedAt: new Date().toISOString() });
    }
    this.saveTermTemplates(templates);
  }

  static getCatalogOptions(): CatalogOptions {
    const raw = localStorage.getItem(STORAGE_KEYS.CATALOG_OPTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATALOG_OPTIONS, JSON.stringify(INITIAL_CATALOG_OPTIONS));
      return INITIAL_CATALOG_OPTIONS;
    }
    try {
      const parsed = JSON.parse(raw);
      // Ensure all arrays exist in case of schema upgrade
      return {
        ...INITIAL_CATALOG_OPTIONS,
        ...parsed,
        equipmentCategories: parsed.equipmentCategories || INITIAL_CATALOG_OPTIONS.equipmentCategories,
        supplyCategories: parsed.supplyCategories || INITIAL_CATALOG_OPTIONS.supplyCategories
      };
    } catch {
      return INITIAL_CATALOG_OPTIONS;
    }
  }

  static saveCatalogOptions(options: CatalogOptions): void {
    localStorage.setItem(STORAGE_KEYS.CATALOG_OPTIONS, JSON.stringify(options));
  }

  static addCatalogOption(field: keyof CatalogOptions, value: string): CatalogOptions {
    const opts = this.getCatalogOptions();
    const clean = value.trim();
    if (!clean) return opts;

    if (field === 'equipmentCategories' || field === 'supplyCategories') {
      return opts;
    }

    const currentArray = (opts[field] as string[]) || [];
    if (!currentArray.includes(clean)) {
      const updated = [clean, ...currentArray];
      const newOpts = { ...opts, [field]: updated };
      this.saveCatalogOptions(newOpts);
      return newOpts;
    }
    return opts;
  }

  static addCategory(category: CategoryDefinition): CatalogOptions {
    const opts = this.getCatalogOptions();
    const field = category.type === 'suprimento' ? 'supplyCategories' : 'equipmentCategories';
    const list = [...opts[field]];
    const exists = list.some(c => c.id === category.id || c.name.toLowerCase() === category.name.toLowerCase());
    if (!exists) {
      list.push(category);
      const newOpts = { ...opts, [field]: list };
      this.saveCatalogOptions(newOpts);
      return newOpts;
    }
    return opts;
  }

  static updateCategory(category: CategoryDefinition): CatalogOptions {
    const opts = this.getCatalogOptions();
    const field = category.type === 'suprimento' ? 'supplyCategories' : 'equipmentCategories';
    const list = opts[field].map(c => c.id === category.id ? { ...c, ...category } : c);
    const newOpts = { ...opts, [field]: list };
    this.saveCatalogOptions(newOpts);
    return newOpts;
  }

  static deleteCategory(categoryId: string, type: 'equipamento' | 'suprimento'): CatalogOptions {
    const opts = this.getCatalogOptions();
    const field = type === 'suprimento' ? 'supplyCategories' : 'equipmentCategories';
    const list = opts[field].filter(c => c.id !== categoryId);
    const newOpts = { ...opts, [field]: list };
    this.saveCatalogOptions(newOpts);
    return newOpts;
  }

  static resetToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(INITIAL_LOANS));
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(INITIAL_MOVEMENTS));
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_REPLENISHMENT_ORDERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.ERP_CONFIG, JSON.stringify(INITIAL_ERP_CONFIG));
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(INITIAL_SYSTEM_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.TERM_TEMPLATES, JSON.stringify(INITIAL_TERM_TEMPLATES));
    localStorage.setItem(STORAGE_KEYS.CATALOG_OPTIONS, JSON.stringify(INITIAL_CATALOG_OPTIONS));
  }

  static getSystemNotifications(): SystemNotification[] {
    const assets = this.getAssets();
    const loans = this.getLoans();
    const notifications: SystemNotification[] = [];
    const now = new Date();

    // 1. Critical stock alerts
    assets.forEach(asset => {
      if (asset.type === 'suprimento' && asset.suppliesInfo) {
        const { currentStock, minStockThreshold, supplierName, suggestedOrderQty, unit } = asset.suppliesInfo;
        if (currentStock <= minStockThreshold) {
          notifications.push({
            id: `notif-stock-${asset.id}`,
            type: 'estoque_critico',
            title: `Reposição Necessária: ${asset.name}`,
            description: `Estoque atual (${currentStock} ${unit}) está abaixo do limite de segurança (${minStockThreshold} ${unit}). Reposição sugerida: ${suggestedOrderQty} ${unit} com ${supplierName}.`,
            severity: currentStock === 0 ? 'alta' : 'media',
            targetId: asset.id,
            targetType: 'supply',
            date: new Date().toISOString().split('T')[0],
            read: false
          });
        }
      }
    });

    // 2. Warranty expiration alerts
    assets.forEach(asset => {
      if (asset.warrantyExpiresAt) {
        const warrantyDate = new Date(asset.warrantyExpiresAt);
        const diffDays = Math.ceil((warrantyDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          notifications.push({
            id: `notif-warr-exp-${asset.id}`,
            type: 'garantia_vencendo',
            title: `Garantia Expirada: ${asset.tag} - ${asset.name}`,
            description: `A garantia expirou em ${new Intl.DateTimeFormat('pt-BR').format(warrantyDate)}. Considere renovação de cobertura ou suporte estendido.`,
            severity: 'media',
            targetId: asset.id,
            targetType: 'asset',
            date: asset.warrantyExpiresAt,
            read: false
          });
        } else if (diffDays <= 30) {
          notifications.push({
            id: `notif-warr-soon-${asset.id}`,
            type: 'garantia_vencendo',
            title: `Garantia Vencendo em ${diffDays} dias: ${asset.tag}`,
            description: `${asset.name} (S/N: ${asset.serialNumber}) tem garantia válida até ${new Intl.DateTimeFormat('pt-BR').format(warrantyDate)}.`,
            severity: 'alta',
            targetId: asset.id,
            targetType: 'asset',
            date: asset.warrantyExpiresAt,
            read: false
          });
        }
      }
    });

    // 3. Rental contracts alerts
    assets.forEach(asset => {
      if (asset.ownership === 'alugado' && asset.rentalInfo?.rentalEndDate) {
        const endDate = new Date(asset.rentalInfo.rentalEndDate);
        const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 30 && diffDays >= 0) {
          notifications.push({
            id: `notif-rent-${asset.id}`,
            type: 'locacao_vencendo',
            title: `Contrato de Locação Vencendo: ${asset.rentalInfo.contractNumber}`,
            description: `O aluguel do item ${asset.name} (${asset.tag}) com ${asset.rentalInfo.rentalCompany} encerra em ${diffDays} dias (${new Intl.DateTimeFormat('pt-BR').format(endDate)}).`,
            severity: 'alta',
            targetId: asset.id,
            targetType: 'asset',
            date: asset.rentalInfo.rentalEndDate,
            read: false
          });
        }
      }
    });

    // 4. Overdue loans alerts
    loans.forEach(loan => {
      if (loan.status === 'atrasado' || (loan.status === 'ativo' && new Date(loan.expectedReturnDate) < now)) {
        notifications.push({
          id: `notif-loan-${loan.id}`,
          type: 'emprestimo_atrasado',
          title: `Cautela Atrasada: ${loan.protocolNumber}`,
          description: `Item ${loan.assetName} com ${loan.borrowerName} (${loan.borrowerDepartment}) tinha devolução prevista para ${new Intl.DateTimeFormat('pt-BR').format(new Date(loan.expectedReturnDate))}.`,
          severity: 'alta',
          targetId: loan.id,
          targetType: 'loan',
          date: loan.expectedReturnDate,
          read: false
        });
      }
    });

    return notifications;
  }
}
