import { Bell, QrCode, Plus, Search, RefreshCw, Palette, FileText, Building2, Layers } from 'lucide-react';
import { UserProfile, SystemSettings } from '../../types';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  currentUser: UserProfile;
  systemSettings: SystemSettings;
  notificationCount: number;
  openNotifications: () => void;
  openScanner: () => void;
  onOpenNewAsset?: () => void;
  onOpenNewLoan?: () => void;
  onRefreshData: () => void;
  onResetData: () => void;
  onOpenUsers?: () => void;
  onOpenVisualIdentity?: () => void;
  onOpenTermTemplates?: () => void;
  onOpenCategories?: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Painel Geral de Controle', subtitle: 'Métricas, SLA de locação e saúde do parque tecnológico' },
  assets: { title: 'Inventário de Ativos de TI & RPAS', subtitle: 'Equipamentos próprios, locados, drones e suprimentos' },
  loans: { title: 'Gestão de Empréstimos & Cautelas RPAS', subtitle: 'Controle de saídas temporárias, checklists de case e termos assinados' },
  replenishment: { title: 'Reposição Automática de Suprimentos', subtitle: 'Níveis de segurança, alertas e ordens de compra automatizadas' },
  scanner: { title: 'Leitor em Tempo Real (QR / Código de Barras)', subtitle: 'Identificação rápida via câmera ou leitor óptico' },
  import: { title: 'Importação de Dados em Lote (Excel & CSV)', subtitle: 'Carga inicial e sincronização direta por planilha' },
  reports: { title: 'Relatórios Gerenciais & Termos de Cautela', subtitle: 'Movimentações mensais, inventário e auditoria em PDF e CSV' },
  erp: { title: 'Integração ERP Corporativo & APIs', subtitle: 'Conexão REST com SAP, TOTVS, Senior e webhooks' },
  audit: { title: 'Trilha de Auditoria & Conformidade', subtitle: 'Registro imutável de todas as movimentações e acessos' },
  users: { title: 'Gestão de Usuários & Perfis (RBAC)', subtitle: 'Controle hierárquico de acessos e credenciais padrão' }
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentUser,
  systemSettings,
  notificationCount,
  openNotifications,
  openScanner,
  onOpenNewAsset,
  onOpenNewLoan,
  onRefreshData,
  onResetData,
  onOpenUsers,
  onOpenVisualIdentity,
  onOpenTermTemplates,
  onOpenCategories
}) => {
  const meta = TAB_TITLES[activeTab] || { title: systemSettings.systemName, subtitle: '' };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between gap-6 shrink-0 z-10">
      {/* Left zone: Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300">{systemSettings.systemName}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-400 truncate">{systemSettings.companyName}</span>
            <span aria-hidden="true">/</span>
            <span className="text-cyan-400 font-medium truncate">{meta.title}</span>
          </div>
          <h1 className="text-sm font-semibold text-white tracking-tight truncate">
            {meta.subtitle}
          </h1>
        </div>
      </div>

      {/* Right zone: Actions & Settings */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Categories & Lists Manager Button */}
        {onOpenCategories && (
          <button
            onClick={onOpenCategories}
            title="Gerenciar Categorias de Equipamentos/Suprimentos e Listas Suspensas"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Categorias & Listas</span>
          </button>
        )}

        {/* Visual Identity & Colors Button */}
        {onOpenVisualIdentity && (
          <button
            onClick={onOpenVisualIdentity}
            title="Personalizar Empresa, Logotipos e Padrões de Cores"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Identidade & Cores</span>
          </button>
        )}

        {/* Term Templates Editor Button */}
        {onOpenTermTemplates && (
          <button
            onClick={onOpenTermTemplates}
            title="Editar versões, títulos e adicionar cláusulas aos termos de cautela"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Modelos dos Termos</span>
          </button>
        )}

        {/* Reset / Reload Demo Data */}
        <button
          onClick={onRefreshData}
          title="Recarregar dados"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications Icon with Badge */}
        <button
          onClick={openNotifications}
          className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Central de Alertas e Notificações"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* Scanner Shortcut */}
        <button
          onClick={openScanner}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
        >
          <QrCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Leitor QR</span>
        </button>

        {/* Primary Action Button depending on context */}
        {activeTab === 'assets' && onOpenNewAsset && currentUser.role !== 'auditor' && currentUser.role !== 'solicitante' && (
          <button
            onClick={onOpenNewAsset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Ativo</span>
          </button>
        )}

        {activeTab === 'loans' && onOpenNewLoan && currentUser.role !== 'auditor' && (
          <button
            onClick={onOpenNewLoan}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Empréstimo</span>
          </button>
        )}
      </div>
    </header>
  );
};
