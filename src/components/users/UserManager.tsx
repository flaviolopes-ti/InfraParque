import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Search, 
  UserCheck, 
  Building2,
  Copy,
  Check
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface UserManagerProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onSaveUser: (userData: Partial<UserProfile>) => void;
  onDeleteUser: (userId: string) => void;
  onSwitchUser: (user: UserProfile) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({
  users,
  currentUser,
  onSaveUser,
  onDeleteUser,
  onSwitchUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'todos' | UserRole>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Suporte2026*');
  const [role, setRole] = useState<UserRole>('tecnico');
  const [department, setDepartment] = useState('Tecnologia da Informação');
  const [jobTitle, setJobTitle] = useState('Analista de TI');
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');
  const [phone, setPhone] = useState('(61) 3314-5000');
  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditingUser(null);
    setName('');
    setUsername('');
    setEmail('');
    setPassword('Suporte2026*');
    setRole('tecnico');
    setDepartment('Núcleo de Tecnologia da Informação (NTI) - SEINFRA');
    setJobTitle('Técnico de Suporte');
    setStatus('ativo');
    setPhone('(61) 3314-5000');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setName(user.name);
    setUsername(user.username || user.email.split('@')[0]);
    setEmail(user.email);
    setPassword(user.password || 'Suporte2026*');
    setRole(user.role);
    setDepartment(user.department);
    setJobTitle(user.jobTitle || '');
    setStatus(user.status || 'ativo');
    setPhone(user.phone || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome completo é obrigatório.');
      return;
    }
    if (!username.trim()) {
      setError('O login / username é obrigatório.');
      return;
    }
    if (!email.trim()) {
      setError('O e-mail é obrigatório.');
      return;
    }

    const userData: Partial<UserProfile> = {
      ...(editingUser ? { id: editingUser.id } : {}),
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim(),
      password: password || 'Suporte2026*',
      role,
      department: department.trim(),
      jobTitle: jobTitle.trim(),
      status,
      phone: phone.trim()
    };

    onSaveUser(userData);
    setIsModalOpen(false);
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText('nti.seinfra');
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2000);
  };

  const filteredUsers = users.filter(u => {
    const query = searchTerm.toLowerCase();
    const matches = 
      u.name.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.department.toLowerCase().includes(query) ||
      (u.jobTitle || '').toLowerCase().includes(query);

    if (!matches) return false;
    if (roleFilter !== 'todos' && u.role !== roleFilter) return false;

    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Gestão de Usuários & Perfis de Acesso (RBAC)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastre administradores, operadores técnicos, auditores governamentais e solicitantes
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Usuário</span>
        </button>
      </div>

      {/* Official Credentials Banner with masked password */}
      <div className="p-4 rounded-xl bg-slate-900 border border-cyan-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Usuário Padrão com Permissão Master (Superusuário)
            </h3>
            <div className="flex items-center gap-4 text-xs font-mono text-cyan-300 mt-1 flex-wrap">
              <span>Login: <strong className="text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">nti.seinfra</strong></span>
              <span>Senha: <strong className="text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 tracking-widest">••••••••••••</strong></span>
              <span className="text-slate-400 text-[11px] font-sans">(Senha oculta por diretriz de segurança - informada no chat do sistema)</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyCredentials}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-center"
        >
          {copiedCreds ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{copiedCreds ? 'Copiado!' : 'Copiar Login'}</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, login (username), e-mail ou departamento..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setRoleFilter('todos')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${roleFilter === 'todos' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Todos ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${roleFilter === 'admin' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Admin TI
          </button>
          <button
            onClick={() => setRoleFilter('tecnico')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${roleFilter === 'tecnico' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Técnico TI
          </button>
          <button
            onClick={() => setRoleFilter('auditor')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${roleFilter === 'auditor' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Auditor
          </button>
          <button
            onClick={() => setRoleFilter('solicitante')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${roleFilter === 'solicitante' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Solicitante
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3 px-4 font-medium">Nome & Login</th>
                <th className="py-3 px-4 font-medium">Perfil RBAC</th>
                <th className="py-3 px-4 font-medium">Departamento / Cargo</th>
                <th className="py-3 px-4 font-medium">E-mail & Telefone</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Nenhum usuário localizado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isCurrent = currentUser.id === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                            user.role === 'admin' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' :
                            user.role === 'tecnico' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' :
                            user.role === 'auditor' ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {user.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 flex items-center gap-2">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.2 rounded font-mono">
                                  VOCÊ
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-cyan-400">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded font-mono uppercase ${
                          user.role === 'admin' ? 'bg-purple-950/80 text-purple-300 border border-purple-800' :
                          user.role === 'tecnico' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800' :
                          user.role === 'auditor' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' :
                          'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {user.role === 'admin' ? 'Admin TI' :
                           user.role === 'tecnico' ? 'Técnico TI' :
                           user.role === 'auditor' ? 'Auditor / Compliance' : 'Solicitante'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200">{user.department}</div>
                        <div className="text-[11px] text-slate-400">{user.jobTitle || 'Sem cargo definido'}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        <div>{user.email}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{user.phone || 'Sem telefone'}</div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          user.status === 'ativo' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isCurrent && (
                            <button
                              onClick={() => onSwitchUser(user)}
                              title="Alternar para esta conta"
                              className="px-2.5 py-1 text-[11px] font-semibold bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded transition-colors flex items-center gap-1"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Assumir</span>
                            </button>
                          )}

                          <button
                            onClick={() => openEditModal(user)}
                            title="Editar Usuário"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {user.username !== 'nti.seinfra' && (
                            <button
                              onClick={() => {
                                if (confirm(`Deseja remover o usuário ${user.name}?`)) {
                                  onDeleteUser(user.id);
                                }
                              }}
                              title="Excluir Usuário"
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                {editingUser ? 'Editar Cadastro de Usuário' : 'Novo Usuário do Sistema'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silva"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Login / Username *</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Ex: nti.seinfra"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Senha de Acesso</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">E-mail Corporativo *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="usuario@seinfra.gov.br"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Perfil de Acesso (RBAC)</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="admin">Administrador TI (Acesso Total)</option>
                    <option value="tecnico">Técnico TI (Operador & Cautelas)</option>
                    <option value="auditor">Auditor (Compliance & Somente Leitura)</option>
                    <option value="solicitante">Solicitante (Usuário Comum)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Secretaria / Órgão / Depto</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="Ex: NTI - SEINFRA"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Cargo / Função</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="Ex: Analista de Redes"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Telefone / Ramal</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(61) 3314-5000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status da Conta</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as 'ativo' | 'inativo')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo / Bloqueado</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  {editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
