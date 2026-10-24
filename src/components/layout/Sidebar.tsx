import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  ArrowLeftRight, 
  Boxes, 
  QrCode, 
  FileSpreadsheet, 
  FileText, 
  Network, 
  ShieldCheck, 
  Building2, 
  RefreshCw,
  UserCheck,
  Users,
  Lock,
  SlidersHorizontal,
  Palette
} from 'lucide-react';
import { UserProfile, UserRole, SystemSettings } from '../../types';

export type ActiveTab = 
  | 'dashboard' 
  | 'assets' 
  | 'loans' 
  | 'replenishment' 
  | 'scanner' 
  | 'import' 
  | 'reports' 
  | 'erp' 
  | 'audit'
  | 'users';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  systemSettings: SystemSettings;
  notificationCount: number;
  openNotifications: () => void;
  openScanner: () => void;
  availableUsers: UserProfile[];
  onOpenVisualIdentity?: () => void;
  onOpenTermTemplates?: () => void;
  onOpenCategories?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  systemSettings,
  notificationCount,
  openNotifications,
  openScanner,
  availableUsers,
  onOpenVisualIdentity,
  onOpenTermTemplates,
  onOpenCategories
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Painel Central',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'assets' as ActiveTab,
      label: 'Inventário de Ativos',
      icon: Layers,
      badge: null
    },
    {
      id: 'loans' as ActiveTab,
      label: 'Empréstimos & RPAS',
      icon: ArrowLeftRight,
      badge: 'Drone'
    },
    {
      id: 'replenishment' as ActiveTab,
      label: 'Reposição Automática',
      icon: Boxes,
      badge: null
    },
    {
      id: 'scanner' as ActiveTab,
      label: 'Leitor QR / Barras',
      icon: QrCode,
      badge: 'Leitura'
    },
    {
      id: 'import' as ActiveTab,
      label: 'Importação Planilha',
      icon: FileSpreadsheet,
      badge: 'Excel'
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Relatórios & Cautelas',
      icon: FileText,
      badge: 'PDF/CSV'
    },
    {
      id: 'erp' as ActiveTab,
      label: 'Integração ERP / APIs',
      icon: Network,
      badge: null
    },
    {
      id: 'audit' as ActiveTab,
      label: 'Trilha de Auditoria',
      icon: ShieldCheck,
      badge: null
    },
    {
      id: 'users' as ActiveTab,
      label: 'Gestão de Usuários',
      icon: Users,
      badge: 'RBAC'
    }
  ];

  const handleRoleChange = (role: UserRole) => {
    const selected = availableUsers.find(u => u.role === role) || availableUsers[0];
    setCurrentUser(selected);
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {systemSettings.systemLogoUrl ? (
            <img 
              src={systemSettings.systemLogoUrl} 
              alt={systemSettings.systemName} 
              className="w-9 h-9 object-contain rounded-lg bg-slate-900 border border-slate-700/80 p-0.5 shrink-0" 
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-tighter shrink-0">
              {systemSettings.systemName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-100 text-sm tracking-tight leading-tight truncate">
              {systemSettings.systemName}
            </span>
            <span className="text-[11px] text-slate-400 truncate">
              {systemSettings.companyName}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action: Live QR Scanner trigger */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={openScanner}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-colors"
        >
          <QrCode className="w-4 h-4" />
          <span>Escanear QR / Código</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Módulos
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Global Settings & Term Customization Links - Separated */}
        <div className="pt-2 border-t border-slate-900/80 space-y-0.5">
          {onOpenVisualIdentity && (
            <button
              onClick={onOpenVisualIdentity}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/80 transition-colors"
              title="Personalizar Nome da Empresa, Logotipos e Padrões de Cores"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Palette className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate">Identidade & Cores</span>
              </div>
              <span className="text-[10px] text-purple-400 font-mono">
                Logos
              </span>
            </button>
          )}

          {onOpenCategories && (
            <button
              onClick={onOpenCategories}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/80 transition-colors"
              title="Gerenciar Categorias de Equipamentos e Suprimentos e Listas Suspensas"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">Categorias & Listas</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">
                Opções
              </span>
            </button>
          )}

          {onOpenTermTemplates && (
            <button
              onClick={onOpenTermTemplates}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/80 transition-colors"
              title="Editar versões, títulos e adicionar cláusulas aos termos de cautela"
            >
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">Modelos de Termos</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">
                Cláusulas
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* User RBAC Selector & Simulation */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              Sessão Ativa
            </span>
            <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/50">
              {currentUser.role}
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-200 truncate">
            {currentUser.name}
          </div>
          <div className="text-[10px] font-mono text-cyan-400 truncate mb-1">
            @{currentUser.username}
          </div>
          <div className="text-[10px] text-slate-400 truncate mb-2">
            {currentUser.department}
          </div>

          <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-slate-800">
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-1.5 py-1 text-[10px] rounded text-center transition-colors ${currentUser.role === 'admin' ? 'bg-cyan-600 text-white font-medium' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'}`}
              title="Acesso completo ao sistema"
            >
              Admin TI
            </button>
            <button
              onClick={() => handleRoleChange('tecnico')}
              className={`px-1.5 py-1 text-[10px] rounded text-center transition-colors ${currentUser.role === 'tecnico' ? 'bg-cyan-600 text-white font-medium' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'}`}
              title="Operações de inventário e empréstimo"
            >
              Técnico TI
            </button>
            <button
              onClick={() => handleRoleChange('auditor')}
              className={`px-1.5 py-1 text-[10px] rounded text-center transition-colors ${currentUser.role === 'auditor' ? 'bg-cyan-600 text-white font-medium' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'}`}
              title="Visualização e auditoria em conformidade"
            >
              Auditor
            </button>
            <button
              onClick={() => handleRoleChange('solicitante')}
              className={`px-1.5 py-1 text-[10px] rounded text-center transition-colors ${currentUser.role === 'solicitante' ? 'bg-cyan-600 text-white font-medium' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'}`}
              title="Consulta e solicitação de empréstimos"
            >
              Solicitante
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
