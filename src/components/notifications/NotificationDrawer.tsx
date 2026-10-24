import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  Calendar, 
  Boxes, 
  ArrowLeftRight, 
  CheckCheck,
  ChevronRight
} from 'lucide-react';
import { SystemNotification } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onNavigateToItem: (type: 'asset' | 'loan' | 'supply', targetId?: string) => void;
  onClearNotifications: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onNavigateToItem,
  onClearNotifications
}) => {
  if (!isOpen) return null;

  const [filter, setFilter] = useState<'todos' | 'estoque' | 'garantia' | 'emprestimo'>('todos');

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'estoque') return n.type === 'estoque_critico';
    if (filter === 'garantia') return n.type === 'garantia_vencendo' || n.type === 'locacao_vencendo';
    if (filter === 'emprestimo') return n.type === 'emprestimo_atrasado';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Painel Central de Notificações</h2>
              <p className="text-[11px] text-slate-400">
                {notifications.length} alertas operacionais detectados
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center gap-1.5 text-xs overflow-x-auto">
          <button
            onClick={() => setFilter('todos')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              filter === 'todos' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('estoque')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              filter === 'estoque' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Estoque
          </button>
          <button
            onClick={() => setFilter('garantia')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              filter === 'garantia' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Garantias/Locação
          </button>
          <button
            onClick={() => setFilter('emprestimo')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              filter === 'emprestimo' ? 'bg-slate-800 text-rose-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Empréstimos
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              <CheckCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-slate-300 font-medium">Nenhum alerta pendente</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Todos os prazos, garantias e estoques estão em dia.</p>
            </div>
          ) : (
            filteredNotifs.map(notif => {
              const isCritical = notif.severity === 'alta';
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.targetType) {
                      onNavigateToItem(notif.targetType, notif.targetId);
                      onClose();
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] ${
                    isCritical
                      ? 'bg-rose-950/20 border-rose-900/60 hover:border-rose-700'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                        notif.type === 'estoque_critico' ? 'bg-amber-500/20 text-amber-400' :
                        notif.type === 'emprestimo_atrasado' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {notif.type === 'estoque_critico' ? <Boxes className="w-3.5 h-3.5" /> :
                         notif.type === 'emprestimo_atrasado' ? <ArrowLeftRight className="w-3.5 h-3.5" /> :
                         <Calendar className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {notif.title}
                        </h4>
                        <p className="text-[11px] text-slate-300/90 mt-1 leading-relaxed">
                          {notif.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono">{new Date(notif.date).toLocaleDateString('pt-BR')}</span>
                    <span className="text-cyan-400 flex items-center gap-0.5 font-medium">
                      <span>Ver Item</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs">
          <span className="text-slate-400 text-[11px]">
            Alertas recalculados em tempo real
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
