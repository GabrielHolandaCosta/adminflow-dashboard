import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '@/types';
import { usersApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import './Usuarios.css';

export const Usuarios = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(t('users.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role, // Manter o role original
      });
    } else {
      setEditingUser(null);
      // Se for usuário comum, só pode criar usuário comum
      setFormData({
        name: '',
        email: '',
        role: currentUser?.role === 'admin' ? 'user' : 'user', // Sempre cria como 'user' por padrão
      });
    }
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email) {
      setError(t('users.errorFillFields'));
      return;
    }

    try {
      if (editingUser) {
        // Se usuário comum está editando, não permitir alterar o role
        const updateData = currentUser?.role === 'user' 
          ? { name: formData.name, email: formData.email } 
          : formData;
        await usersApi.update(editingUser.id, updateData);
        setSuccess(t('users.successUpdated'));
      } else {
        // Se usuário comum está criando, garantir que seja apenas 'user'
        const createData = currentUser?.role === 'user'
          ? { ...formData, role: 'user' as const }
          : formData;
        await usersApi.create(createData);
        setSuccess(t('users.successCreated'));
      }
      await loadUsers();
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (err: any) {
      setError(err.message || t('users.errorSave'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('users.confirmDelete'))) {
      return;
    }

    try {
      await usersApi.delete(id);
      setSuccess(t('users.successDeleted'));
      await loadUsers();
    } catch (err: any) {
      setError(err.message || t('users.errorDelete'));
    }
  };

  // Funções de verificação de permissão
  const canEdit = (user: User): boolean => {
    if (!currentUser) return false;
    
    // Ninguém pode editar admin (exceto admin editando outro admin - mas não vamos permitir)
    if (user.role === 'admin') return false;
    
    // Admin pode editar usuários comuns
    if (currentUser.role === 'admin' && user.role === 'user') return true;
    
    // Usuário comum pode editar outros usuários comuns (opcional - permitindo)
    if (currentUser.role === 'user' && user.role === 'user' && currentUser.id !== user.id) return true;
    
    return false;
  };

  const canDelete = (user: User): boolean => {
    if (!currentUser) return false;
    
    // Não pode excluir a si mesmo
    if (currentUser.id === user.id) return false;
    
    // Ninguém pode excluir admin
    if (user.role === 'admin') return false;
    
    // Admin pode excluir usuários comuns
    if (currentUser.role === 'admin' && user.role === 'user') return true;
    
    // Usuário comum pode excluir outros usuários comuns (opcional - permitindo)
    if (currentUser.role === 'user' && user.role === 'user') return true;
    
    return false;
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="usuarios">
      <div className="usuarios-header">
        <div>
          <h1>{t('users.title')}</h1>
          <p>{t('users.subtitle')}</p>
        </div>
        <Button onClick={() => handleOpenModal()}>{t('users.newUser')}</Button>
      </div>

      <div className="usuarios-toolbar">
        <Input
          type="text"
          placeholder={t('users.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <span className="usuarios-count">
          {t('users.userCount', { count: filteredUsers.length })}
        </span>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p>{t('users.noUsersFound')}</p>
        </div>
      ) : (
        <div className="usuarios-grid">
          {filteredUsers.map((user) => (
            <div key={user.id} className="usuario-card">
              <div className="usuario-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="usuario-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <span className={`usuario-role usuario-role-${user.role}`}>
                  {user.role === 'admin' ? t('users.roleAdmin') : t('users.roleUser')}
                </span>
              </div>
              <div className="usuario-actions">
                {canEdit(user) ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenModal(user)}
                  >
                    {t('common.edit')}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled
                    title={
                      user.role === 'admin'
                        ? t('users.tooltipEditAdmin')
                        : currentUser?.id === user.id
                        ? t('users.tooltipEditSelf')
                        : t('users.tooltipNoPermission')
                    }
                  >
                    {t('common.edit')}
                  </Button>
                )}
                {canDelete(user) ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    {t('common.delete')}
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    disabled
                    title={
                      user.role === 'admin'
                        ? t('users.tooltipDeleteAdmin')
                        : currentUser?.id === user.id
                        ? t('users.tooltipDeleteSelf')
                        : t('users.tooltipNoDeletePermission')
                    }
                  >
                    {t('common.delete')}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? t('users.editUser') : t('users.newUser')}
      >
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <Input
            label={t('common.name')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label={t('common.email')}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Select
            label={t('users.role')}
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })
            }
            options={[
              { value: 'user', label: t('users.roleUser') },
              { value: 'admin', label: t('users.roleAdmin') },
            ]}
            disabled={
              !editingUser
                ? currentUser?.role === 'user' // Usuário comum não pode criar admin
                : currentUser?.role === 'user' || editingUser.role === 'admin' // Usuário comum não pode alterar permissões OU não pode alterar role de admin
            }
          />
          {editingUser && editingUser.role === 'admin' && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '-0.75rem', marginBottom: '0' }}>
              {t('users.warningAdminPermission')}
            </p>
          )}
          {editingUser && currentUser?.role === 'user' && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '-0.75rem', marginBottom: '0' }}>
              {t('users.warningUserPermission')}
            </p>
          )}
          {!editingUser && currentUser?.role === 'user' && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '-0.75rem', marginBottom: '0' }}>
              {t('users.warningUserCreateAdmin')}
            </p>
          )}
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{editingUser ? t('common.update') : t('common.create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

