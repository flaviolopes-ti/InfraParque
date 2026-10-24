/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { AssetList } from './components/assets/AssetList';
import { AssetDetailModal } from './components/assets/AssetDetailModal';
import { AssetFormModal } from './components/assets/AssetFormModal';
import { BulkAddModal } from './components/assets/BulkAddModal';
import { LoansManager } from './components/loans/LoansManager';
import { NewLoanModal } from './components/loans/NewLoanModal';
import { ReplenishmentPanel } from './components/replenishment/ReplenishmentPanel';
import { QrScannerModal } from './components/scanner/QrScannerModal';
import { ExcelImportModal } from './components/importExport/ExcelImportModal';
import { ReportsView } from './components/reports/ReportsView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { ErpIntegrationView } from './components/erp/ErpIntegrationView';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { UserManager } from './components/users/UserManager';
import { VisualIdentityModal } from './components/settings/VisualIdentityModal';
import { TermTemplatesModal } from './components/settings/TermTemplatesModal';
import { TransferAssetModal } from './components/assets/TransferAssetModal';
import { CategoryManagerModal } from './components/categories/CategoryManagerModal';
import { applySystemTheme } from './utils/theme';

import { StorageManager } from './utils/storage';
import { 
  Asset, 
  Loan, 
  LoanItem,
  Movement, 
  AuditLog, 
  UserProfile, 
  ReplenishmentOrder, 
  ErpConfig, 
  SystemNotification,
  DroneKitAccessories,
  MultimediaKitItems,
  SystemSettings,
  TermTemplate,
  CatalogOptions,
  AssetType
} from './types';

export default function App() {
  // Main Data States
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [orders, setOrders] = useState<ReplenishmentOrder[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(StorageManager.getCurrentUser());
  const [erpConfig, setErpConfig] = useState<ErpConfig>(StorageManager.getErpConfig());
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(StorageManager.getSystemSettings());
  const [termTemplates, setTermTemplates] = useState<TermTemplate[]>(StorageManager.getTermTemplates());
  const [catalogOptions, setCatalogOptions] = useState<CatalogOptions>(StorageManager.getCatalogOptions());

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals States
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
  const [isAssetFormOpen, setIsAssetFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [preSelectedLoanAsset, setPreSelectedLoanAsset] = useState<Asset | null>(null);
  const [preSelectedLoanAssets, setPreSelectedLoanAssets] = useState<Asset[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isVisualIdentityOpen, setIsVisualIdentityOpen] = useState(false);
  const [isTermTemplatesOpen, setIsTermTemplatesOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [transferingAssets, setTransferingAssets] = useState<Asset[]>([]);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Initial Load & Sync
  const reloadFromStorage = () => {
    const loadedAssets = StorageManager.getAssets();
    const loadedLoans = StorageManager.getLoans();
    const loadedMovements = StorageManager.getMovements();
    const loadedLogs = StorageManager.getAuditLogs();
    const loadedOrders = StorageManager.getOrders();
    const loadedUsers = StorageManager.getUsers();
    const loadedUser = StorageManager.getCurrentUser();
    const loadedErp = StorageManager.getErpConfig();
    const loadedNotifs = StorageManager.getSystemNotifications();
    const loadedSettings = StorageManager.getSystemSettings();
    const loadedTemplates = StorageManager.getTermTemplates();
    const loadedCatalog = StorageManager.getCatalogOptions();

    setAssets(loadedAssets);
    setLoans(loadedLoans);
    setMovements(loadedMovements);
    setAuditLogs(loadedLogs);
    setOrders(loadedOrders);
    setUsers(loadedUsers);
    setCurrentUser(loadedUser);
    setErpConfig(loadedErp);
    setNotifications(loadedNotifs);
    setSystemSettings(loadedSettings);
    setTermTemplates(loadedTemplates);
    setCatalogOptions(loadedCatalog);
    applySystemTheme(loadedSettings);
    document.title = `${loadedSettings.systemName} - ${loadedSettings.companyName}`;
  };

  useEffect(() => {
    reloadFromStorage();
  }, []);

  const handleSaveSystemSettings = (newSettings: SystemSettings) => {
    setSystemSettings(newSettings);
    StorageManager.saveSystemSettings(newSettings);
    applySystemTheme(newSettings);
    StorageManager.logAudit(
      currentUser,
      'CONFIG_SISTEMA_LOGOS',
      'Config',
      'branding',
      `Identidade visual e paleta de cores atualizada: ${newSettings.companyName} / ${newSettings.systemName}`
    );
    setAuditLogs(StorageManager.getAuditLogs());
    document.title = `${newSettings.systemName} - ${newSettings.companyName}`;
  };

  const handleSaveTermTemplate = (template: TermTemplate) => {
    StorageManager.updateTermTemplate(template);
    setTermTemplates(StorageManager.getTermTemplates());
    StorageManager.logAudit(
      currentUser,
      'ATUALIZA_VERSAO_TERMO',
      'System',
      template.id,
      `Modelo de termo atualizado: ${template.title} (${template.version})`
    );
    setAuditLogs(StorageManager.getAuditLogs());
  };

  const handleSetCurrentUser = (user: UserProfile) => {
    setCurrentUser(user);
    StorageManager.setCurrentUser(user);
    StorageManager.logAudit(
      user,
      'TROCA_PERFIL_RBAC',
      'System',
      user.id,
      `Perfil ativo alterado para ${user.name} (@${user.username}) - ${user.role.toUpperCase()}`
    );
    setAuditLogs(StorageManager.getAuditLogs());
  };

  const handleResetData = () => {
    if (confirm('Deseja reiniciar a base com os dados iniciais de demonstração (incluindo usuário nti.seinfra)?')) {
      StorageManager.resetToDefault();
      reloadFromStorage();
    }
  };

  // --- USER MANAGEMENT OPERATIONS ---
  const handleSaveUser = (userData: Partial<UserProfile>) => {
    let updatedUsers: UserProfile[];
    const isEditing = !!userData.id;

    if (isEditing) {
      updatedUsers = users.map(u => u.id === userData.id ? ({ ...u, ...userData } as UserProfile) : u);
      StorageManager.logAudit(
        currentUser,
        'EDICAO_USUARIO',
        'User',
        userData.id!,
        `Usuário @${userData.username} (${userData.name}) foi atualizado`,
        userData
      );
      // If editing current user, update session
      if (currentUser.id === userData.id) {
        const updatedSelf = { ...currentUser, ...userData } as UserProfile;
        setCurrentUser(updatedSelf);
        StorageManager.setCurrentUser(updatedSelf);
      }
    } else {
      const newUser: UserProfile = {
        ...userData,
        id: `user_${Date.now().toString(36)}`,
        status: userData.status || 'ativo',
        createdAt: new Date().toISOString()
      } as UserProfile;

      updatedUsers = [...users, newUser];

      StorageManager.logAudit(
        currentUser,
        'CRIACAO_USUARIO',
        'User',
        newUser.id,
        `Novo usuário criado: @${newUser.username} (${newUser.name}) com perfil ${newUser.role.toUpperCase()}`
      );
    }

    StorageManager.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setAuditLogs(StorageManager.getAuditLogs());
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    if (target.username === 'nti.seinfra') {
      alert('O usuário padrão nti.seinfra é protegido e não pode ser excluído.');
      return;
    }

    const remaining = users.filter(u => u.id !== userId);
    StorageManager.saveUsers(remaining);
    setUsers(remaining);

    StorageManager.logAudit(
      currentUser,
      'EXCLUSAO_USUARIO',
      'User',
      userId,
      `Usuário @${target.username} (${target.name}) foi removido do sistema`
    );

    setAuditLogs(StorageManager.getAuditLogs());
  };

  // --- ASSET OPERATIONS ---
  const handleSaveAsset = (assetData: Partial<Asset>) => {
    let updatedAssets: Asset[];
    const isEditing = !!assetData.id;

    if (isEditing) {
      updatedAssets = assets.map(a => a.id === assetData.id ? ({ ...a, ...assetData, updatedAt: new Date().toISOString() } as Asset) : a);
      StorageManager.logAudit(
        currentUser,
        'EDICAO_ATIVO',
        'Asset',
        assetData.id!,
        `Ativo ${assetData.tag} (${assetData.name}) foi atualizado`,
        assetData
      );
    } else {
      const newAsset: Asset = {
        ...assetData,
        id: `ast-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Asset;

      updatedAssets = [newAsset, ...assets];

      // Register Entry Movement
      const newMov: Movement = {
        id: `mov-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'entrada',
        assetId: newAsset.id,
        assetTag: newAsset.tag,
        assetName: newAsset.name,
        quantity: newAsset.type === 'suprimento' ? (newAsset.suppliesInfo?.currentStock || 1) : 1,
        destination: newAsset.location.room,
        responsibleName: currentUser.name,
        reason: 'Cadastro inicial de bem no parque tecnológico'
      };

      const updatedMovs = [newMov, ...movements];
      StorageManager.saveMovements(updatedMovs);
      setMovements(updatedMovs);

      StorageManager.logAudit(
        currentUser,
        'NOVO_CADASTRO_ATIVO',
        'Asset',
        newAsset.id,
        `Novo ativo cadastrado: ${newAsset.tag} - ${newAsset.name} (Regime: ${newAsset.ownership})`,
        newAsset
      );
    }

    StorageManager.saveAssets(updatedAssets);
    setAssets(updatedAssets);
    setNotifications(StorageManager.getSystemNotifications());
    setAuditLogs(StorageManager.getAuditLogs());
  };

  const handleBulkAdd = (bulkItems: Partial<Asset>[]) => {
    const fullAssets: Asset[] = bulkItems.map((item, idx) => ({
      ...item,
      id: `ast-blk-${Date.now()}-${idx}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Asset));

    const updated = [...fullAssets, ...assets];
    StorageManager.saveAssets(updated);
    setAssets(updated);

    // Register movement
    const newMov: Movement = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'entrada',
      assetId: fullAssets[0].id,
      assetTag: `${fullAssets[0].tag} a ${fullAssets[fullAssets.length - 1].tag}`,
      assetName: `Lote de ${fullAssets.length}x ${fullAssets[0].name}`,
      quantity: fullAssets.length,
      destination: fullAssets[0].location.room,
      responsibleName: currentUser.name,
      reason: 'Carga em lote de equipamentos novos'
    };

    const updatedMovs = [newMov, ...movements];
    StorageManager.saveMovements(updatedMovs);
    setMovements(updatedMovs);

    StorageManager.logAudit(
      currentUser,
      'CADASTRO_EM_LOTE',
      'Asset',
      `LOTE-${fullAssets.length}`,
      `Cadastro em lote de ${fullAssets.length} equipamentos (${fullAssets[0].tag} a ${fullAssets[fullAssets.length - 1].tag})`
    );

    setAuditLogs(StorageManager.getAuditLogs());
    setNotifications(StorageManager.getSystemNotifications());
  };

  const handleDeleteAsset = (assetId: string) => {
    const target = assets.find(a => a.id === assetId);
    if (!target) return;

    const remaining = assets.filter(a => a.id !== assetId);
    StorageManager.saveAssets(remaining);
    setAssets(remaining);

    // Register movement
    const newMov: Movement = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'baixa',
      assetId: target.id,
      assetTag: target.tag,
      assetName: target.name,
      quantity: 1,
      responsibleName: currentUser.name,
      reason: 'Baixa patrimonial / Descarte definitivo'
    };
    const updatedMovs = [newMov, ...movements];
    StorageManager.saveMovements(updatedMovs);
    setMovements(updatedMovs);

    StorageManager.logAudit(
      currentUser,
      'BAIXA_ATIVO',
      'Asset',
      target.id,
      `Baixa patrimonial do item ${target.tag} (${target.name})`
    );

    setAuditLogs(StorageManager.getAuditLogs());
    setNotifications(StorageManager.getSystemNotifications());
  };

  // --- CATALOG & CATEGORY OPTIONS ---
  const handleAddNewCatalogOption = (field: keyof CatalogOptions, value: string) => {
    const updated = StorageManager.addCatalogOption(field, value);
    setCatalogOptions(updated);
  };

  const handleAddNewCategory = (categoryName: string, catType: AssetType) => {
    const newCat = {
      id: `cat_${Date.now()}`,
      name: categoryName.trim(),
      type: catType,
      description: 'Categoria adicionada no cadastro',
      isSystem: false
    };
    const updated = StorageManager.addCategory(newCat);
    setCatalogOptions(updated);
    StorageManager.logAudit(
      currentUser,
      'CRIACAO_CATEGORIA',
      'Config',
      newCat.id,
      `Nova categoria criada: ${newCat.name} (${catType})`
    );
    setAuditLogs(StorageManager.getAuditLogs());
  };

  const handleSaveCatalogOptions = (newOpts: CatalogOptions) => {
    StorageManager.saveCatalogOptions(newOpts);
    setCatalogOptions(newOpts);
    StorageManager.logAudit(
      currentUser,
      'ATUALIZACAO_CATALOGO_LISTAS',
      'Config',
      'catalog',
      'Catálogo de categorias e listas suspensas atualizado'
    );
    setAuditLogs(StorageManager.getAuditLogs());
  };

  // --- ASSET LOCATION TRANSFER (Prédio, Andar, Sala, Departamento) ---
  const handleStartTransfer = (asset: Asset) => {
    setTransferingAssets([asset]);
    setIsTransferModalOpen(true);
  };

  const handleStartMultiTransfer = (selectedList: Asset[]) => {
    if (selectedList.length === 0) return;
    setTransferingAssets(selectedList);
    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = (
    assetIds: string[],
    newLocation: { building: string; floor: string; room: string; department: string },
    reason: string
  ) => {
    const updatedAssets = assets.map(a => {
      if (assetIds.includes(a.id)) {
        return { ...a, location: newLocation, updatedAt: new Date().toISOString() };
      }
      return a;
    });

    StorageManager.saveAssets(updatedAssets);
    setAssets(updatedAssets);

    // Register movement for each asset
    const newMovements: Movement[] = assetIds.map((id, idx) => {
      const originalAsset = assets.find(a => a.id === id);
      const originStr = originalAsset
        ? `${originalAsset.location.building} · ${originalAsset.location.floor} · ${originalAsset.location.room} (${originalAsset.location.department})`
        : 'Local Anterior';
      const destStr = `${newLocation.building} · ${newLocation.floor} · ${newLocation.room} (${newLocation.department})`;

      return {
        id: `mov-trans-${Date.now()}-${idx}`,
        timestamp: new Date().toISOString(),
        type: 'transferencia',
        assetId: id,
        assetTag: originalAsset?.tag || 'TAG',
        assetName: originalAsset?.name || 'Equipamento',
        quantity: 1,
        origin: originStr,
        destination: destStr,
        responsibleName: currentUser.name,
        reason,
        referenceDoc: `TRANS-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`
      };
    });

    const allMovements = [...newMovements, ...movements];
    StorageManager.saveMovements(allMovements);
    setMovements(allMovements);

    StorageManager.logAudit(
      currentUser,
      'TRANSFERENCIA_LOCALIZACAO',
      'Asset',
      assetIds.join(','),
      `Transferência de ${assetIds.length} equipamento(s) para ${newLocation.building} · ${newLocation.room} (${newLocation.department}). Motivo: ${reason}`
    );

    // Ensure new locations are in catalog
    StorageManager.addCatalogOption('buildings', newLocation.building);
    StorageManager.addCatalogOption('floors', newLocation.floor);
    StorageManager.addCatalogOption('rooms', newLocation.room);
    StorageManager.addCatalogOption('departments', newLocation.department);
    setCatalogOptions(StorageManager.getCatalogOptions());

    setAuditLogs(StorageManager.getAuditLogs());
    setNotifications(StorageManager.getSystemNotifications());

    if (selectedAssetForDetail && assetIds.includes(selectedAssetForDetail.id)) {
      setSelectedAssetForDetail({
        ...selectedAssetForDetail,
        location: newLocation
      });
    }
  };

  // --- LOAN OPERATIONS ---
  const handleStartLoanFromAsset = (asset: Asset) => {
    setPreSelectedLoanAsset(asset);
    setPreSelectedLoanAssets([asset]);
    setIsNewLoanOpen(true);
  };

  const handleStartMultiLoan = (selectedList: Asset[]) => {
    if (selectedList.length === 0) return;
    setPreSelectedLoanAssets(selectedList);
    setPreSelectedLoanAsset(selectedList[0] || null);
    setIsNewLoanOpen(true);
  };

  const handleCreateLoan = (loanData: {
    termType: 'geral' | 'rpas_drone' | 'multimidia';
    assetId: string;
    assetIds?: string[];
    items?: LoanItem[];
    borrowerName: string;
    borrowerEmail: string;
    borrowerDepartment: string;
    borrowerDoc: string;
    borrowerRole?: string;
    pilotLicenseDoc?: string;
    missionPurpose?: string;
    missionLocation?: string;
    expectedReturnDate: string;
    conditionOnLoan: string;
    notes?: string;
    droneKit?: DroneKitAccessories;
    multimediaKit?: MultimediaKitItems;
  }) => {
    const asset = assets.find(a => a.id === loanData.assetId);
    if (!asset) return;

    const allAssetIds = loanData.assetIds && loanData.assetIds.length > 0 
      ? loanData.assetIds 
      : [asset.id];

    const prefix = loanData.termType === 'rpas_drone' ? 'RPAS-2026-' : 'EMP-2026-';
    const protocol = `${prefix}${(loans.length + 1).toString().padStart(4, '0')}`;

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      protocolNumber: protocol,
      termType: loanData.termType,
      assetId: asset.id,
      assetTag: asset.tag,
      assetName: asset.name,
      assetModel: asset.model,
      assetSerial: asset.serialNumber,
      items: loanData.items,
      borrowerName: loanData.borrowerName,
      borrowerEmail: loanData.borrowerEmail,
      borrowerDepartment: loanData.borrowerDepartment,
      borrowerDoc: loanData.borrowerDoc,
      borrowerRole: loanData.borrowerRole,
      pilotLicenseDoc: loanData.pilotLicenseDoc,
      missionPurpose: loanData.missionPurpose,
      missionLocation: loanData.missionLocation,
      loanDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: loanData.expectedReturnDate,
      status: 'ativo',
      conditionOnLoan: loanData.conditionOnLoan,
      operatorName: currentUser.name,
      operatorId: currentUser.id,
      notes: loanData.notes,
      cautionTermSigned: true,
      cautionTermHash: `SHA256:${Math.random().toString(36).substring(2, 12)}${Date.now()}`,
      droneKit: loanData.droneKit,
      multimediaKit: loanData.multimediaKit
    };

    const updatedLoans = [newLoan, ...loans];
    StorageManager.saveLoans(updatedLoans);
    setLoans(updatedLoans);

    // Update ALL included Assets status to 'emprestado'
    const updatedAssets = assets.map(a => allAssetIds.includes(a.id) ? { ...a, status: 'emprestado' as const } : a);
    StorageManager.saveAssets(updatedAssets);
    setAssets(updatedAssets);

    // Register movement for each asset in the loan
    const newMovements: Movement[] = allAssetIds.map((aid, idx) => {
      const itm = assets.find(a => a.id === aid) || asset;
      return {
        id: `mov-${Date.now()}-${idx}`,
        timestamp: new Date().toISOString(),
        type: 'emprestimo',
        assetId: itm.id,
        assetTag: itm.tag,
        assetName: itm.name,
        quantity: 1,
        origin: itm.location.room,
        destination: `${loanData.borrowerName} (${loanData.borrowerDepartment})`,
        responsibleName: currentUser.name,
        reason: loanData.termType === 'rpas_drone' ? 'Missão de voo e vistoria com drone' : 'Saída sob cautela temporária',
        referenceDoc: protocol
      };
    });

    const updatedMovs = [...newMovements, ...movements];
    StorageManager.saveMovements(updatedMovs);
    setMovements(updatedMovs);

    StorageManager.logAudit(
      currentUser,
      loanData.termType === 'rpas_drone' ? 'EMISSAO_CAUTELA_RPAS' : 'EMISSAO_EMPRESTIMO',
      'Loan',
      newLoan.id,
      `Cautela ${protocol} emitida para ${loanData.borrowerName} (${loanData.borrowerDepartment}). ${allAssetIds.length} equipamento(s).`
    );

    setAuditLogs(StorageManager.getAuditLogs());
    setNotifications(StorageManager.getSystemNotifications());
  };

  const handleReturnLoan = (loanId: string, returnCondition: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const returnAssetIds = loan.items && loan.items.length > 0 
      ? loan.items.map(i => i.assetId)
      : [loan.assetId];

    const updatedLoans = loans.map(l => l.id === loanId ? {
      ...l,
      status: 'devolvido' as const,
      actualReturnDate: new Date().toISOString().split('T')[0],
      conditionOnReturn: returnCondition
    } : l);

    StorageManager.saveLoans(updatedLoans);
    setLoans(updatedLoans);

    // Restock / restore asset status to 'disponivel' for all items
    const updatedAssets = assets.map(a => returnAssetIds.includes(a.id) ? { ...a, status: 'disponivel' as const } : a);
    StorageManager.saveAssets(updatedAssets);
    setAssets(updatedAssets);

    // Register movement for each returned item
    const newMovements: Movement[] = returnAssetIds.map((aid, idx) => {
      const itm = assets.find(a => a.id === aid);
      return {
        id: `mov-${Date.now()}-${idx}`,
        timestamp: new Date().toISOString(),
        type: 'devolucao',
        assetId: aid,
        assetTag: itm?.tag || loan.assetTag,
        assetName: itm?.name || loan.assetName,
        quantity: 1,
        origin: `${loan.borrowerName} (${loan.borrowerDepartment})`,
        destination: 'Almoxarifado TI / Especial RPAS',
        responsibleName: currentUser.name,
        reason: 'Devolução de bem com termo cumprido e verificado',
        referenceDoc: loan.protocolNumber
      };
    });

    const updatedMovs = [...newMovements, ...movements];
    StorageManager.saveMovements(updatedMovs);
    setMovements(updatedMovs);

    StorageManager.logAudit(
      currentUser,
      'DEVOLUCAO_EMPRESTIMO',
      'Loan',
      loan.id,
      `Devolução confirmada do protocolo ${loan.protocolNumber} (${returnAssetIds.length} equipamentos) por ${loan.borrowerName}`
    );

    setAuditLogs(StorageManager.getAuditLogs());
    setNotifications(StorageManager.getSystemNotifications());
  };

  // --- REPLENISHMENT & SUPPLIES OPERATIONS ---
  const handleUpdateStock = (assetId: string, newStock: number, reason: string) => {
    const target = assets.find(a => a.id === assetId);
    if (!target || !target.suppliesInfo) return;

    const oldStock = target.suppliesInfo.currentStock;
    const diff = newStock - oldStock;

    const updatedAssets = assets.map(a => {
      if (a.id === assetId && a.suppliesInfo) {
        return {
          ...a,
          suppliesInfo: {
            ...a.suppliesInfo,
            currentStock: newStock
          }
        };
      }
      return a;
    });

    StorageManager.saveAssets(updatedAssets);
    setAssets(updatedAssets);

    // If stock dropped below or equal to minStockThreshold, automatically spawn a purchase order!
    if (newStock <= target.suppliesInfo.minStockThreshold && target.suppliesInfo.autoReplenish) {
      const orderNumber = `ORD-2026-${(orders.length + 1).toString().padStart(4, '0')}`;
      const newOrder: ReplenishmentOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        assetId: target.id,
        itemName: target.name,
        category: target.category,
        supplierName: target.suppliesInfo.supplierName,
        quantity: target.suppliesInfo.suggestedOrderQty,
        unit: target.suppliesInfo.unit,
        estimatedCost: target.suppliesInfo.suggestedOrderQty * target.suppliesInfo.unitCost,
        status: 'sugerido',
        createdAt: new Date().toISOString(),
        autoGenerated: true
      };

      const updatedOrders = [newOrder, ...orders];
      StorageManager.saveOrders(updatedOrders);
      setOrders(updatedOrders);

      StorageManager.logAudit(
        currentUser,
        'DISPARO_REPOSICAO_AUTOMATICA',
        'Supply',
        target.id,
        `Gatilho automático: estoque de ${target.name} atingiu ${newStock} ${target.suppliesInfo.unit} (Mínimo: ${target.suppliesInfo.minStockThreshold}). Ordem ${orderNumber} criada.`
      );
    }

    // Register movement if changed
    if (diff !== 0) {
      const newMov: Movement = {
        id: `mov-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: diff > 0 ? 'entrada' : 'saida',
        assetId: target.id,
        assetTag: target.tag,
        assetName: target.name,
        quantity: Math.abs(diff),
        responsibleName: currentUser.name,
        reason
      };
      const updatedMovs = [newMov, ...movements];
      StorageManager.saveMovements(updatedMovs);
      setMovements(updatedMovs);
    }

    StorageManager.logAudit(
      currentUser,
      'AJUSTE_ESTOQUE_SUPRIMENTO',
      'Supply',
      target.id,
      `Ajuste de estoque do item ${target.tag}: de ${oldStock} para ${newStock} ${target.suppliesInfo.unit} (${reason})`
    );

    setAuditLogs(StorageManager.getAuditLogs());
    setNotifications(StorageManager.getSystemNotifications());
  };

  const handleApproveOrder = (orderId: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: 'enviado_erp' as const } : o);
    StorageManager.saveOrders(updated);
    setOrders(updated);

    const targetOrder = orders.find(o => o.id === orderId);
    StorageManager.logAudit(
      currentUser,
      'APROVACAO_ORDEM_COMPRA',
      'Supply',
      orderId,
      `Ordem ${targetOrder?.orderNumber} aprovada e transmitida para o ${erpConfig.systemType}`
    );
    setAuditLogs(StorageManager.getAuditLogs());
  };

  const handleReceiveOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Increment stock in asset
    const targetAsset = assets.find(a => a.id === order.assetId);
    if (targetAsset && targetAsset.suppliesInfo) {
      const updatedStock = targetAsset.suppliesInfo.currentStock + order.quantity;
      const updatedAssets = assets.map(a => a.id === order.assetId ? {
        ...a,
        suppliesInfo: {
          ...a.suppliesInfo!,
          currentStock: updatedStock,
          lastRestockDate: new Date().toISOString().split('T')[0]
        }
      } : a);

      StorageManager.saveAssets(updatedAssets);
      setAssets(updatedAssets);
    }

    // Mark order delivered
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: 'entregue' as const } : o);
    StorageManager.saveOrders(updatedOrders);
    setOrders(updatedOrders);

    // Register movement
    const newMov: Movement = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'reposicao_automatica',
      assetId: order.assetId,
      assetTag: targetAsset?.tag || 'SUP',
      assetName: order.itemName,
      quantity: order.quantity,
      origin: order.supplierName,
      destination: 'Almoxarifado TI',
      responsibleName: currentUser.name,
      reason: `Recebimento da ordem de reposição ${order.orderNumber}`,
      financialImpact: order.estimatedCost
    };
    const updatedMovs = [newMov, ...movements];
    StorageManager.saveMovements(updatedMovs);
    setMovements(updatedMovs);

    StorageManager.logAudit(
      currentUser,
      'RECEBIMENTO_ESTOQUE_ORDEM',
      'Supply',
      order.id,
      `Recebimento de ${order.quantity} ${order.unit} de ${order.itemName} ref. Ordem ${order.orderNumber}`
    );

    setAuditLogs(StorageManager.getAuditLogs());
    setNotifications(StorageManager.getSystemNotifications());
  };

  const handleTriggerManualReplenish = (supply: Asset) => {
    if (!supply.suppliesInfo) return;
    const orderNumber = `ORD-2026-${(orders.length + 1).toString().padStart(4, '0')}`;
    const newOrder: ReplenishmentOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      assetId: supply.id,
      itemName: supply.name,
      category: supply.category,
      supplierName: supply.suppliesInfo.supplierName,
      quantity: supply.suppliesInfo.suggestedOrderQty,
      unit: supply.suppliesInfo.unit,
      estimatedCost: supply.suppliesInfo.suggestedOrderQty * supply.suppliesInfo.unitCost,
      status: 'sugerido',
      createdAt: new Date().toISOString(),
      autoGenerated: false
    };

    const updated = [newOrder, ...orders];
    StorageManager.saveOrders(updated);
    setOrders(updated);

    StorageManager.logAudit(
      currentUser,
      'CRIACAO_MANUAL_ORDEM_REPOSICAO',
      'Supply',
      supply.id,
      `Ordem manual ${orderNumber} criada para ${supply.name} (${supply.suppliesInfo.suggestedOrderQty} ${supply.suppliesInfo.unit})`
    );
    setAuditLogs(StorageManager.getAuditLogs());
  };

  // --- EXCEL IMPORT ---
  const handleImportSuccess = (imported: Asset[]) => {
    const updated = [...imported, ...assets];
    StorageManager.saveAssets(updated);
    setAssets(updated);

    // Register movement
    const newMov: Movement = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'entrada',
      assetId: imported[0].id,
      assetTag: `${imported[0].tag}...`,
      assetName: `Carga de Planilha Excel (${imported.length} itens)`,
      quantity: imported.length,
      destination: 'Almoxarifado Central',
      responsibleName: currentUser.name,
      reason: 'Importação direta de planilha de parque tecnológico'
    };
    const updatedMovs = [newMov, ...movements];
    StorageManager.saveMovements(updatedMovs);
    setMovements(updatedMovs);

    StorageManager.logAudit(
      currentUser,
      'IMPORTACAO_PLANILHA_EXCEL',
      'Import',
      `IMP-${imported.length}`,
      `Importação em lote de ${imported.length} itens a partir de arquivo de planilha`
    );

    setAuditLogs(StorageManager.getAuditLogs());
    setNotifications(StorageManager.getSystemNotifications());
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={handleSetCurrentUser}
        systemSettings={systemSettings}
        notificationCount={notifications.length}
        openNotifications={() => setIsNotificationDrawerOpen(true)}
        openScanner={() => setIsScannerOpen(true)}
        availableUsers={users}
        onOpenVisualIdentity={() => setIsVisualIdentityOpen(true)}
        onOpenTermTemplates={() => setIsTermTemplatesOpen(true)}
        onOpenCategories={() => setIsCategoryManagerOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          currentUser={currentUser}
          systemSettings={systemSettings}
          notificationCount={notifications.length}
          openNotifications={() => setIsNotificationDrawerOpen(true)}
          openScanner={() => setIsScannerOpen(true)}
          onOpenNewAsset={() => {
            setEditingAsset(null);
            setIsAssetFormOpen(true);
          }}
          onOpenNewLoan={() => {
            setPreSelectedLoanAsset(null);
            setPreSelectedLoanAssets([]);
            setIsNewLoanOpen(true);
          }}
          onRefreshData={reloadFromStorage}
          onResetData={handleResetData}
          onOpenUsers={() => setActiveTab('users')}
          onOpenVisualIdentity={() => setIsVisualIdentityOpen(true)}
          onOpenTermTemplates={() => setIsTermTemplatesOpen(true)}
          onOpenCategories={() => setIsCategoryManagerOpen(true)}
        />

        {/* Dynamic Content Body */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'dashboard' && (
            <OverviewDashboard
              assets={assets}
              loans={loans}
              movements={movements}
              orders={orders}
              notifications={notifications}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'assets' && (
            <AssetList
              assets={assets}
              currentUser={currentUser}
              onSelectAsset={(asset) => setSelectedAssetForDetail(asset)}
              onOpenNewAsset={() => {
                setEditingAsset(null);
                setIsAssetFormOpen(true);
              }}
              onOpenBulkAdd={() => setIsBulkAddOpen(true)}
              onStartLoan={handleStartLoanFromAsset}
              onStartMultiLoan={handleStartMultiLoan}
              onStartTransfer={handleStartTransfer}
              onStartMultiTransfer={handleStartMultiTransfer}
              onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
              onDeleteAsset={handleDeleteAsset}
              onOpenImport={() => setIsImportOpen(true)}
            />
          )}

          {activeTab === 'loans' && (
            <LoansManager
              loans={loans}
              assets={assets}
              currentUser={currentUser}
              systemSettings={systemSettings}
              termTemplates={termTemplates}
              onOpenNewLoan={() => {
                setPreSelectedLoanAsset(null);
                setPreSelectedLoanAssets([]);
                setIsNewLoanOpen(true);
              }}
              onReturnLoan={handleReturnLoan}
              onOpenTermTemplates={() => setIsTermTemplatesOpen(true)}
              onOpenVisualIdentity={() => setIsVisualIdentityOpen(true)}
            />
          )}

          {activeTab === 'replenishment' && (
            <ReplenishmentPanel
              assets={assets}
              orders={orders}
              currentUser={currentUser}
              onUpdateStock={handleUpdateStock}
              onApproveOrder={handleApproveOrder}
              onReceiveOrder={handleReceiveOrder}
              onTriggerManualReplenish={handleTriggerManualReplenish}
            />
          )}

          {activeTab === 'scanner' && (
            <div className="p-6 max-w-4xl mx-auto space-y-4">
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 text-cyan-400 mx-auto flex items-center justify-center">
                  <span className="font-bold text-xl">QR</span>
                </div>
                <h3 className="text-base font-bold text-white">Leitor em Tempo Real de Ativos, Drones & Suprimentos</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Aponte a câmera do dispositivo móvel ou utilize a pistola óptica USB para ler instantaneamente números de série, etiquetas de patrimônio, cases de RPAS e realizar empréstimos ou devoluções em 1 toque.
                </p>
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
                >
                  Abrir Scanner em Tela Cheia
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="p-6 max-w-4xl mx-auto space-y-4">
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <span className="font-bold text-xl">XLS</span>
                </div>
                <h3 className="text-base font-bold text-white">Carga e Importação de Planilha Excel</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Importe planilhas existentes (.xlsx, .xls ou .csv) contendo equipamentos próprios, locados, drones e suprimentos. O sistema valida dados, detecta duplicados e gera log de auditoria automático.
                </p>
                <button
                  onClick={() => setIsImportOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
                >
                  Iniciar Assistente de Importação
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <ReportsView
              assets={assets}
              movements={movements}
              loans={loans}
              auditLogs={auditLogs}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'erp' && (
            <ErpIntegrationView
              erpConfig={erpConfig}
              onSaveConfig={(cfg) => {
                setErpConfig(cfg);
                StorageManager.saveErpConfig(cfg);
              }}
              currentUser={currentUser}
              assets={assets}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogsView
              logs={auditLogs}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'users' && (
            <UserManager
              users={users}
              currentUser={currentUser}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
              onSwitchUser={handleSetCurrentUser}
            />
          )}
        </main>
      </div>

      {/* --- MODALS & FLYOUTS --- */}
      
      {/* Asset Detail & Printable Label Modal */}
      <AssetDetailModal
        asset={selectedAssetForDetail}
        onClose={() => setSelectedAssetForDetail(null)}
        currentUser={currentUser}
        onStartLoan={handleStartLoanFromAsset}
        onStartTransfer={handleStartTransfer}
        movements={movements}
      />

      {/* Asset Form Modal (Add / Edit) with Searchable Comboboxes & Catalog */}
      <AssetFormModal
        isOpen={isAssetFormOpen}
        initialData={editingAsset}
        onClose={() => {
          setIsAssetFormOpen(false);
          setEditingAsset(null);
        }}
        onSave={handleSaveAsset}
        catalogOptions={catalogOptions}
        onAddNewOption={handleAddNewCatalogOption}
        onAddNewCategory={handleAddNewCategory}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
      />

      {/* Bulk Add Wizard Modal */}
      <BulkAddModal
        isOpen={isBulkAddOpen}
        onClose={() => setIsBulkAddOpen(false)}
        onBulkAdd={handleBulkAdd}
      />

      {/* New Loan Checkout Modal */}
      <NewLoanModal
        isOpen={isNewLoanOpen}
        onClose={() => {
          setIsNewLoanOpen(false);
          setPreSelectedLoanAsset(null);
          setPreSelectedLoanAssets([]);
        }}
        availableAssets={assets.filter(a => a.status === 'disponivel')}
        selectedAssetInitial={preSelectedLoanAsset}
        selectedAssetsInitial={preSelectedLoanAssets}
        currentUser={currentUser}
        onCreateLoan={handleCreateLoan}
      />

      {/* Real-time QR / Barcode Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        assets={assets}
        onSelectAsset={(asset) => setSelectedAssetForDetail(asset)}
        onStartLoan={handleStartLoanFromAsset}
        currentUser={currentUser}
      />

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={handleImportSuccess}
        currentUser={currentUser}
      />

      {/* Equipment Location Transfer Modal (Prédio, Andar, Sala, Depto) */}
      <TransferAssetModal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setTransferingAssets([]);
        }}
        targetAssets={transferingAssets}
        catalogOptions={catalogOptions}
        onAddNewOption={handleAddNewCatalogOption}
        onTransfer={handleConfirmTransfer}
      />

      {/* Categories & Dropdowns Catalog Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        catalogOptions={catalogOptions}
        onSaveCatalogOptions={handleSaveCatalogOptions}
      />

      {/* Central Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onNavigateToItem={(type, targetId) => {
          if (type === 'supply') {
            setActiveTab('replenishment');
          } else if (type === 'loan') {
            setActiveTab('loans');
          } else {
            setActiveTab('assets');
            if (targetId) {
              const matched = assets.find(a => a.id === targetId);
              if (matched) setSelectedAssetForDetail(matched);
            }
          }
        }}
        onClearNotifications={() => {}}
      />

      {/* Separate Visual Identity & Color Schemes Modal */}
      <VisualIdentityModal
        isOpen={isVisualIdentityOpen}
        onClose={() => setIsVisualIdentityOpen(false)}
        settings={systemSettings}
        onSaveSettings={handleSaveSystemSettings}
      />

      {/* Separate Official Caution Terms & Dynamic Clauses Modal */}
      <TermTemplatesModal
        isOpen={isTermTemplatesOpen}
        onClose={() => setIsTermTemplatesOpen(false)}
        termTemplates={termTemplates}
        onSaveTermTemplate={handleSaveTermTemplate}
      />

    </div>
  );
}
